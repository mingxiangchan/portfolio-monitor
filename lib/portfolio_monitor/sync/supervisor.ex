defmodule PortfolioMonitor.Sync.Supervisor do
  alias PortfolioMonitor.Sync.GeneralBtcInfoWorker

  use DynamicSupervisor

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    {:ok, pid} = DynamicSupervisor.init(strategy: :one_for_one)

    Task.start(fn ->
      start_general_btc_info_worker(true)
      start_general_btc_info_worker(false)
    end)

    {:ok, pid}
  end

  def start_general_btc_info_worker(is_testnet) do
    name =
      case is_testnet do
        true -> String.to_atom("GeneralBtcInfoWorker.TestNet")
        false -> String.to_atom("GeneralBtcInfoWorker.LiveNet")
      end

    child_spec =
      {GeneralBtcInfoWorker,
       %{
         subscribe: ["trade:XBTUSD"],
         is_testnet: is_testnet,
         name: name
       }}

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end
end
