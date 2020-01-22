defmodule PortfolioMonitor.PortfolioTest do
  use PortfolioMonitor.DataCase

  alias PortfolioMonitor.Portfolio

  describe "order_details" do
    alias PortfolioMonitor.Portfolio.OrderDetail

    @valid_attrs %{data: %{}}
    @update_attrs %{data: %{}}
    @invalid_attrs %{data: nil}

    def order_detail_fixture(attrs \\ %{}) do
      {:ok, order_detail} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Portfolio.create_order_detail()

      order_detail
    end

    test "list_order_details/0 returns all order_details" do
      order_detail = order_detail_fixture()
      assert Portfolio.list_order_details() == [order_detail]
    end

    test "get_order_detail!/1 returns the order_detail with given id" do
      order_detail = order_detail_fixture()
      assert Portfolio.get_order_detail!(order_detail.id) == order_detail
    end

    test "create_order_detail/1 with valid data creates a order_detail" do
      assert {:ok, %OrderDetail{} = order_detail} = Portfolio.create_order_detail(@valid_attrs)
      assert order_detail.data == %{}
    end

    test "create_order_detail/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Portfolio.create_order_detail(@invalid_attrs)
    end

    test "update_order_detail/2 with valid data updates the order_detail" do
      order_detail = order_detail_fixture()
      assert {:ok, %OrderDetail{} = order_detail} = Portfolio.update_order_detail(order_detail, @update_attrs)
      assert order_detail.data == %{}
    end

    test "update_order_detail/2 with invalid data returns error changeset" do
      order_detail = order_detail_fixture()
      assert {:error, %Ecto.Changeset{}} = Portfolio.update_order_detail(order_detail, @invalid_attrs)
      assert order_detail == Portfolio.get_order_detail!(order_detail.id)
    end

    test "delete_order_detail/1 deletes the order_detail" do
      order_detail = order_detail_fixture()
      assert {:ok, %OrderDetail{}} = Portfolio.delete_order_detail(order_detail)
      assert_raise Ecto.NoResultsError, fn -> Portfolio.get_order_detail!(order_detail.id) end
    end

    test "change_order_detail/1 returns a order_detail changeset" do
      order_detail = order_detail_fixture()
      assert %Ecto.Changeset{} = Portfolio.change_order_detail(order_detail)
    end
  end
end
