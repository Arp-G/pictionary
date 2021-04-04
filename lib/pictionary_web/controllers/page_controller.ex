defmodule PictionaryWeb.PageController do
  use PictionaryWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
