defmodule PictionaryWeb.GamesView do
  use PictionaryWeb, :view

  def render("show.json", %{game: game}) do
    %{
      id: game.id,
      rounds: game.rounds,
      time: game.time,
      max_players: game.max_players,
      custom_words: game.custom_words |> Enum.join(", "),
      custom_words_probability: game.custom_words_probability,
      public_game: game.public_game,
      vote_kick_enabled: game.vote_kick_enabled,
      players: game |> get_game_players() |> render_many(PictionaryWeb.UserView, "show.json"),
      started: game.started,
      creator_id: game.creator_id
    }
  end

  def render("show_limited.json", %{game: game}) do
    %{
      id: game.id,
      rounds: game.rounds,
      time: game.time,
      max_players: game.max_players,
      public_game: game.public_game,
      vote_kick_enabled: game.vote_kick_enabled,
      started: game.started,
      creator_id: game.creator_id
    }
  end

  defp get_game_players(game) do
    game.players
    |> MapSet.to_list()
    |> Pictionary.Stores.UserStore.get_users()
  end
end
