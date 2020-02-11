defmodule PortfolioMonitor.DataCase do
  @moduledoc """
  This module defines the setup for tests requiring
  access to the application's data layer.

  You may define functions here to be used as helpers in
  your tests.

  Finally, if the test case interacts with the database,
  we enable the SQL sandbox, so changes done to the database
  are reverted at the end of every test. If you are using
  PostgreSQL, you can even run database tests asynchronously
  by setting `use PortfolioMonitorWeb.DataCase, async: true`, although
  this option is not recommendded for other databases.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias PortfolioMonitor.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import PortfolioMonitor.DataCase
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(PortfolioMonitor.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(PortfolioMonitor.Repo, {:shared, self()})
    end

    :ok
  end

  def errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end
end
