defmodule PictionaryWeb.GamesController do
  use PictionaryWeb, :controller
  alias Pictionary.Game
  alias Pictionary.Stores.GameStore

  def create(%{assigns: %{current_user: current_user}} = conn, _params) do
    game = %Game{
      id: Ecto.UUID.generate(),
      players: MapSet.new([current_user.id]),
      creator_id: current_user.id
    }

    GameStore.add_game(game)
    render(conn, "show.json", game: game)
  end

  def show(conn, %{"game_id" => game_id}) do
    game = GameStore.get_game(game_id)

    if game do
      render(conn, "show.json", game: GameStore.get_game(game_id))
    else
      conn
      |> Plug.Conn.put_status(:not_found)
      |> json(%{error: "Game not found"})
    end
  end
end
