defmodule PortfolioMonitorWeb.BitmexAccController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Account
  alias PortfolioMonitor.Account.BitmexAcc

  action_fallback PortfolioMonitorWeb.FallbackController

  def index(conn, _params) do
    results =
      conn
      |> Pow.Plug.current_user()
      |> Account.bitmex_acc_with_details()

    render(conn, "index.json", bitmex_accs: results)
  end

  def create(conn, %{"bitmex_acc" => bitmex_acc_params}) do
    user = Pow.Plug.current_user(conn)
    result = Account.create_bitmex_acc(user, bitmex_acc_params)

    with {:ok, %BitmexAcc{} = bitmex_acc} <- result do
      conn
      |> put_status(:created)
      |> render("show.json", bitmex_acc: bitmex_acc)
    end
  end
end
