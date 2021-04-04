defmodule Pictionary.Repo do
  use Ecto.Repo,
    otp_app: :pictionary,
    adapter: Ecto.Adapters.Postgres
end
