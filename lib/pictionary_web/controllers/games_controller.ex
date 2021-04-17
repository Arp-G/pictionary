defmodule PictionaryWeb.GamesController do
  use PictionaryWeb, :controller
  alias Pictionary.Game

  def create(%{assigns: %{current_user: current_user}} = conn, _params) do
    game = %Game{players: [current_user], creator_id: current_user.id}
    render(conn, "show.json", game: game)
  end
end
