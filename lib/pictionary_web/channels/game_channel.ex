defmodule PictionaryWeb.GameChannel do
  use Phoenix.Channel
  alias Pictionary.Stores.GameStore
  alias PictionaryWeb.GamesView
  alias PictionaryWeb.Presence

  def join("game:" <> game_id, _payload, socket) do
    case GameStore.get_game(game_id) do
      nil ->
        {:error, %{reason: "Game not found"}}

      game ->
        cond do
          MapSet.size(game.players) >= game.max_players ->
            {:error, %{reason: "Game Full !"}}

          true ->
            send(self(), {:after_join, game_id})
            socket = assign(socket, :game_id, game_id)

            if GenServer.whereis({:global, "GameServer##{game_id}"}) do
              try do
                state =
                  GenServer.call(
                    {:global, "GameServer##{game_id}"},
                    {:get_state, socket.assigns.current_user.id}
                  )

                {:ok, state, socket}
              catch
                :exit, _ -> {:ok, socket}
              end
            else
              {:ok, socket}
            end
        end
    end
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in(
        "update_game",
        %{"creator_id" => creator_id} = game_params,
        %Phoenix.Socket{assigns: %{current_user: current_user}} = socket
      )
      when creator_id == current_user.id do
    game = GameStore.update_game(game_params)

    # use broadcast_from to avoid sending broadcast to socket owner
    broadcast(
      socket,
      "game_settings_updated",
      GamesView.render("show_limited.json", %{game: game})
    )

    {:reply, :ok, socket}
  end

  def handle_in(
        "update_admin",
        %{"admin_id" => admin_id},
        %Phoenix.Socket{assigns: %{current_user: current_user, game_id: game_id}} = socket
      ) do
    game = GameStore.get_game(game_id)

    if game.creator_id == current_user.id do
      game = GameStore.change_admin(game_id, admin_id)

      broadcast(
        socket,
        "game_admin_updated",
        %{creator_id: game.creator_id}
      )
    end

    {:reply, :ok, socket}
  end

  def handle_in(
        "vote_to_kick",
        _args,
        %Phoenix.Socket{assigns: %{current_user: current_user, game_id: game_id}} = socket
      ) do
    GenServer.cast({:global, "GameServer##{game_id}"}, {:vote_to_kick, current_user.id})

    {:reply, :ok, socket}
  end

  def handle_in(
        "kick_player",
        %{"player_id" => player_id},
        %Phoenix.Socket{assigns: %{current_user: current_user, game_id: game_id}} = socket
      ) do
    game = GameStore.get_game(game_id)

    if game.creator_id == current_user.id do
      GameStore.remove_player(game_id, player_id)

      broadcast(socket, "player_removed", %{player_id: player_id})
    end

    {:reply, :ok, socket}
  end

  def handle_in(
        "start_game",
        _args,
        %Phoenix.Socket{assigns: %{current_user: current_user, game_id: game_id}} = socket
      ) do
    game = GameStore.get_game(game_id)

    if game.creator_id == current_user.id do
      GameStore.start_game(game_id)
      broadcast(socket, "game_started", %{})
    end

    Pictionary.GameSupervisor.add_game_server(game_id)
    {:reply, :ok, socket}
  end

  def handle_in(
        "canvas_update",
        %{"canvas_data" => canvas_data},
        %Phoenix.Socket{assigns: %{game_id: game_id}} = socket
      ) do
    broadcast_from(socket, "canvas_updated", %{canvas_data: canvas_data})
    GenServer.cast({:global, "GameServer##{game_id}"}, {:update_canvas_data, canvas_data})
    {:reply, :ok, socket}
  end

  def handle_in(
        "send_message",
        %{"message" => message},
        %Phoenix.Socket{assigns: %{current_user: current_user, game_id: game_id}} = socket
      ) do
    GenServer.call({:global, "GameServer##{game_id}"}, {:new_message, {current_user.id, message}})
    {:reply, :ok, socket}
  end

  def handle_in(
        "select_word",
        %{"word" => word},
        %Phoenix.Socket{assigns: %{game_id: game_id}} = socket
      ) do
    GenServer.call({:global, "GameServer##{game_id}"}, {:select_word, word})
    {:reply, :ok, socket}
  end

  def handle_info({:after_join, game_id}, %{assigns: %{current_user: user}} = socket) do
    :ok =
      Pictionary.GameChannelWatcher.monitor(
        self(),
        {game_id, socket.assigns.current_user.id}
      )

    {:ok, _} = Presence.track(socket, user.id, %{user_data: user})

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
