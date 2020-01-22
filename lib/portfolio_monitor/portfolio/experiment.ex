defmodule PortfolioMonitor.Portfolio.Experiment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "experiments" do
    field :end, :naive_datetime
    field :note, :string
    field :start, :naive_datetime
    belongs_to :bitmex_acc, PortfolioMonitor.Account.BitmexAcc

    timestamps()
  end

  @doc false
  def changeset(experiment, attrs) do
    experiment
    |> cast(attrs, [:start, :end, :note, :bitmex_acc_id])
    |> validate_required([:start, :bitmex_acc_id])
  end
end
