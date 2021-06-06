defmodule Pictionary.GameSupervisor do
  use DynamicSupervisor
  require Logger

  def start_link(_) do
    DynamicSupervisor.start_link(__MODULE__, :no_args, name: __MODULE__)
  end

  def init(:no_args) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def add_game_server(game_id) do
    {:ok, pid} = DynamicSupervisor.start_child(__MODULE__, {Pictionary.GameServer, game_id})
    pid
  end

  def remove_game_server(nil), do: Logger.info("Ignoring stop request")

  def remove_game_server(child_pid) do
    DynamicSupervisor.terminate_child(__MODULE__, child_pid)
    Logger.info("Stopped game server #{inspect child_pid}")
  end
end
