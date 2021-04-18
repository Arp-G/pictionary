defmodule PictionaryWeb.GameChannel do
  use Phoenix.Channel

  def join(
        "game:" <> game_id,
        _payload,
        %Phoenix.Socket{assigns: %{current_user: current_user}} = socket
      ) do
    IO.inspect("User #{current_user.name} joined room #{game_id} !")
    Process.send_after(self(), :ping, 1000)
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  # Test function
  def handle_info(:ping, %Phoenix.Socket{assigns: %{current_user: current_user}} = socket) do
    IO.puts "PONG !"
    broadcast(socket, "ping", %{current_user: current_user.name})
    Process.send_after(self(), :ping, 1000)
    {:noreply, socket}
  end
end
