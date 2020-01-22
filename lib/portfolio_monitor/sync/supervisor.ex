defmodule PortfolioMonitor.Sync.Supervisor do
  alias PortfolioMonitor.Sync.Worker
  alias PortfolioMonitor.Account

  use DynamicSupervisor

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    {:ok, pid} = DynamicSupervisor.init(strategy: :one_for_one)

    Task.start(fn ->
      initialize_workers()
    end)

    {:ok, pid}
  end

  def start_child(bitmex_acc) do
    auth_config = Map.take(bitmex_acc, [:api_key, :api_secret])
    child_spec = {Worker, %{acc_id: bitmex_acc.id}}

    {:ok, pid} = DynamicSupervisor.start_child(__MODULE__, child_spec)
    Worker.authenticate(pid, auth_config)
    Worker.subscribe(pid, ["order", "margin", "position"])

    {:ok, pid}
  end

  defp initialize_workers do
    Account.list_bitmex_accs()
    |> Enum.each(&start_child/1)
  end
end
