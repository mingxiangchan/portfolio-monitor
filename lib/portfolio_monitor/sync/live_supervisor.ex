defmodule PortfolioMonitor.Sync.LiveSupervisor do
  alias PortfolioMonitor.Sync.Worker

  @moduledoc """
  Supervises the bitmex WS connections created when users visit the site, enabling live updates to the dashboard while they are visiting the site
  """

  use DynamicSupervisor

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    # do not restart dead websocket connections
    {:ok, pid} = DynamicSupervisor.init(strategy: :one_for_one)

    start_ws_for_all_accs()

    {:ok, pid}
  end

  def start_ws_for_all_accs do
    PortfolioMonitor.Portfolio.list_bitmex_accs()
    |> Enum.each(fn acc ->
      Task.start(fn -> start_child(acc) end)
    end)
  end

  def start_child(%{detected_invalid: true}), do: {:error, :invalid}

  def start_child(bitmex_acc) do
    auth_config = Map.take(bitmex_acc, [:api_key, :api_secret])

    args = %{
      acc_id: bitmex_acc.id,
      user_id: bitmex_acc.user_id,
      auth_subscribe: ["margin", "position"],
      config: auth_config,
      name: :"BitMexAccWorker.#{bitmex_acc.id}",
      is_testnet: bitmex_acc.is_testnet,
      walletBalance: nil,
      marginBalance: nil,
      avgEntryPrice: nil
    }

    child_spec = %{
      id: Worker,
      start: {Worker, :start_link, [args]},
      restart: :transient
    }

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end

  def record_accs_info do
    __MODULE__
    |> DynamicSupervisor.which_children()
    |> Enum.each(fn {_, pid, _, _} ->
      send(pid, :record_acc_info)
    end)
  end
end
