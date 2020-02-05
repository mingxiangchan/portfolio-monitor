defmodule ExBitmex.Credentials do
  @type t :: %ExBitmex.Credentials{
          api_key: String.t(),
          api_secret: String.t()
        }

  @enforce_keys [:api_key, :api_secret]
  defstruct [:api_key, :api_secret]

  @doc """
  Extract api key and api secret from config passed in
  """
  def config(%{api_key: api_key, api_secret: api_secret}) do
    %{
      api_key: api_key,
      api_secret: api_secret
    }
  end
end
