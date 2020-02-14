defmodule PortfolioMonitorWeb.UserController do
    use PortfolioMonitorWeb, :controller
  
    alias PortfolioMonitor.Account.User
  
    action_fallback PortfolioMonitorWeb.FallbackController

    def show(conn, _args) do
        user = Pow.Plug.current_user(conn)
        conn
        |> render("show.json", user: user)
      end
end