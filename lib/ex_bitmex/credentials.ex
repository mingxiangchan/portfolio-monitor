defmodule ExBitmex.Credentials do
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
