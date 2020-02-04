defmodule PortfolioMonitorWeb.BitmexAccChannel do
  use PortfolioMonitorWeb, :channel
  alias PortfolioMonitor.Account.BitmexAcc
  alias PortfolioMonitor.Sync.Worker
  require Logger

  def join("bitmex_acc:" <> id, payload, socket) do
    # if authorized?(payload) do
      case bitmex_acc = PortfolioMonitor.Account.get_bitmex_acc(id) do
        %BitmexAcc{} ->
          auth_config = Map.take(bitmex_acc, [:api_key, :api_secret])

          Worker.start_link(%{
            acc_id: bitmex_acc.id,
            auth_subscribe: ["order", "margin", "position", "trade"],
            config: auth_config,
            name: String.to_atom("BitMexAccWorker.#{bitmex_acc.id}")
          })
          {:ok, socket}
        nil ->
          {:error, %{reason: "Account not found"}}
      end
    # else
    #   {:error, %{reason: "unauthorized"}}
    # end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end
end
