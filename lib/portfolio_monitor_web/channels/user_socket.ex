defmodule PortfolioMonitorWeb.UserSocket do
  use Phoenix.Socket
  alias PortfolioMonitor.Account.User

  channel "bitmex_accs:*", PortfolioMonitorWeb.BitmexAccsChannel
  channel "general_btc_info", PortfolioMonitorWeb.GeneralBtcInfoChannel

  def connect(_params, socket, connect_info) do
    case authorized?(connect_info) do
      {:ok, user} -> {:ok, assign(socket, :user, user)}
      {:error, :not_found} -> :error
    end
  end

  def id(socket), do: "user_socket:#{socket.assigns.user.id}"

  @spec authorized?(Map.t()) :: {:ok, User.t()} | {:error, atom}
  defp authorized?(connect_info) do
    case connect_info do
      %{session: %{"portfolio_monitor_auth" => key}} -> process_session(key)
      _ -> {:error, :not_found}
    end
  end

  @spec process_session(String.t()) :: {:ok, User.t()} | {:error, atom}
  defp process_session(session_key) do
    backend =
      Keyword.merge(
        Application.get_env(:portfolio_monitor, :pow, []),
        backend: PortfolioMonitorWeb.PowRedisCache
      )

    case Pow.Store.CredentialsCache.get(backend, session_key) do
      {%User{} = user, _session_details} ->
        {:ok, user}

      :not_found ->
        {:error, :not_found}
    end
  end
end
