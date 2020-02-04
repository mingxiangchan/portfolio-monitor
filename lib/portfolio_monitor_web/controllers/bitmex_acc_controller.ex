defmodule PortfolioMonitorWeb.BitmexAccController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Account
  alias PortfolioMonitor.Account.BitmexAcc

  def index(conn, _params) do
    results =
      conn
      |> Pow.Plug.current_user()
      |> Account.bitmex_acc_with_details()

    render(conn, "index.json", bitmex_accs: results)
  end

  def create(conn, %{"bitmex_acc" => bitmex_acc_params}) do
    user = Pow.Plug.current_user(conn)

    case Account.create_bitmex_acc(user, bitmex_acc_params) do
      {:ok, bitmex_acc} ->
        render(conn, "bitmex_acc.json", bitmex_acc: bitmex_acc)
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "error.json", message: "Error")
    end
  end
  
  def update(conn, %{"id" => id, "bitmex_acc" => bitmex_acc_params}) do
    bitmex_acc = Account.get_bitmex_acc(id)

    case Account.update_bitmex_acc(bitmex_acc, bitmex_acc_params) do
      {:ok, bitmex_acc} ->
        render(conn, "bitmex_acc.json", bitmex_acc: bitmex_acc)
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "error.json", message: "Error")
    end
  end

  def delete(conn, %{"id" => id}) do
    bitmex_acc = Account.get_bitmex_acc(id)
    {:ok, _bitmex_acc} = Account.delete_bitmex_acc(bitmex_acc)
    render(conn, "success.json", action: "Delete")
  end

end
