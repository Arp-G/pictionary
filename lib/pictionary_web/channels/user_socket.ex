defmodule PictionaryWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "game:*", PictionaryWeb.GameChannel

  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    Phoenix.Token.verify(
      Application.get_env(:pictionary, Pictionary)[:secret_key],
      Application.get_env(:pictionary, Pictionary)[:salt],
      token,
      max_age: :infinity
    )
    |> case do
      {:ok, user_id} ->
        user = Pictionary.Stores.UserStore.get_user(user_id)
        if user, do: {:ok, assign(socket, :current_user, user)}, else: :error

      _ ->
        :error
    end
  end

  @impl true
  def connect(_params, _socket, _connect_info), do: :error

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     PictionaryWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(_socket), do: nil
end
