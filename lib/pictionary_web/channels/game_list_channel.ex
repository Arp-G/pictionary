defmodule PictionaryWeb.GameListChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore
  alias Pictionary.Game

  @stats_broadcast_interval 5000

  def join("game_stats", _payload, socket) do
    send(self(), :publish_game_stats)
    {:ok, socket.assigns.game_stats, assign(socket, :game_stats, [])}
  end

  def handle_info(:publish_game_stats, socket) do
    game_stats =
      GameStore.list_games()
      |> Stream.filter(fn {_id, %Game{public_game: is_public}} -> is_public end)
      |> Stream.map(fn {id, game} ->
        %{
          id: id,
          max_players: game.max_players,
          current_players_count: MapSet.size(game.players),
          rounds: game.rounds,
          round_time: game.time,
          started: game.started,
          vote_kick_enabled: game.vote_kick_enabled,
          custom_words: length(game.custom_words) != 0,
          created_at: game.created_at
        }
      end)
      |> Enum.to_list()

    broadcast(
      socket,
      "game_stats_update",
      %{game_stats: game_stats}
    )

    Process.send_after(self(), :publish_game_stats, @stats_broadcast_interval)

    {:noreply, assign(socket, :game_stats, game_stats)}
  end
end
