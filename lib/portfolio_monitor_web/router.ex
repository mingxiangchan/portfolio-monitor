defmodule PortfolioMonitorWeb.Router do
  use PortfolioMonitorWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PortfolioMonitorWeb do
    pipe_through :browser

    get "/bitmex_accs/new", BitmexAccController, :new
    post "/bitmex_accs", BitmexAccController, :create
    get "/", PageController, :index
  end

  scope "/api", PortfolioMonitorWeb do
    pipe_through :api

    get "/positions", PositionController, :index
    get "/margins", MarginController, :index
    get "/orders", OrderDetailController, :index
    resources "/experiments", ExperimentController, only: [:index, :create, :update]
  end

  # Other scopes may use custom stacks.
  # scope "/api", PortfolioMonitorWeb do
  #   pipe_through :api
  # end
end
