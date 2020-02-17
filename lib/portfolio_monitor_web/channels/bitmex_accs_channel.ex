defmodule PortfolioMonitorWeb.BitmexAccsChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Sync.Worker
  intercept ["acc_update", "acc_deleted"]

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

  def handle_out("acc_deleted", msg, socket) do
    %{acc: %{id: id}} = msg
    updated_socket = kill_ws_worker(socket, id)
    push(updated_socket, "acc_deleted", msg)
    {:noreply, updated_socket}
  end

  # Endpoint.broadcast("bitmex_accs:#{acc.user_id}", "acc_deleted", %{acc: %{id: acc.id}})

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

  defp kill_ws_worker(socket, id) do
    existing_workers = Map.get(socket.assigns, :existing_workers, %{})

    case Map.get(existing_workers, id) do
      nil ->
        socket

      pid ->
        Process.exit(pid, :normal)
        updated_workers = Map.drop(existing_workers, [id])
        assign(socket, :existing_workers, updated_workers)
    end
  end

  defp start_acc_ws_worker(%{detected_invalid: true}, _), do: nil

  defp start_acc_ws_worker(acc, existing_workers) do
    auth_config = Map.take(acc, [:api_key, :api_secret])

    case Map.get(existing_workers, acc.id) do
      nil ->
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

      existing_pid ->
        {acc.id, existing_pid}
    end
  end
end
