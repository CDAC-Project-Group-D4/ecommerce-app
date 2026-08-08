import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import Navbar from "../components/Navbar"; // 

import OrderCard from "../components/customerComponents/Orders/OrderCard";
import EmptyOrders from "../components/customerComponents/orders/EmptyOrders";

import "../css/Orders.css";

function Orders() {
  const navigate = useNavigate();

  const { orders, loading, error, loadOrders } = useOrders();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* 👈 Renders Navbar at the very top of the orders page */}
      <Navbar />

      <div className="orders-page">
        <div className="orders-header">
          <h2>📦 My Orders</h2>
          <p>View and track all your orders</p>
        </div>

        {error && <div className="orders-error">{error}</div>}

        {/* 
                  Adjusted loading logic so the Navbar doesn't disappear 
                  while fetching your items 
                */}
        {loading ? (
          <div className="orders-loading text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <h4 className="mt-3">Loading Orders...</h4>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onView={() => navigate(`/orders/${order.orderId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;