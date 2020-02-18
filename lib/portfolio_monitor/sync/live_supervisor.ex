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
    DynamicSupervisor.init(strategy: :one_for_one, max_restarts: 0)
  end

  def start_child(%{detected_invalid: true}), do: {:error, :invalid}

  def start_child(bitmex_acc) do
    auth_config = Map.take(bitmex_acc, [:api_key, :api_secret])

    child_spec = {
      Worker,
      %{
        acc_id: bitmex_acc.id,
        user_id: bitmex_acc.user_id,
        auth_subscribe: ["order", "margin", "position", "trade"],
        config: auth_config,
        name: :"BitMexAccWorker.#{bitmex_acc.id}",
        is_testnet: bitmex_acc.is_testnet
      }
    }

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end
end
