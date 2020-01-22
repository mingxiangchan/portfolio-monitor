defmodule PortfolioMonitor.Sync.Worker do
  use ExBitmex.WebSocket
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitorWeb.Endpoint

  def handle_response(json, state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    Task.start(fn ->
      persist_response(json, state[:acc_id])
    end)
  end

  def persist_response(%{"action" => "partial"}, _), do: nil

  def persist_response(%{"table" => table, "data" => data}, acc_id) do
    Endpoint.broadcast("bitmex_acc" <> acc_id, table, data)

    changes = %{data: data, bitmex_acc_id: acc_id}

    case table do
      "position" -> Portfolio.create_position(changes)
      "margin" -> Portfolio.create_margin(changes)
      "order" -> Portfolio.create_order_detail(changes)
    end
  end
end
