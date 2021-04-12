defmodule Pictionary.User do
  defstruct id: Ecto.UUID.generate, name: nil, avatar: %{}, created_at: DateTime.utc_now(), updated_at: DateTime.utc_now()
  @type t :: %__MODULE__{id: String.t(), name: String.t(), avatar: map(), created_at: t(), updated_at: t()}
end
