defmodule PortfolioMonitorWeb.OrderDetailControllerTest do
  use PortfolioMonitorWeb.ConnCase

  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Portfolio.OrderDetail

  @create_attrs %{
    data: %{}
  }
  @update_attrs %{
    data: %{}
  }
  @invalid_attrs %{data: nil}

  def fixture(:order_detail) do
    {:ok, order_detail} = Portfolio.create_order_detail(@create_attrs)
    order_detail
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all order_details", %{conn: conn} do
      conn = get(conn, Routes.order_detail_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create order_detail" do
    test "renders order_detail when data is valid", %{conn: conn} do
      conn = post(conn, Routes.order_detail_path(conn, :create), order_detail: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.order_detail_path(conn, :show, id))

      assert %{
               "id" => id,
               "data" => %{}
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.order_detail_path(conn, :create), order_detail: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update order_detail" do
    setup [:create_order_detail]

    test "renders order_detail when data is valid", %{conn: conn, order_detail: %OrderDetail{id: id} = order_detail} do
      conn = put(conn, Routes.order_detail_path(conn, :update, order_detail), order_detail: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.order_detail_path(conn, :show, id))

      assert %{
               "id" => id,
               "data" => {}
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, order_detail: order_detail} do
      conn = put(conn, Routes.order_detail_path(conn, :update, order_detail), order_detail: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete order_detail" do
    setup [:create_order_detail]

    test "deletes chosen order_detail", %{conn: conn, order_detail: order_detail} do
      conn = delete(conn, Routes.order_detail_path(conn, :delete, order_detail))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.order_detail_path(conn, :show, order_detail))
      end
    end
  end

  defp create_order_detail(_) do
    order_detail = fixture(:order_detail)
    {:ok, order_detail: order_detail}
  end
end
