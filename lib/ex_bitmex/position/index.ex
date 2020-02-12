defmodule ExBitmex.Rest.Position.Index do
  alias ExBitmex.Rest

  @type credentials :: ExBitmex.Credentials.t()
  @type params :: map
  @type position :: ExBitmex.Position.t()
  @type rate_limit :: ExBitmex.RateLimit.t()

  @spec get(credentials, params) ::
          {:ok, [position], rate_limit} | Rest.HTTPClient.auth_error_response()
  def get(%ExBitmex.Credentials{} = credentials, params \\ %{}) do
    "/position"
    |> Rest.HTTPClient.auth_get(credentials, params)
    |> parse_response
  end

  @spec get(credentials, params, bool) ::
          {:ok, [position], rate_limit} | Rest.HTTPClient.auth_error_response()
  def get(%ExBitmex.Credentials{} = credentials, params, is_testnet) do
    Rest.HTTPClient.auth_request(:get, "/position", credentials, params, is_testnet)
    |> parse_response
  end

  defp parse_response({:ok, data, rate_limit}) when is_list(data) do
    positions =
      data
      |> Enum.map(&to_struct/1)
      |> Enum.map(fn {:ok, p} -> p end)

    {:ok, positions, rate_limit}
  end

  defp parse_response({:error, _, _} = error), do: error

  defp to_struct(data) do
    data
    |> Mapail.map_to_struct(
      ExBitmex.Position,
      transformations: [:snake_case]
    )
  end
end
