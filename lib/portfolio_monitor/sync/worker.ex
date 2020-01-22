defmodule PortfolioMonitor.Sync.Worker do
  use ExBitmex.WebSocket
  alias PortfolioMonitor.Portfolio

  def handle_response(json, _state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    Task.start(fn ->
      insert_into_db(json)
    end)
  end

  def insert_into_db(%{"action" => "partial"}), do: nil

  def insert_into_db(%{"table" => "position", "data" => data}) do
    Portfolio.create_position(data)
  end

  def insert_into_db(%{"table" => "margin", "data" => data}) do
    Portfolio.create_margin(data)
  end

  def insert_into_db(%{"table" => "order", "data" => data}) do
    Portfolio.create_order_detail(data)
  end

  def insert_into_db(_), do: nil
end
