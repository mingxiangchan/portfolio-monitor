defmodule PortfolioMonitorWeb.BitmexAccsChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Sync.Worker

  def join("bitmex_accs:index", _payload, socket) do
    # TODO: start link to the user's bitmex accs websockets
    topic = "bitmex_accs:#{socket.assigns.user.id}"
    {:ok, %{user_specific_topic: topic}, socket}
  end

  def join("bitmex_accs:" <> _user_id, _payload, socket) do
    initialize_ws_workers(socket.assigns.user)
    {:ok, socket}
  end

  @decorate channel_action()
  def handle_in("get_accs", _paylod, socket) do
    data =
      socket.assigns.user
      |> Portfolio.list_bitmex_accs(:with_details)
      |> Enum.into(%{}, &{&1.id, &1})

    {:reply, {:ok, %{accs: data}}, socket}
  end

  defp initialize_ws_workers(user) do
    user
    |> Portfolio.list_bitmex_accs()
    |> Enum.each(&start_acc_ws_worker/1)
  end

  defp start_acc_ws_worker(%{detected_invalid: true}), do: nil

  defp start_acc_ws_worker(acc) do
    auth_config = Map.take(acc, [:api_key, :api_secret])

    Worker.start_link(%{
      acc_id: acc.id,
      user_id: acc.user_id,
      auth_subscribe: ["margin", "position"],
      config: auth_config,
      name: String.to_atom("BitMexAccWorker.#{acc.id}")
    }, acc.is_testnet)
  end
end
