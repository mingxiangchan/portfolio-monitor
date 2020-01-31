defmodule PortfolioMonitorWeb.BitmexAccController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Account
  alias PortfolioMonitor.Account.BitmexAcc

  def index(conn, _params) do
    user = Pow.Plug.current_user(conn)
    render(conn, "index.json", bitmex_accs: [])
  end

  def new(conn, _params) do
    changeset = Account.change_bitmex_acc(%BitmexAcc{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"bitmex_acc" => bitmex_acc_params}) do
    user = Pow.Plug.current_user(conn)

    case Account.create_bitmex_acc(user, bitmex_acc_params) do
      {:ok, _bitmex_acc} ->
        conn
        |> put_flash(:info, "Bitmex acc created successfully.")
        |> redirect(to: "/")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end
end
