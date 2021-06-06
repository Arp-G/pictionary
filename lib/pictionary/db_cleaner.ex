# Periodically cleans and removes expired games and users
defmodule Pictionary.DBCleaner do
  use GenServer

  # 1 month
  @interval 30 * 24 * 60 * 60

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    schedule_cleanup() # Schedule work to be performed at some point
    {:ok, state}
  end

  def handle_info(:work, state) do
    # Do the work you desire here
    schedule_cleanup() # Reschedule once more
    {:noreply, state}
  end

  defp schedule_cleanup() do
    Pictionary.Stores.GameStore.remove_old_records()
    Pictionary.Stores.UserStore.remove_old_records()
    Process.send_after(self(), :work, @interval)
  end
end
