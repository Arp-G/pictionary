defmodule PictionaryWeb.GameListChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore

  def join("game_stats", _payload, socket) do
    {:ok, GameStore.list_games(), assign(socket, :game_stats, [])}
  end
end
