defmodule PortfolioMonitorWeb.Router do
  use PortfolioMonitorWeb, :router
  use Pow.Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_csrf_token
  end

  pipeline :protected do
    plug Pow.Plug.RequireAuthenticated,
      error_handler: Pow.Phoenix.PlugErrorHandler
  end

  pipeline :api_protected do
    plug Pow.Plug.RequireAuthenticated, error_handler: PortfolioMonitorWeb.APIAuthErrorHandler
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PortfolioMonitorWeb do
    pipe_through [:browser, :protected]
    get "/", PageController, :index
  end

  scope "/" do
    pipe_through :browser

    pow_routes()
  end

  scope "/api", PortfolioMonitorWeb do
    pipe_through [:api, :api_protected]

    get "/bitmex_accs", BitmexAccController, :index
    post "/bitmex_accs", BitmexAccController, :create
  end

  # Other scopes may use custom stacks.
  # scope "/api", PortfolioMonitorWeb do
  #   pipe_through :api
  # end

  defp put_csrf_token(conn, _) do
    if conn.assigns[:current_user] do
      token = URI.encode_www_form(Plug.CSRFProtection.get_csrf_token())
      assign(conn, :csrf_token, token)
    else
      conn
    end
  end
end
