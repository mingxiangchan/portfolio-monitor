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
end
