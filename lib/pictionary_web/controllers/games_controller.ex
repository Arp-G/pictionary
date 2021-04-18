defmodule PictionaryWeb.GamesController do
  use PictionaryWeb, :controller
  alias Pictionary.Game
  alias Pictionary.Stores.GameStore

  def create(%{assigns: %{current_user: current_user}} = conn, _params) do
    game = %Game{players: [current_user], creator_id: current_user.id}
    GameStore.add_game(game)
    render(conn, "show.json", game: game)
  end
end
