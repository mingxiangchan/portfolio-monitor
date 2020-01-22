defmodule PortfolioMonitor.Sync.Worker do
  use ExBitmex.WebSocket
  alias PortfolioMonitor.Portfolio

  def handle_response(json, state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    Task.start(fn ->
      insert_into_db(json, state[:acc_id])
    end)
  end

  def insert_into_db(%{"action" => "partial"}, _), do: nil

  def insert_into_db(%{"table" => "position"} = json, acc_id) do
    Portfolio.create_position(%{
      data: json["data"],
      bitmex_acc_id: acc_id
    })
  end

  def insert_into_db(%{"table" => "margin"} = json, acc_id) do
    Portfolio.create_margin(%{
      data: json["data"],
      bitmex_acc_id: acc_id
    })
  end

  def insert_into_db(%{"table" => "order"} = json, acc_id) do
    Portfolio.create_order_detail(%{
      data: json["data"],
      bitmex_acc_id: acc_id
    })
  end

  def insert_into_db(_, _), do: nil
end
