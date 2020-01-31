defmodule PortfolioMonitor.Portfolio do
  @moduledoc """
  The Portfolio context.
  """

  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Portfolio.Position
  alias PortfolioMonitor.Portfolio.OrderDetail
  alias PortfolioMonitor.Portfolio.Margin
  alias PortfolioMonitor.Portfolio.Experiment

  def create_position(changes) do
    %Position{}
    |> Position.changeset(changes)
    |> Repo.insert!()
  end

  def create_margin(changes) do
    %Margin{}
    |> Margin.changeset(changes)
    |> Repo.insert!()
  end

  def create_order_detail(changes) do
    %OrderDetail{}
    |> OrderDetail.changeset(changes)
    |> Repo.insert!()
  end

  def list_experiments do
    Repo.all(Experiment)
  end

  def get_experiment!(id), do: Repo.get!(Experiment, id)

  def create_experiment(params) do
    changes = %{
      bitmex_acc_id: params["bitmex_acc_id"],
      start: DateTime.utc_now()
    }

    %Experiment{}
    |> Experiment.changeset(changes)
    |> Repo.insert()
  end

  def update_experiment(%Experiment{} = experiment, attrs) do
    experiment
    |> Experiment.changeset(attrs)
    |> Repo.update()
  end

  def change_experiment(%Experiment{} = experiment) do
    Experiment.changeset(experiment, %{})
  end
end
