defmodule Pictionary.GameServer do
  use GenServer
  require Logger

  ## Public API

  ## GenServer callbacks

  @too_close_similarity 0.90

  def start_link(game_id) when game_id != nil do
    GenServer.start_link(__MODULE__, game_id, name: {:global, "GameServer##{game_id}"})
  end

  def init(game_id) do
    {:ok, init_state(game_id)}
  end

  def handle_call({:new_message, {sender_id, message}}, _from, state) do
    message_type =
      case String.jaro_distance(message, state.current_word) do
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

    PictionaryWeb.Endpoint.broadcast!("game:#{state.game_id}", "new_message", new_message)

    {:reply, Map.put(state, :messages, [new_message | state.messages]), state}
  end

  def init_state(game_id) do
    %{
      game_id: game_id,
      messages: [],
      current_state: :not_started,
      current_drawer: nil,
      current_round: 0,
      scores: %{},
      current_word: "elephant man",
      used_words: [],
      used_custom_words: []
    }
  end
end
