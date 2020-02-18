defmodule PortfolioMonitorWeb.BitmexAccsChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  alias PortfolioMonitorWeb.Presence
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Sync.LiveSupervisor
  intercept ["acc_update", "acc_deleted"]

  def join("bitmex_accs:index", _payload, socket) do
    topic = "bitmex_accs:#{socket.assigns.user.id}"
    {:ok, %{user_specific_topic: topic}, socket}
  end

  def join("bitmex_accs:" <> _user_id, _payload, socket) do
    send(self(), :after_join)
    initialize_ws_workers(socket.assigns[:user])
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    Presence.track(socket, socket.assigns.user.id, %{logged: true})
    {:noreply, socket}
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
    initialize_ws_workers(socket.assigns[:user])
    {:noreply, socket}
  end

  def handle_out("acc_deleted", msg, socket) do
    %{acc: %{id: id}} = msg
    kill_ws_worker(id)
    push(socket, "acc_deleted", msg)
    {:noreply, socket}
  end

  def terminate(_, %{topic: "bitmex_accs:" <> id} = socket) do
    socket
    |> Presence.list()
    |> Kernel.get_in([id, :metas])
    |> case do
      nil ->
        nil

      live_ws when is_list(live_ws) and length(live_ws) == 1 ->
        # when the currently terminating worker is the last one for this user
        # terminate the bitmex acc ws workers for this user
        kill_all_ws_workers(socket.assigns.user)

      _ ->
        nil
    end
  end

  # PRIVATE APIS

  defp initialize_ws_workers(user) do
    user
    |> Portfolio.list_bitmex_accs()
    |> Enum.map(&start_acc_ws_worker(&1))
  end

  def kill_all_ws_workers(user) do
    user
    |> Portfolio.list_bitmex_accs()
    |> Enum.map(&kill_ws_worker(&1.id))
  end

  defp kill_ws_worker(id) do
    case Process.whereis(:"BitMexAccWorker.#{id}") do
      nil -> nil
      pid -> DynamicSupervisor.terminate_child(LiveSupervisor, pid)
    end
  end

  defp start_acc_ws_worker(acc) do
    case Process.whereis(:"BitMexAccWorker.#{acc.id}") do
      nil -> LiveSupervisor.start_child(acc)
      _existing_pid -> nil
    end
  end
end
