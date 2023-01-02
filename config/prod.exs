import Config

config :pictionary, PictionaryWeb.Endpoint,
  url: [host: "example.com", port: 80]

# Do not print debug messages in production
config :logger, level: :info
