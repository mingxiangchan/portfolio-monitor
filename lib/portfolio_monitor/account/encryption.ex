defmodule PortfolioMonitor.Account.Encryption do
    def encrypt(data) do
        case ExCrypto.encrypt(key(), secret(), data) do
            {:ok, {_ad, {iv, cipher_text, cipher_tag}}} ->
                ExCrypto.encode_payload(iv, cipher_text, cipher_tag)
            {:error, message} -> {:error, message}
        end
    end

    @spec decrypt(binary) :: {:error, :decrypt_failed | binary} | {:ok, binary}
    def decrypt(cipher) do
        {:ok, {iv, cipher_text, cipher_tag}} = ExCrypto.decode_payload(cipher)
        ExCrypto.decrypt(key(),secret(),iv, cipher_text, cipher_tag)
    end

    def key do
        Application.get_env(:portfolio_monitor, :aes_key) 
        |> Base.url_decode64!
    end

    def secret do
        Application.get_env(:portfolio_monitor, :secret_key_base)
    end
end