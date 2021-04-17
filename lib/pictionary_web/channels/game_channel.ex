defmodule PictionaryWeb.GameChannel do
  use Phoenix.Channel
  alias Pictionary.User

  def join(
        "game:" <> game_id,
        _payload,
        %Phoenix.Socket{assigns: %{user_id: user_id}} = socket
      ) do
    user = User.get_user(user_id)

    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end
end
