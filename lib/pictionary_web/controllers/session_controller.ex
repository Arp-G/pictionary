defmodule PictionaryWeb.SessionController do
  use PictionaryWeb, :controller
  alias Pictionary.{Stores.UserStore, User}

  def create(conn, %{"name" => name, "avatar" => avatar}) do
    user = %User{name: name, avatar: avatar}
    UserStore.add_user(user)

    conn
    |> put_status(:created)
    |> render("create.json",
      user: user,
      token:
        Phoenix.Token.sign(
          Application.get_env(:pictionary, Pictionary)[:secret_key],
          Application.get_env(:pictionary, Pictionary)[:salt],
          user.id
        )
    )
  end
end
