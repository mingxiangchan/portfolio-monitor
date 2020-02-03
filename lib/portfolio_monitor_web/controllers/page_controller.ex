defmodule PortfolioMonitorWeb.PageController do
  use PortfolioMonitorWeb, :controller

  def index(conn, _params) do
    component_path = "#{File.cwd!()}/assets/js/components/App.js"
    props = %{name: "Testing"}

    {:safe, appComponent} = ReactRender.render(component_path, props)

    render(conn, "index.html", appComponent: appComponent)
  end
end
