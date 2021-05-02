defmodule Pictionary.GameServer do
  use GenServer
  require Logger

  ## Public API

  ## GenServer callbacks

  def start_link(game_id) when game_id != nil do
    GenServer.start_link(__MODULE__, game_id, name: {:global, "GameServer##{game_id}"})
  end

  def init(game_id) do
    {:ok, %{game_id: game_id}}
  end

  # def handle_call({:get, game_id}, _from, state) do
  #   {:reply, fetch_game(game_id), state}
  # end
end
