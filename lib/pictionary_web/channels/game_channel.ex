defmodule PictionaryWeb.GameChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore
  alias PictionaryWeb.GamesView
  alias PictionaryWeb.Presence

  def join("game:" <> game_id, _payload, socket) do
    case GameStore.get_game(game_id) do
      nil ->
        {:error, %{reason: "Game not found"}}

      game ->
        if MapSet.size(game.players) >= game.max_players do
          {:error, %{reason: "Game Full!"}}
        else
          send(self(), {:after_join, game_id})
          {:ok, assign(socket, :game_id, game_id)}
        end
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
    broadcast(socket, "game_settings_updated", GamesView.render("show.json", %{game: game}))
    {:reply, :ok, socket}
  end

  def handle_info({:after_join, game_id}, %{assigns: %{current_user: user}} = socket) do
    :ok =
      Pictionary.GameChannelWatcher.monitor(
        self(),
        {game_id, socket.assigns.current_user.id}
      )

    {:ok, _} = Presence.track(socket, user.id, %{user_data: user})

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
