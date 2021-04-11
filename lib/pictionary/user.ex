defmodule Pictionary.User do
  defstruct id: nil, name: nil, avatar: %{}
  @type t :: %__MODULE__{id: String.t(), name: String.t(), avatar: map()}
end
