defmodule PortfolioMonitor.Sync.GeneralExchangeInfoWorker do
  alias PortfolioMonitorWeb.Endpoint
  use ExBitmex.WebSocketOverride
  require Logger

  def handle_response(%{"data" => data}, state) do
    is_test = state[:is_test]
    recorded_prices = state[:recorded_prices]

    event = if is_test, do: "testnet_price", else: "livenet_price"

    Endpoint.broadcast("general_btc_info", event, %{"data" => data})

    case hd(data) do
      %{"symbol" => symbol, "price" => price} ->
        updated_prices = Map.put(recorded_prices, symbol, price)
        {:ok, Map.put(state, :recorded_prices, updated_prices)}

      _ ->
        {:ok, state}
    end
  end

  def handle_response(_, state), do: {:ok, state}
end
