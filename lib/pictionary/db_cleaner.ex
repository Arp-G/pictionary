# Periodically cleans and removes expired games and users
defmodule Pictionary.DBCleaner do
  use GenServer

  # 1 month
  @interval 2_629_800_000

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    # Schedule work to be performed at some point
    schedule_cleanup()
    {:ok, state}
  end

  def handle_info(:work, state) do
    # Do the work you desire here
    # Reschedule once more
    schedule_cleanup()
    {:noreply, state}
  end

  defp schedule_cleanup() do
    Pictionary.Stores.GameStore.remove_old_records()
    Pictionary.Stores.UserStore.remove_old_records()
    Process.send_after(self(), :work, @interval)
  end
end
