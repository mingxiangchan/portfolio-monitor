defmodule PortfolioMonitor.Sync.GeneralExchangeInfoWorker do
  alias PortfolioMonitorWeb.Endpoint
  alias PortfolioMonitor.Portfolio
  use ExBitmex.WebSocketOverride
  require Logger

  def handle_response(%{"data" => data}, state) do
    is_test = state[:is_testnet]
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

  @doc """
  Used to trigger 

  ```elixir
  pid = Process.whereis(:"GeneralExchangeInfoWorker.Bitmex.TestNet")
  send(pid, :record_prices)
  ```
  """
  @impl true
  def handle_info(:record_prices, state) do
    is_test = state[:is_testnet]
    recorded_prices = state[:recorded_prices]

    # handle in task so crashes don't affect the current ws process
    Task.start(fn ->
      Enum.each(recorded_prices, fn {symbol, price} ->
        Portfolio.create_bitmex_history(%{
          is_testnet: is_test,
          symbol: symbol,
          price: price
        })
      end)
    end)

    {:ok, state}
  end

  @impl true
  def handle_info(error, state) do
    output_error(error, state, "received unexpected message")
    {:ok, state}
  end
end
