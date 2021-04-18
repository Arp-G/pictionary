defmodule PictionaryWeb.GameChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore
  alias PictionaryWeb.GamesView

  def join("game:" <> game_id, _payload, socket) do
    case GameStore.get_game(game_id) do
      [] -> {:error, %{reason: "game not found"}}
      _ -> {:ok, assign(socket, :game_id, game_id)}
    end
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in(
        "update_game",
        %{"creator_id" => creator_id} = game_params,
        %Phoenix.Socket{assigns: %{current_user: current_user}} = socket
      )
      when creator_id == current_user.id do
    game = GameStore.update_game(game_params)

    # use broadcast_from to avoid sending broadcast to socket owner
    broadcast_from(socket, "game_settings_updated", GamesView.render("show.json", %{game: game}))
    {:reply, :ok, socket}
  end
end
