defmodule PortfolioMonitorWeb.BitmexAccChannel do
  use PortfolioMonitorWeb, :channel

  def join("bitmex_acc:" <> _id, payload, socket) do
    # if authorized?(payload) do
      {:ok, socket}
    # else
    #   {:error, %{reason: "unauthorized"}}
    # end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(payload) do
    true
  end
end
