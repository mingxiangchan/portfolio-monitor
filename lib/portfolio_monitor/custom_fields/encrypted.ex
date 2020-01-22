defmodule PortfolioMonitor.CustomFields.Encrypted do
    import PortfolioMonitor.Account.Encryption
  
    # Assert that this module behaves like an Ecto.Type so that the compiler can
    # warn us if we forget to implement the 4 callback functions below.
    @behaviour Ecto.Type
  
    # This defines the base type of this kind of field in the database.
    def type, do: :text
  
    # This is called on a value in queries if it is not a string.
    def cast(value) do
      {:ok, to_string(value)}
    end
  
    # This is called when the field value is about to be written to the database
    def dump(value) do
      encrypt(value)
    end
  
    # This is called when the field is loaded from the database
    def load(value) do
      decrypt(value)
    end
  end