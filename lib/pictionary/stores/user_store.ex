defmodule Pictionary.Stores.UserStore do
  use GenServer
  alias Pictionary.User

  @table_name :user_table

  # Public API
  def get_user(user_id) do
    case GenServer.call(__MODULE__, {:get, user_id}) do
      [] -> nil
      [{_user_id, user_data}] -> user_data
    end
  end

  def add_user(user) do
    GenServer.call(__MODULE__, {:set, user})
  end

  # GenServer callbacks
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, nil, opts)
  end

  def init(_args) do
    # Create a ETS table
    # private access ensure read/write limited to owner process.
    :ets.new(@table_name, [:named_table, :set, :private])

    {:ok, nil}
  end

  def handle_call({:get, user_id}, _from, state) do
    user = :ets.lookup(@table_name, user_id)
    {:reply, user, state}
  end

  def handle_call({:set, user_data = %User{id: user_id}}, _from, state) do
    # Below pattern match ensure genserver faliure and restart in case
    # of ETS insertion faliure
    true = :ets.insert(@table_name, {user_id, user_data})
    {:reply, user_data, state}
  end
end
