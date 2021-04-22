defmodule Pictionary.User do
  # Implement Jason.Encoder protocol to encode user structs for presence updates
  @derive {Jason.Encoder, only: [:id, :name, :avatar]}
  defstruct([
    {:id, Ecto.UUID.generate()},
    :name,
    :avatar,
    created_at: DateTime.utc_now(),
    updated_at: DateTime.utc_now()
  ])

  @type t :: %__MODULE__{
          id: String.t(),
          name: String.t(),
          avatar: map(),
          created_at: t(),
          updated_at: t()
        }
end
