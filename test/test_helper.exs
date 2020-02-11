{:ok, _} = Application.ensure_all_started(:ex_machina)
HTTPoison.start()
ExUnit.start(trace: true)
Ecto.Adapters.SQL.Sandbox.mode(PortfolioMonitor.Repo, :manual)
