defmodule Pictionary.Stores.GameStore do
  use GenServer
  alias Pictionary.Game

  @table_name :game_table

  # Public API
  def get_game(game_id) do
    case GenServer.call(__MODULE__, {:get, game_id}) do
      [] -> nil
      [{_game_id, game_data}] -> game_data
    end
  end

  def add_game(game) do
    GenServer.call(__MODULE__, {:set, game})
  end

  # GenServer callbacks
  def start_link(_opts) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(_args) do
    # Create a ETS table
    # private access ensure read/write limited to owner process.
    :ets.new(@table_name, [:named_table, :set, :private])

    {:ok, nil}
  end

  def handle_call({:get, game_id}, _from, state) do
    game = :ets.lookup(@table_name, game_id)
    {:reply, game, state}
  end

  def handle_call({:set, game_data = %Game{id: game_id}}, _from, state) do
    # Below pattern match ensure genserver faliure and restart in case
    # of ETS insertion faliure
    true = :ets.insert(@table_name, {game_id, game_data})
    {:reply, game_data, state}
  end
end
