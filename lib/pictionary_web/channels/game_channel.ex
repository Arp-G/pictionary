defmodule PictionaryWeb.GameChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore
  alias PictionaryWeb.GamesView

  def join(
        "game:" <> game_id,
        _payload,
        %Phoenix.Socket{assigns: %{current_user: current_user}} = socket
      ) do
    IO.inspect("User #{current_user.name} joined room #{game_id} !")
    # Process.send_after(self(), :ping, 1000)
    {:ok, socket}
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
    IO.puts("GOT game update params #{inspect(game_params)}")
    game = GameStore.update_game(game_params)

    # use broadcast_from to avoid sending broadcast to scoket owner
    broadcast(socket, "ping", GamesView.render("show.json", %{game: game}))
    {:reply, :ok, socket}
  end

  # # Test function
  # def handle_info(:ping, %Phoenix.Socket{assigns: %{current_user: current_user}} = socket) do
  #   IO.puts("PONG !")
  #   broadcast(socket, "ping", %{current_user: current_user.name})
  #   Process.send_after(self(), :ping, 1000)
  #   {:noreply, socket}
  # end
end
