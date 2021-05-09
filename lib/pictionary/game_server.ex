defmodule Pictionary.GameServer do
  use GenServer
  require Logger

  ## Public API

  ## GenServer callbacks

  @too_close_similarity 0.90
  @max_score 250
  @score_interval 10
  @word_choose_time 10000
  @inter_round_cooldown 3000

  def start_link(game_id) when game_id != nil do
    Logger.info("Starting Game server for #{game_id}")
    GenServer.start_link(__MODULE__, game_id, name: {:global, "GameServer##{game_id}"})
  end

  def init(game_id) do
    Logger.info("Initializing game server for #{game_id}")
    Process.send_after(self(), {:game_timer, nil, 0}, 1000)
    {:ok, init_state(game_id)}
  end

  def handle_call({:select_word, word_data}, _from, state) do
    Process.send_after(self(), {:word_selected, word_data}, 0)
    {:reply, state}
  end

  # When a new message arrives these are possible cases:
  # 1) Incorrect guess
  # 2) Correct guess
  #   i) Correct guess and not last player to guess
  #   ii) Correct guess and last player to guess
  def handle_call({:new_message, {sender_id, message}}, _from, state) do
    message_type =
      case String.jaro_distance(message, state.current_word || "") do
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

    cond do
      # If the message sender is not the drawer and has not already guessed the correct answer
      sender_id != state.drawer_id && !MapSet.member?(state.correct_guessed_players, sender_id) ->
        PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "new_message", new_message)

        if message_type == :correct_guess do
          state = update_score(state, sender_id)

          # All players answered expect drawer
          if map_size(state.players) - 1 <= map_size(state.correct_guessed_players),
            do: Process.send_after(self(), :all_answered, 0)

          {:reply, state}
        end

      true ->
        {:reply, state, state}
    end
  end

  def handle_info({:random_word_select, words}, state) do
    [random_selection | _rest] = Enum.shuffle(words)
    Logger.info("Choose random word #{inspect(random_selection)}")
    Process.send_after(self(), {:word_selected, random_selection}, 0)
    {:noreply, state}
  end

  def handle_info({:word_selected, [type, word]}, state) when is_nil(state.current_word) do
    PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "selected_word", %{
      selected_word: word
    })

    state =
      remove_selected_word(type, word, state)
      |> Map.put(:current_word, word)

    {:noreply, state}
  end

  def handle_info({:word_selected, _}, state), do: {:noreply, state}

  # Everyone has guessed
  def handle_info(:all_answered, state), do: {:noreply, start_next_round(state)}

  def handle_info({:game_timer, drawer, round}, state)
      when state.drawer_id == drawer and state.current_round == round do
    Logger.info("#{inspect DateTime.utc_now} Game timer Ping ! #{inspect({:game_timer, drawer, round})}")

    cond do
      # Drawers are remaining in this round
      length(state.remaining_drawers) > 0 ->
        word1 = select_word(state, [])
        word2 = select_word(state, [word1])
        word3 = select_word(state, [word1, word2])
        words = [word1, word2, word3]

        PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "new_words", %{
          drawer_id: drawer,
          words: words
        })

        Logger.info("Sent words #{inspect(words)}")

        Process.send_after(self(), {:random_word_select, words}, @word_choose_time)

        # Choose next drawer

        [new_drawer | remaining_drawers] = state.remaining_drawers

        Process.send_after(
          self(),
          {:game_timer, new_drawer, round},
          #state.draw_time * 1000 + @word_choose_time
          5 * 1000 + @word_choose_time
        )

        Logger.info("#{inspect DateTime.utc_now} Choosing new drawer, Round: #{state.current_round}    Drawer: #{new_drawer}    Remaining Drawers: #{Enum.join(remaining_drawers, ",")}")

        {:noreply,
         %{
           state
           | drawer_id: new_drawer,
             remaining_drawers: remaining_drawers
         }}

      # No more drawers remaining && not last round
      state.current_round < state.rounds ->
        Logger.info("Round end!")
        {:noreply, start_next_round(state)}

      # Last round
      true ->
        Logger.info("Last round Game ending, Round: #{state.current_round}")
        # TODO: Shutdown channel game topic
        PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "game_over", %{
          players: state.players
        })

        {:stop, :game_over, state}
    end
  end

  def handle_info({:game_timer, drawer, round}, state) do
    Logger.info("Ignored game timer call #{inspect {:game_timer, drawer, round}}")
    Logger.info(inspect state)
    {:noreply, state}
  end

  def init_state(game_id) do
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
      correct_guessed_players: MapSet.new(),
      # Players who have not yet drawn in current round
      remaining_drawers: [],
      # Current player id who is drawing
      drawer_id: nil,
      current_round: 0,
      current_word: nil,
      used_words: MapSet.new()
    }
  end

  def reset_state(state) do
    game = Pictionary.Stores.GameStore.get_game(state.game_id)

    # Maybe here update new players who have joined in state, but they wont have score

    %{
      state
      | correct_guessed_players: MapSet.new(),
        remaining_drawers: MapSet.to_list(game.players),
        drawer_id: nil,
        current_word: nil
    }
  end

  def start_next_round(state) do
    Logger.info("#{DateTime.utc_now} Starting round #{state.current_round + 1}")

    PictionaryWeb.Endpoint.broadcast!(
      "game:#{state.game_id}",
      "new_round",
      %{round: state.current_round + 1}
    )

    Process.send_after(
      self(),
      {:game_timer, nil, state.current_round + 1},
      @inter_round_cooldown
    )

    %{ reset_state(state) | drawer_id: nil, current_round: state.current_round + 1 }
  end

  ## Private functions

  def update_score(
        %{
          players: players,
          drawer_id: drawer_id,
          correct_guessed_players: correct_guessed_players
        } = game_state,
        guesser_id
      ) do
    guesser_score = @max_score - length(correct_guessed_players) * @score_interval

    # Update Guesser score
    players = update_player_score(players, guesser_id, guesser_score)

    # Update Drawer Score
    players = update_player_score(players, drawer_id, guesser_score / 2)

    %{
      game_state
      | players: players,
        correct_guessed_players: [guesser_id | correct_guessed_players]
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

  defp remove_selected_word(:word_store, word, state),
    do: %{state | used_words: MapSet.put(state.used_words, word)}

  defp remove_selected_word(:custom_word, word, state),
    do: %{state | unused_custom_words: MapSet.delete(state.unused_custom_words, word)}

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
end
