defmodule Pictionary.GameChannelWatcher do
  use GenServer
  alias Pictionary.Stores.GameStore

  # Phoenix presence does not have any direct way to execute code when someone disconnects
  # from channel using terminate callback on channel genserver is not ideal instead the below watcher genserver helps to solve this
  # This watcher genserver watches a process subscribed to a channel.
  # This is achived by linking(Process.link/1) the subscribed channel process to the genserver process whenever someone joins the channel
  # and therefore if channel process disconnect genserver process will get to know about it
  # Here I have made this watcher specifically for the game channel but this can be generalized and used for watching multiple channels as given bellow:
  # Implementation taken from: https://stackoverflow.com/questions/33934029/how-to-detect-if-a-user-left-a-phoenix-channel-due-to-a-network-disconnect

  ## Client API

  def monitor(pid, data) do
    GenServer.call(__MODULE__, {:monitor, pid, data})
  end

  def demonitor(pid) do
    GenServer.call(__MODULE__, {:demonitor, pid})
  end

  ## Server API

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: :game_channel_watcher)
  end

  def init(_) do
    # When the linked process dies the caller process meaning this genserver process also dies
    # Here we set the flag :trap_exit to true to TRAP such exits in the handle_info({:EXIT...) block
    # We avoid this genserver from dieing by trapping exists and then remove the user who left from ets game data
    Process.flag(:trap_exit, true)
    {:ok, %{}}
  end

  def handle_call({:monitor, pid, {game_id, user_id}}, _from, state) do
    # Link the channel process with the current process
    # When two processes are linked, each one receives exit signals from the other when either of the process dies
    Process.link(pid)
    Task.start_link(fn -> GameStore.add_player(game_id, user_id) end)
    {:reply, :ok, Map.put(state, pid, {game_id, user_id})}
  end

  def handle_call({:demonitor, pid}, _from, state) do
    case Map.fetch(state, pid) do
      :error ->
        {:reply, :ok, state}

      {:ok, {game_id, user_id}} ->
        Process.unlink(pid)
        # Update ets game player list to remove the user which left
        Task.start_link(fn -> GameStore.remove_player(game_id, user_id) end)
        {:reply, :ok, Map.delete(state, pid)}
    end
  end

  def handle_info({:EXIT, pid, _reason}, state) do
    case Map.fetch(state, pid) do
      :error ->
        {:noreply, state}

      {:ok, {game_id, user_id}} ->
        # Update ets game player list to remove the user which left
        Task.start_link(fn -> GameStore.remove_player(game_id, user_id) end)
        {:noreply, Map.delete(state, pid)}
    end
  end
end
