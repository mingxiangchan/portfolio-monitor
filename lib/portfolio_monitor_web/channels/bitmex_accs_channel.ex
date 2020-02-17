defmodule PortfolioMonitorWeb.BitmexAccsChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Sync.Worker
  intercept ["acc_update"]

  def join("bitmex_accs:index", _payload, socket) do
    topic = "bitmex_accs:#{socket.assigns.user.id}"
    {:ok, %{user_specific_topic: topic}, socket}
  end

  def join("bitmex_accs:" <> _user_id, _payload, socket) do
    updated_socket = initialize_ws_workers(socket)
    {:ok, updated_socket}
  end

  @decorate channel_action()
  def handle_in("get_accs", _paylod, socket) do
    data =
      socket.assigns.user
      |> Portfolio.list_bitmex_accs(:with_details)
      |> Enum.into(%{}, &{&1.id, &1})

    {:reply, {:ok, %{accs: data}}, socket}
  end

  def handle_out("acc_update", msg, socket) do
    push(socket, "acc_update", msg)
    updated_socket = initialize_ws_workers(socket)
    {:noreply, updated_socket}
  end

  # PRIVATE APIS

  defp initialize_ws_workers(socket) do
    user = Map.get(socket.assigns, :user)
    existing_workers = Map.get(socket.assigns, :existing_workers, %{})

    updated_workers =
      user
      |> Portfolio.list_bitmex_accs()
      |> Enum.map(&start_acc_ws_worker(&1, existing_workers))
      |> Enum.into(%{})

    assign(socket, :existing_workers, updated_workers)
  end

  defp start_acc_ws_worker(%{detected_invalid: true}, _), do: nil

  defp start_acc_ws_worker(acc, existing_workers) do
    auth_config = Map.take(acc, [:api_key, :api_secret])
    existing_pid = Map.get(existing_workers, acc.id)

    if is_nil(existing_pid) do
      {:ok, pid} =
        Worker.start_link(%{
          acc_id: acc.id,
          user_id: acc.user_id,
          auth_subscribe: ["margin", "position"],
          is_testnet: acc.is_testnet,
          config: auth_config,
          name: String.to_atom("BitMexAccWorker.#{acc.id}")
        })

      {acc.id, pid}
    else
      {acc.id, existing_pid}
    end
  end
end
