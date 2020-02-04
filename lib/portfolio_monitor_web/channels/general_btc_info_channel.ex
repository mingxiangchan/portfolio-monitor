defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use PortfolioMonitorWeb, :channel

  def join("general_btc_info", _payload, socket) do
    {:ok, socket}
  end
end
