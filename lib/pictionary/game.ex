defmodule Pictionary.Game do
  defstruct([
    id: Ecto.UUID.generate(),
    rounds: 3,
    time: 60,
    max_players: 10,
    custom_words: [],
    custom_words_probability: 50,
    public_game: true,
    vote_kick_enabled: true,
    players: MapSet.new(),
    started: false,
    creator_id: nil,
    created_at: DateTime.utc_now(),
    updated_at: DateTime.utc_now(),
  ])

  @type t :: %__MODULE__{
          id: String.t(),
          rounds: number(),
          time: number(),
          max_players: number(),
          custom_words: list(),
          custom_words_probability: number(),
          public_game: boolean(),
          vote_kick_enabled: boolean(),
          players: MapSet.t(),
          creator_id: String.t(),
          created_at: t(),
          updated_at: t(),
          started: boolean()
        }
end
