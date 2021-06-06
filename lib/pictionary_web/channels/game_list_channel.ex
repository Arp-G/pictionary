defmodule PictionaryWeb.GameListChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore

  def join("game_stats", _payload, socket) do
    {:ok, %{game_stats: GameStore.list_games()}, socket}
  end
end
