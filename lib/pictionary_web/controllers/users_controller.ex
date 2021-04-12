defmodule PictionaryWeb.UserController do
  use PictionaryWeb, :controller
  alias Pictionary.{Stores.UserStore, User}

  def update(%{assigns: %{current_user: %User{id: id}}} = conn, user_params) do
    id
    |> UserStore.get_user()
    |> case do
      %User{name: existing_name, avatar: existing_avatar} = user ->
        user =
          %User{
            user
            | name: user_params["name"] || existing_name,
              avatar: user_params["avatar"] || existing_avatar,
              updated_at: DateTime.utc_now()
          }
          |> UserStore.add_user()

        render(conn, "show.json", user: user)

      nil ->
        json(conn, %{message: "User not found !"})
    end
  end

  def show(%{assigns: %{current_user: %User{id: id}}} = conn, _params) do
    render(conn, "show.json", user: UserStore.get_user(id))
  end
end
