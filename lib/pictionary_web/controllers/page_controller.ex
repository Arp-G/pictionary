defmodule PictionaryWeb.PageController do
  use PictionaryWeb, :controller

  def health(conn, _params) do
    json(conn, %{status: "heathy"})
  end
end
