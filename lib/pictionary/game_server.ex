defmodule Pictionary.GameServer do
  use GenServer,
    # Avoid restarting children
    restart: :transient

  require Logger

  ## Public API

  ## GenServer callbacks

  @too_close_similarity 0.90
  @max_score 250
  @score_interval 10
  @word_choose_time 10_000
  @inter_round_cooldown 4000
  @inter_draw_cooldown 5000

  def start_link(game_id) when game_id != nil do
    Logger.info("Starting Game server for #{game_id}")
    GenServer.start_link(__MODULE__, game_id, name: {:global, "GameServer##{game_id}"})
  end

  def init(game_id) do
    Logger.info("Initializing game server for #{game_id}")
    {:ok, init_game_state(game_id)}
  end

  def handle_cast(:stop, state), do: {:stop, :normal, state}

  def handle_cast({:add_player, player_id}, state) do
    IO.puts(
      "Restored player #{player_id} score to #{Map.get(state.players_who_left, player_id) || 0}"
    )

    {:noreply,
     %{
       state
       | players:
           Map.put_new(state.players, player_id, Map.get(state.players_who_left, player_id) || 0),
         remaining_drawers: state.remaining_drawers ++ [player_id]
     }}
  end

  def handle_cast({:update_canvas_data, canvas_data}, state) do
    {:noreply, %{state | canvas_data: canvas_data}}
  end

  def handle_cast({:vote_to_kick, player_id}, state) do
    if state.drawer_id != player_id && !MapSet.member?(state.vote_to_kick_set, player_id) do
      vote_to_kick_set = MapSet.put(state.vote_to_kick_set, player_id)

      PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "vote_kick_update", %{
        vote_count: MapSet.size(vote_to_kick_set)
      })

      # If everyone voted then kick player
      if map_size(state.players) - 1 <= MapSet.size(vote_to_kick_set) do
        PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "kick_player", %{
          player_id: state.drawer_id
        })
      end

      {:noreply, %{state | vote_to_kick_set: vote_to_kick_set}}
    else
      {:noreply, state}
    end
  end

  def handle_cast({:remove_player, player_id}, state) do
    # Remove the player who left
    current_score = Map.get(state.players, player_id)
    state = %{state | players: Map.delete(state.players, player_id)}

    state =
      if player_id == state.drawer_id do
        Process.cancel_timer(state.game_timer)

        game_timer =
          Process.send_after(self(), {:game_timer, state.drawer_id, state.current_round}, 0)

        %{state | game_timer: game_timer}
      else
        handle_all_answered(state)
      end

    if map_size(state.players) <= 1 do
      end_game(state)
    else
      {:noreply,
       %{
         state
         | remaining_drawers: List.delete(state.remaining_drawers, player_id),
           players_who_left: Map.put(state.players_who_left, player_id, current_score)
       }}
    end
  end

  def handle_call({:get_state, user_id}, _from, state) do
    score = Map.get(state.players_who_left, user_id) || 0
    players = Map.put(state.players, user_id, score)

    elapsed_time = trunc(:os.system_time(:millisecond) / 1000 - (state.draw_start || 0) / 1000)

    restored_state =
      state
      |> Map.take([:drawer_id, :current_round, :current_word, :draw_time, :rounds, :canvas_data])
      |> Map.merge(%{players: players, elapsed_time: elapsed_time})

    {
      :reply,
      restored_state,
      state
    }
  end

  def handle_call({:select_word, word_data}, _from, state) do
    Process.send_after(self(), {:word_selected, word_data}, 0)

    {:reply, :ok, state}
  end

  # When a new message arrives these are possible cases:
  # 1) Incorrect guess
  # 2) Correct guess
  #   i) Correct guess and not last player to guess
  #   ii) Correct guess and last player to guess
  def handle_call({:new_message, {sender_id, message}}, _from, state) do
    message_type =
      message
      |> String.downcase()
      |> String.jaro_distance(state.current_word || "")
      |> case do
        1.0 -> :correct_guess
        similarity when similarity > @too_close_similarity -> :too_close_guess
        _ -> :wrong_guess
      end

    new_message = %{
      id: Ecto.UUID.generate(),
      type: message_type,
      sender_id: sender_id,
      message: message,
      sent_at: DateTime.utc_now()
    }

    state =
      cond do
        # If the message sender is not the drawer and has not already guessed the correct answer
        sender_id != state.drawer_id && !Map.has_key?(state.correct_guessed_players, sender_id) ->
          PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "new_message", new_message)

          if message_type == :correct_guess,
            do: handle_correct_answer(state, sender_id),
            else: state

        true ->
          state
      end

    {:reply, :ok, state}
  end

  def handle_info({:random_word_select, words}, state) when is_nil(state.current_word) do
    [random_selection | _rest] = Enum.shuffle(words)
    Logger.info("#{DateTime.utc_now()} Choose random word #{inspect(random_selection)}")
    Process.send_after(self(), {:word_selected, random_selection}, 0)
    {:noreply, state}
  end

  def handle_info({:random_word_select, _words}, state), do: {:noreply, state}

  def handle_info({:word_selected, [type, word]}, state) when is_nil(state.current_word) do
    # Cancel any existing running timer
    if state.game_timer, do: Process.cancel_timer(state.game_timer)
    if state.word_select_timer, do: Process.cancel_timer(state.word_select_timer)

    PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "selected_word", %{data: word})
    type = if type in ["word_store", "custom_word"], do: String.to_atom(type), else: type

    state =
      remove_selected_word_from_pool(type, word, state)
      |> Map.put(:current_word, word)

    Logger.info("#{DateTime.utc_now()} Selected word #{inspect(word)}")

    {:noreply,
     %{
       state
       | game_timer:
           Process.send_after(
             self(),
             {:game_timer, state.drawer_id, state.current_round},
             state.draw_time * 1000
           ),
         word_select_timer: nil,
         draw_start: :os.system_time(:millisecond)
     }}
  end

  def handle_info({:word_selected, _}, state), do: {:noreply, state}

  def handle_info({:game_timer, drawer, round}, state)
      when state.drawer_id == drawer and state.current_round == round do
    Process.cancel_timer(state.game_timer)

    if state.current_word do
      PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "word_was", %{
        current_word: state.current_word,
        drawer_id: drawer,
        correct_guessed_players:
          Map.put(state.correct_guessed_players, drawer, state.drawer_current_score)
      })
    end

    cond do
      # Drawers are remaining in this round
      length(state.remaining_drawers) > 0 ->
        Logger.info("Send braodcast for #{state.current_word} for drawer #{state.drawer_id}")

        Process.send_after(self(), :new_drawer, @inter_draw_cooldown)

        {:noreply, state}

      # No more drawers remaining && not last round
      state.current_round < state.rounds ->
        Logger.info("#{DateTime.utc_now()} Round end!")

        Process.send_after(
          self(),
          :start_next_round,
          if(state.current_round == 0, do: 1000, else: @inter_round_cooldown)
        )

        {:noreply, state}

      # Last round
      true ->
        Logger.info("#{DateTime.utc_now()} Last round Game ending, Round: #{state.current_round}")

        end_game(state)
    end
  end

  def handle_info({:game_timer, _drawer, _round}, state), do: {:noreply, state}

  def handle_info(:new_drawer, state) do
    word1 = select_word(state, [])
    word2 = select_word(state, [word1])
    word3 = select_word(state, [word1, word2])
    words = [word1, word2, word3]

    # Choose next drawer
    {new_drawer, remaining_drawers} =
      case state.remaining_drawers do
        [new_drawer | remaining_drawers] -> {new_drawer, remaining_drawers}
        _ -> {state.drawerId, state.remaining_drawers}
      end

    PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "new_drawer_words", %{
      drawer_id: new_drawer,
      words: words
    })

    rm = Enum.join(remaining_drawers, ", ")
    Logger.info("Round:#{state.current_round} Drawer: #{new_drawer} Remaining Drawers: #{rm}")

    {:noreply,
     %{
       state
       | drawer_id: new_drawer,
         remaining_drawers: remaining_drawers,
         current_word: nil,
         correct_guessed_players: %{},
         drawer_current_score: 0,
         vote_to_kick_set: MapSet.new(),
         # Choose random word after word choosing timeout
         word_select_timer:
           Process.send_after(self(), {:random_word_select, words}, @word_choose_time)
     }}
  end

  def handle_info(:start_next_round, state) do
    Logger.info("#{DateTime.utc_now()} Starting round #{state.current_round + 1}")

    PictionaryWeb.Endpoint.broadcast!(
      "game:#{state.game_id}",
      "new_round",
      %{data: state.current_round + 1}
    )

    game_timer =
      Process.send_after(
        self(),
        {:game_timer, nil, state.current_round + 1},
        if(state.current_round == 0, do: 1000, else: 0)
      )

    {:noreply,
     %{
       reset_state(state)
       | drawer_id: nil,
         game_timer: game_timer,
         current_round: state.current_round + 1
     }}
  end

  ## Private functions

  defp init_game_state(game_id) do
    game = Pictionary.Stores.GameStore.get_game(game_id)

    %{
      game_id: game_id,
      draw_time: game.time,
      rounds: game.rounds,
      unused_custom_words: MapSet.new(game.custom_words),
      custom_words_probability: game.custom_words_probability,
      # Player map with score
      players: game.players |> Enum.into(%{}, fn player -> {player, 0} end),
      # Players who have guessed correct answers
      correct_guessed_players: %{},
      # Drawer score for current ongoing drawing
      drawer_current_score: 0,
      # Players who have not yet drawn in current round
      remaining_drawers: [],
      # Set of players who votekicked
      vote_to_kick_set: MapSet.new(),
      # Current player id who is drawing
      drawer_id: nil,
      current_round: 0,
      current_word: nil,
      game_timer: Process.send_after(self(), {:game_timer, nil, 0}, 1000),
      word_select_timer: nil,
      used_words: MapSet.new(),
      players_who_left: %{},
      draw_start: nil,
      canvas_data: nil
    }
  end

  defp reset_state(state) do
    game = Pictionary.Stores.GameStore.get_game(state.game_id)

    # Maybe here update new players who have joined in state, but they wont have score

    %{
      state
      | correct_guessed_players: %{},
        drawer_current_score: 0,
        remaining_drawers: MapSet.to_list(game.players),
        drawer_id: nil,
        current_word: nil,
        vote_to_kick_set: MapSet.new()
    }
  end

  defp update_score(
         %{
           players: players,
           drawer_id: drawer_id,
           correct_guessed_players: correct_guessed_players,
           drawer_current_score: drawer_current_score
         } = game_state,
         guesser_id
       ) do
    guesser_score = @max_score - map_size(correct_guessed_players) * @score_interval

    # Update Guesser score
    players = update_player_score(players, guesser_id, guesser_score)

    # Update Drawer Score
    players = update_player_score(players, drawer_id, guesser_score / 2)

    PictionaryWeb.Endpoint.broadcast!("game:#{game_state.game_id}", "score_update", %{
      data: players
    })

    %{
      game_state
      | players: players,
        correct_guessed_players: Map.put(correct_guessed_players, guesser_id, guesser_score),
        drawer_current_score: drawer_current_score + guesser_score / 2
    }
  end

  defp update_player_score(players, player_id, score) do
    {_, players} =
      Map.get_and_update(players, player_id, fn current_score ->
        if is_nil(current_score),
          do: {nil, score},
          else: {current_score, current_score + score}
      end)

    players
  end

  defp remove_selected_word_from_pool(:word_store, word, state),
    do: %{state | used_words: MapSet.put(state.used_words, word)}

  defp remove_selected_word_from_pool(:custom_word, word, state),
    do: %{state | unused_custom_words: MapSet.delete(state.unused_custom_words, word)}

  defp remove_selected_word_from_pool(_, _, state), do: state

  defp select_word(
         %{
           used_words: used_words,
           unused_custom_words: unused_custom_words,
           custom_words_probability: custom_words_probability
         },
         selected_words
       ) do
    random = :rand.uniform(100)

    selected_words =
      selected_words
      |> Enum.map(fn [_, word] -> word end)
      |> MapSet.new()

    unused_custom_words = MapSet.difference(unused_custom_words, selected_words)

    # More the probablity of custom words more the chance for the random number to be smaller than it
    if random < custom_words_probability && MapSet.size(unused_custom_words) != 0 do
      [
        :custom_word,
        unused_custom_words
        |> select_random()
      ]
    else
      [
        :word_store,
        Pictionary.Stores.WordStore.get_words_list()
        |> MapSet.difference(used_words)
        |> MapSet.difference(selected_words)
        |> select_random()
      ]
    end
  end

  defp select_random(map_set) do
    [word] =
      map_set
      |> MapSet.to_list()
      |> Enum.shuffle()
      |> Enum.take(1)

    word
  end

  defp handle_correct_answer(state, sender_id) do
    state = update_score(state, sender_id)

    # All players answered except drawer
    handle_all_answered(state)
  end

  defp handle_all_answered(state) do
    if map_size(state.players) - 1 <= map_size(state.correct_guessed_players) do
      Process.cancel_timer(state.game_timer)

      game_timer =
        Process.send_after(self(), {:game_timer, state.drawer_id, state.current_round}, 0)

      %{state | game_timer: game_timer}
    else
      state
    end
  end

  defp end_game(state) do
    Task.start_link(fn ->
      # Wait for 2 seconds and then broadcast game over
      Process.sleep(2000)

      PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "game_over", %{
        data: state.players
      })
    end)

    {:stop, :normal, state}
  end
end
