defmodule Pictionary.Stores.GameStore do
  use GenServer
  alias Pictionary.Game
  require Logger

  @table_name :game_table
  @custom_word_limit 10_000

  @permitted_update_params [
    "id",
    "rounds",
    "time",
    "max_players",
    "custom_words",
    "custom_words_probability",
    "public_game",
    "vote_kick_enabled"
  ]

  @game_stats_broadcast_interval 3000

  # 1 month
  @record_expiry 30 * 24 * 60 * 60

  ## Public API

  def list_games do
    GenServer.call(__MODULE__, :list)
  end

  def get_game(game_id) do
    GenServer.call(__MODULE__, {:get, game_id})
  end

  def add_game(game) do
    GenServer.call(__MODULE__, {:set, game})
  end

  def start_game(game_id) do
    GenServer.call(__MODULE__, {:start, game_id})
  end

  def update_game(game_params) do
    GenServer.call(__MODULE__, {:update, game_params})
  end

  def change_admin(game_id, admin_id) do
    GenServer.call(__MODULE__, {:update_admin, %{game_id: game_id, admin_id: admin_id}})
  end

  def add_player(game_id, player_id) do
    GenServer.call(__MODULE__, {:add_player, game_id, player_id})
    GenServer.cast({:global, "GameServer##{game_id}"}, {:add_player, player_id})
  end

  def remove_player(game_id, player_id) do
    GenServer.call(__MODULE__, {:remove_player, game_id, player_id})
    GenServer.cast({:global, "GameServer##{game_id}"}, {:remove_player, player_id})
  end

  def remove_old_records do
    GenServer.cast(__MODULE__, :remove_old_records)
  end

  ## GenServer callbacks

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def init(_args) do
    # Create a ETS table
    # private access ensure read/write limited to owner process.
    :ets.new(@table_name, [:named_table, :set, :private])

    Process.send_after(self(), :notify_about_game_updates, 1000)
    {:ok, nil}
  end

  def handle_call({:get, game_id}, _from, state) do
    {:reply, fetch_game(game_id), state}
  end

  def handle_call(:list, _from, state) do
    {:reply, get_game_stats(), state}
  end

  def handle_call({:set, %Game{id: game_id} = game_data}, _from, state) do
    # Below pattern match ensure genserver faliure and restart in case
    # of ETS insertion faliure
    true = :ets.insert(@table_name, {game_id, game_data})

    Logger.info("Create game #{game_id}")

    {:reply, game_data, state}
  end

  def handle_call({:start, id}, _from, state) do
    game = fetch_game(id)
    updated_game = struct(game, %{started: true, updated_at: DateTime.utc_now()})

    if !game.started do
      true = :ets.insert(@table_name, {id, updated_game})
      Logger.info("Game #{id} started")
    end

    {:reply, updated_game, state}
  end

  def handle_call({:update, %{"id" => id} = game_params}, _from, state) do
    # For some reason :ets is returning two types of values, this case block handles both
    game = fetch_game(id)

    updated_game =
      if game do
        filtered_params =
          game_params
          |> Enum.filter(fn {key, _val} -> Enum.find(@permitted_update_params, &(&1 == key)) end)
          |> Enum.map(fn {key, val} -> {String.to_atom(key), val} end)
          |> Enum.into(%{})
          |> handle_custom_words()

        updated_game = struct(game, Map.put(filtered_params, :updated_at, DateTime.utc_now()))

        true = :ets.insert(@table_name, {id, updated_game})

        Logger.info("Update game #{id}")

        updated_game
      end

    {:reply, updated_game || game, state}
  end

  def handle_call({:update_admin, %{game_id: id, admin_id: admin_id}}, _from, state) do
    game = fetch_game(id)

    game.players
    |> Enum.find(&(&1 == admin_id))
    |> if do
      updated_game = struct(game, %{creator_id: admin_id, updated_at: DateTime.utc_now()})

      true = :ets.insert(@table_name, {id, updated_game})

      Logger.info("Change admin for game #{id} to #{admin_id}")

      {:reply, updated_game, state}
    else
      Logger.warn("Could not change game admin")

      {:reply, game, state}
    end
  end

  def handle_call({:add_player, game_id, player_id}, _from, state) do
    game = fetch_game(game_id)

    if game && MapSet.size(game.players) <= game.max_players do
      game = %Pictionary.Game{game | players: MapSet.put(game.players, player_id)}
      true = :ets.insert(@table_name, {game_id, game})
      Logger.info("Add player #{player_id} to game #{game_id}")
      {:reply, game, state}
    else
      Logger.warn("Could not add player to game")

      {:reply, :error, state}
    end
  end

  def handle_call({:remove_player, game_id, player_id}, _from, state) do
    game = fetch_game(game_id)

    if game do
      game = %Pictionary.Game{game | players: MapSet.delete(game.players, player_id)}
      true = :ets.insert(@table_name, {game_id, game})
      Logger.info("Removed player #{player_id} from game #{game_id}")

      # Remove game if everyone leaves
      if MapSet.size(game.players) == 0 do
        true = :ets.delete(@table_name, game.id)
        # Stop game server
        GenServer.cast({:global, "GameServer##{game.id}"}, :stop)
        Logger.info("Removed game #{game_id}")
      end

      # Change admin if admin leaves
      if MapSet.size(game.players) > 0 && player_id == game.creator_id do
        Task.start_link(fn ->
          new_admin = get_random_player(game.players)
          change_admin(game_id, new_admin)

          # Broadcast on game channel about admin change
          PictionaryWeb.Endpoint.broadcast!("game:#{game.id}", "game_admin_updated", %{
            creator_id: new_admin
          })
        end)
      end

      {:reply, game, state}
    else
      Logger.warn("Could not remove player from game")

      {:reply, :error, state}
    end
  end

  def handle_cast(:remove_old_records, state) do
    Logger.info("Game Store cleanup start")

    :ets.tab2list(@table_name)
    |> Enum.each(fn {_id, game} -> remove_stale_records(game) end)

    Logger.info("Game Store cleanup end")
    {:noreply, state}
  end

  # Notifys the GameListChannel about game stats changes periodically
  def handle_info(:notify_about_game_updates, state) do
    # Broadcast on game list channel about game update change
    PictionaryWeb.Endpoint.broadcast!("game_stats", "game_stats_update", %{
      game_stats: get_game_stats()
    })

    Process.send_after(self(), :notify_about_game_updates, @game_stats_broadcast_interval)
    {:noreply, state}
  end

  ## Private helpers

  defp handle_custom_words(%{custom_words: custom_words} = filtered_params) do
    custom_word_list =
      custom_words
      |> String.split(",")
      |> Stream.map(fn word ->
        word
        |> String.downcase()
        |> String.trim()
      end)
      |> Stream.filter(&(String.length(&1) < 20 || String.length(&1) > 2))
      |> Stream.uniq()
      |> Enum.take(@custom_word_limit)

    Map.put(filtered_params, :custom_words, custom_word_list)
  end

  defp handle_custom_words(filtered_params), do: filtered_params

  defp fetch_game(game_id) do
    case :ets.lookup(@table_name, game_id) do
      [{_game_id, game}] -> game
      _ -> nil
    end
  end

  defp get_random_player(players) do
    players
    |> MapSet.to_list()
    |> Enum.shuffle()
    |> List.first()
  end

  defp get_game_stats() do
    :ets.tab2list(@table_name)
    |> Stream.filter(fn {_id, %Game{public_game: is_public}} -> is_public end)
    |> Stream.map(fn {_id, %Game{} = game} -> game_data(game) end)
    |> Enum.to_list()
  end

  defp remove_stale_records(%Game{id: id, created_at: created_at}) do
    diff = DateTime.utc_now() |> DateTime.diff(created_at)

    if diff > @record_expiry do
      :ets.delete(@table_name, id)

      Logger.info("Drop game id #{id}")

      {:global, "GameServer##{id}"}
      |> GenServer.whereis()
      |> Pictionary.GameSupervisor.remove_game_server()
    end
  end

  defp game_data(game) do
    %{
      id: game.id,
      max_players: game.max_players,
      current_players_count: MapSet.size(game.players),
      rounds: game.rounds,
      round_time: game.time,
      started: game.started,
      vote_kick_enabled: game.vote_kick_enabled,
      custom_words: length(game.custom_words) != 0,
      created_at: game.created_at
    }
  end
end
