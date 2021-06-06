defmodule Pictionary.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      # Pictionary.Repo,
      # Start the Telemetry supervisor
      PictionaryWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Pictionary.PubSub},
      PictionaryWeb.Presence,
      Pictionary.StoreSupervisor,
      Pictionary.GameChannelWatcher,
      Pictionary.GameSupervisor,
      Pictionary.DBCleaner,
      # Start the Endpoint (http/https)
      PictionaryWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Pictionary.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    PictionaryWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
