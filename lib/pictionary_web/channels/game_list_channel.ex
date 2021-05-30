defmodule PictionaryWeb.GameListChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore
  alias Pictionary.Game

  @stats_broadcast_interval 5000

  def join("game_stats", _payload, socket) do
    {:ok, GameStore.list_games(), assign(socket, :game_stats, [])}
  end
end
