defmodule PortfolioMonitorWeb.TokenController do
  use PortfolioMonitorWeb, :controller
  alias PortfolioMonitor.Account

  action_fallback PortfolioMonitorWeb.FallbackController

  def show(conn, _params) do
    user = Pow.Plug.current_user(conn)

    with {:ok, token, _} <- Account.generate_jwt_token(user) do
      conn
      |> put_status(:created)
      |> render("show.json", %{token: token})
    end
  end
end
