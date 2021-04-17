defmodule PictionaryWeb.TokenAuth do
  use PictionaryWeb, :controller

  def init(opts), do: opts

  def call(%Plug.Conn{assigns: %{current_user: %Pictionary.User{id: _id}}} = conn, _opts), do: conn

  def call(conn, _opts) do
    conn
    |> put_status(:unauthorized)
    |> json(%{error: "Unauthorized"})
    |> halt()
  end
end
