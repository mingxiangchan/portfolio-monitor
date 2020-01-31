defmodule PortfolioMonitor.Sync.Worker do
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitorWeb.Endpoint
  use ExBitmex.WebSocket

  def handle_response(json, state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    Task.start(fn ->
      persist_response(json, state[:acc_id])
    end)
  end

  def persist_response(%{"action" => "partial"}, _), do: Logger.warn("ignoring partial")

  def persist_response(%{"table" => table, "data" => data}, acc_id) do
    Endpoint.broadcast("bitmex_acc:#{acc_id}", table, %{"data" => data})

    # data is an array, however only ever has 1 element
    changes = %{data: hd(data), bitmex_acc_id: acc_id}

    case table do
      "position" -> Portfolio.create_position(changes)
      "margin" -> Portfolio.create_margin(changes)
      "order" -> Portfolio.create_order_detail(changes)
    end
  end

  def persist_response(_, _), do: nil
end
