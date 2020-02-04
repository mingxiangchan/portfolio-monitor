defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use PortfolioMonitorWeb, :channel
  require Logger

  def join("general_btc_info", _payload, socket) do
    query_for_general_info(socket)
    {:ok, socket}
  end

  def query_for_general_info(socket) do
    Task.start(fn ->
      case HTTPoison.get(general_info_url()) do
        {:ok, %{body: body}} ->
          broadcast(socket, "opening_price", body)

        {:error, _} ->
          Logger.warn("unable to query general info")
      end
    end)
  end

  def general_info_url do
    """
    https://testnet.bitmex.com/api/v1/trade/bucketed?binSize=1d&partial=false&symbol=XBTUSD&count=1&reverse=true
    """
  end
end
