defmodule PictionaryWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :pictionary
  use Sentry.PlugCapture

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_pictionary_key",
    signing_salt: "6L91lWqB"
  ]

  socket "/socket", PictionaryWeb.UserSocket,
    websocket: [timeout: :infinity],
    longpoll: false

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/",
    from: :pictionary,
    gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Sentry.PlugContext
  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options

  plug Corsica,
    max_age: 600,
    origins: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://pictionary-game.netlify.app"
    ],
    allow_headers: :all,
    allow_methods: :all

  plug PictionaryWeb.Router
end
