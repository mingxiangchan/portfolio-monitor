defmodule PortfolioMonitor.Sync.Supervisor do
  alias PortfolioMonitor.Sync.GeneralExchangeInfoWorker

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
        true -> String.to_atom("GeneralExchangeInfoWorker.Bitmex.TestNet")
        false -> String.to_atom("GeneralExchangeInfoWorker.Bitmex.LiveNet")
      end

    child_spec =
      {GeneralExchangeInfoWorker,
       %{
         subscribe: ["trade"],
         name: name,
         is_testnet: is_testnet,
         recorded_prices: %{}
       }}

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end
end
