# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

# Configures the endpoint
config :pictionary, PictionaryWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "hWeSS7q9x9LY66qdQLQXnjjm2DtvqA3r+q1Dq3jC+CgZOaO/DyTp50FEUHbhZD8L",
  render_errors: [view: PictionaryWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Pictionary.PubSub,
  live_view: [signing_salt: "Y912JC8S"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :pictionary, Pictionary,
  secret_key: "mWrx5hBSfF+Gz2d7C1QSF5l+kH/4ZI1Jyn3rNurCkzDL72lfnmtwcTbxcdi2+szo",
  salt: "4gzgoc7oQu8yOgwoMNaNCikNsreWvMW5"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
