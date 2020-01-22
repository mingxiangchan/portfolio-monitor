defmodule PortfolioMonitorWeb.ExperimentView do
  use PortfolioMonitorWeb, :view
  alias PortfolioMonitorWeb.ExperimentView

  def render("index.json", %{experiments: experiments}) do
    %{data: render_many(experiments, ExperimentView, "experiment.json")}
  end

  def render("show.json", %{experiment: experiment}) do
    %{data: render_one(experiment, ExperimentView, "experiment.json")}
  end

  def render("experiment.json", %{experiment: experiment}) do
    %{id: experiment.id,
      start: experiment.start,
      end: experiment.end,
      note: experiment.note}
  end
end
