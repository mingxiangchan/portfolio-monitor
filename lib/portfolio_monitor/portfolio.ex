defmodule PortfolioMonitor.Portfolio do
  @moduledoc """
  The Portfolio context.
  """

  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Portfolio.Position
  alias PortfolioMonitor.Portfolio.OrderDetail
  alias PortfolioMonitor.Portfolio.Margin

  def list_positions do
    Repo.all(Position)
  end

  def list_margins do
    Repo.all(Margin)
  end

  def list_order_details do
    Repo.all(OrderDetail)
  end

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
end
