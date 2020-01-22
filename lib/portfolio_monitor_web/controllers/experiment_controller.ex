defmodule PortfolioMonitorWeb.ExperimentController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Portfolio.Experiment

  action_fallback PortfolioMonitorWeb.FallbackController

  def index(conn, _params) do
    experiments = Portfolio.list_experiments()
    render(conn, "index.json", experiments: experiments)
  end

  def create(conn, %{"experiment" => experiment_params}) do
    with {:ok, %Experiment{} = experiment} <- Portfolio.create_experiment(experiment_params) do
      conn
      |> put_status(:created)
      |> render("show.json", experiment: experiment)
    end
  end

  def update(conn, %{"id" => id, "experiment" => experiment_params}) do
    experiment = Portfolio.get_experiment!(id)

    with {:ok, %Experiment{} = experiment} <-
           Portfolio.update_experiment(experiment, experiment_params) do
      render(conn, "show.json", experiment: experiment)
    end
  end
end
