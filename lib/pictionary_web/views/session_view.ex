defmodule PictionaryWeb.SessionView do
  use PictionaryWeb, :view

  def render("create.json", %{user: user, token: token}) do
    %{
      token: token,
      user: render_one(user, PictionaryWeb.UserView, "show.json")
    }
  end

  def render("show.json", user) do
    %{
      name: user.name,
      avatar: user.avatar
    }
  end
end
