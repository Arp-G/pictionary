defmodule Pictionary.StoreSupervisor do
  use Supervisor
  alias Pictionary.Stores.UserStore

  def start_link(_state) do
    Supervisor.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(_init_arg) do
    children = [{UserStore, [:ok]}]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
