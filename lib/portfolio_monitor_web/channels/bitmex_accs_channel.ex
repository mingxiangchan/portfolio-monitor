defmodule PortfolioMonitorWeb.BitmexAccsChannel do
  use PortfolioMonitorWeb, :channel
  alias PortfolioMonitor.Account
  alias PortfolioMonitorWeb.Endpoint

  def join("bitmex_accs:index", _payload, socket) do
    # TODO: start link to the user's bitmex accs websockets
    topic = "bitmex_accs:#{socket.assigns.user.id}"
    {:ok, %{user_specific_topic: topic}, socket}
  end

  def join("bitmex_accs:" <> _user_id, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("get_accs", _paylod, socket) do
    data =
      socket.assigns.user
      |> Account.list_bitmex_accs(:with_details)
      |> Enum.into(%{}, &{&1[:id], &1})

    {:reply, {:ok, %{accs: data}}, socket}
  end
end
