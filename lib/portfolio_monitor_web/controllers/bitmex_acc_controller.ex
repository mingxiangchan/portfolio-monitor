defmodule PortfolioMonitorWeb.BitmexAccController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Account
  alias PortfolioMonitor.Account.BitmexAcc

  def new(conn, _params) do
    changeset = Account.change_bitmex_acc(%BitmexAcc{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"bitmex_acc" => bitmex_acc_params}) do
    case Account.create_bitmex_acc(bitmex_acc_params) do
      {:ok, _bitmex_acc} ->
        conn
        |> put_flash(:info, "Bitmex acc created successfully.")
        |> redirect(to: "/")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end
end
