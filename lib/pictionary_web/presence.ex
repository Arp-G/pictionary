defmodule PictionaryWeb.Presence do
  use Phoenix.Presence,
    otp_app: :pictionary,
    pubsub_server: Pictionary.PubSub
end
