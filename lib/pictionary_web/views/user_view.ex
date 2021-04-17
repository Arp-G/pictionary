defmodule PictionaryWeb.UserView do
  use PictionaryWeb, :view

  def render("show.json", %{user: user}) do
    %{
      id: user.id,
      name: user.name,
      avatar: user.avatar
    }
  end
end
