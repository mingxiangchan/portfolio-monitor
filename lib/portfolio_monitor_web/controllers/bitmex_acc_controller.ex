defmodule PortfolioMonitorWeb.BitmexAccController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Portfolio.BitmexAcc

  action_fallback PortfolioMonitorWeb.FallbackController

  def create(conn, %{"bitmex_acc" => bitmex_acc_params}) do
    user = Pow.Plug.current_user(conn)
    result = Portfolio.create_bitmex_acc(user, bitmex_acc_params)

    with {:ok, %BitmexAcc{} = bitmex_acc} <- result do
      conn
      |> put_status(:created)
      |> render("show.json", bitmex_acc: bitmex_acc)
    end
  end

  def update(conn, %{"id" => id, "bitmex_acc" => bitmex_acc_params}) do
    bitmex_acc = Portfolio.get_bitmex_acc(id)

    result = Portfolio.update_bitmex_acc(bitmex_acc, bitmex_acc_params)

    with {:ok, %BitmexAcc{} = bitmex_acc} <- result do
      conn
      |> put_status(:accepted)
      |> render("show.json", bitmex_acc: bitmex_acc)
    end
  end

  def delete(conn, %{"id" => id}) do
    bitmex_acc = Portfolio.get_bitmex_acc(id)
    {:ok, _bitmex_acc} = Portfolio.delete_bitmex_acc(bitmex_acc)
    render(conn, "success.json", action: "Delete")
  end
end
