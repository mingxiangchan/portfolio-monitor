defmodule PortfolioMonitorWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "bitmex_acc:*", PortfolioMonitorWeb.BitmexAccChannel

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(_params, socket, connect_info) do
    case authorized?(connect_info) do
      :ok -> {:ok, socket}  
      :not_found -> {:error, %{reason: "unauthorized"}}
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     PortfolioMonitorWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil

  defp authorized?(connect_info) do
    case  connect_info do
      %{session: nil} -> :not_found
      %{session: %{"portfolio_monitor_auth" => session_key}} ->
        backend = Keyword.merge(
          Application.get_env(:portfolio_monitor, :pow, []), 
          [backend:  Pow.Store.Backend.EtsCache] 
        )
        case Pow.Store.CredentialsCache.get(backend, session_key) do
          {_, _} -> 
            :ok
          :not_found -> 
            :not_found
        end  
      _ -> :not_found       
    end

  end
end
