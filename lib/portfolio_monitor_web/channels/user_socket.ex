defmodule PortfolioMonitorWeb.UserSocket do
  use Phoenix.Socket
  alias PortfolioMonitor.Account

  channel "bitmex_accs:*", PortfolioMonitorWeb.BitmexAccsChannel
  channel "general_btc_info", PortfolioMonitorWeb.GeneralBtcInfoChannel

  def connect(params, socket, _connect_info) do
    with %{"token" => token} <- params,
         {:ok, user} <- find_user(token) do
      {:ok, assign(socket, :user, user)}
    else
      _ -> :error
    end
  end

  def id(socket), do: "user_socket:#{socket.assigns.user.id}"

  defp find_user(token) do
    with {:ok, results} <- Account.Token.verify_and_validate(token),
         %{"user_id" => user_id} <- results do
      {:ok, Account.find_user(user_id)}
    end
  end
end
