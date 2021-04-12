defmodule PictionaryWeb.UserView do
  use PictionaryWeb, :view

  def render("show.json", %{user: user}) do
    %{
      name: user.name,
      avatar: user.avatar
    }
  end
end
