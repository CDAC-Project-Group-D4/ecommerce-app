import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../../api/customerApi";

const formatStatus = (status) => status?.replaceAll("_", " ");

const getStatusStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "CANCELLED":
      return { color: "#b42318", backgroundColor: "#fdecec" };
    case "DELIVERED":
    case "COMPLETED":
      return { color: "#166534", backgroundColor: "#dcfce7" };
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return { color: "#075985", backgroundColor: "#e0f2fe" };
    case "CONFIRMED":
      return { color: "#1e7b3b", backgroundColor: "#e6f7ec" };
    default:
      return { color: "#9a6700", backgroundColor: "#fff3cd" };
  }
};

export function OrdersTab() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    orderApi
      .getOrders()
      .then((res) => {
        // Normalizes data lookup layers accurately
        const data = res?.data || res;
        setOrders(Array.isArray(data) ? data : data.content || []);
      })
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelItem = async (orderId, orderItemId) => {
    if (window.confirm("Are you sure you want to cancel this item?")) {
      setCancellingId(orderItemId);
      try {
        await orderApi.cancelOrderItem(orderId, orderItemId);
        alert("Order item cancelled successfully.");
        loadOrders();
      } catch (err) {
        console.error("Failed to cancel order item:", err);
        alert(err?.response?.data?.message || "Could not cancel the item. Please try again.");
      } finally {
        setCancellingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div
          className="spinner-border"
          style={{ color: "var(--cart-orange, #ff7a29)" }}
          role="status"
        ></div>
        <p className="mt-3 text-muted fw-semibold">Loading order history...</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4" style={{ color: "#211a17" }}>
        Order History
      </h4>

      {orders.length === 0 ? (
        <div className="p-5 text-center border rounded-4 bg-white shadow-sm">
          <p className="text-muted mb-0 fw-medium">
            No order history discovered yet.
          </p>
        </div>
      ) : (
        orders.map((ord) => {
          // Maps properties cleanly against incoming backend keys
          const currentOrderId = ord.orderId || ord.id;
          const total = ord.totalAmt || ord.totalAmount || 0;
          const orderDate = ord.placedAt || ord.createdAt;
          const itemsList = ord.orderItems || ord.items || [];

          return (
            <div
              key={currentOrderId}
              className="card mb-4 border shadow-sm rounded-4 overflow-hidden bg-white"
            >
              <div className="card-header bg-light border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                <div>
                  <strong className="fs-6" style={{ color: "#211a17" }}>
                    Order #{currentOrderId}
                  </strong>
                  {orderDate && (
                    <small className="text-muted ms-2 fw-medium">
                      •{" "}
                      {new Date(orderDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                  )}
                </div>
                <span
                  className={`badge px-3 py-2 rounded-2 fw-bold`}
                  style={{
                    backgroundColor:
                      ord.orderStatus === "CANCELLED"
                        ? "#f8d7da"
                        : ord.orderStatus === "DELIVERED"
                          ? "#d1e7dd"
                          : "#fff3cd",
                    color:
                      ord.orderStatus === "CANCELLED"
                        ? "#842029"
                        : ord.orderStatus === "DELIVERED"
                          ? "#0f5132"
                          : "#664d03",
                  }}
                >
                  {formatStatus(ord.orderStatus)}
                </span>
              </div>

              <div className="card-body px-4 py-3">
                {/* Fixed internal collection element parsing loop */}
                {itemsList.length > 0 && (
                  <ul className="list-group list-group-flush mb-3">
                    {itemsList.map((item, idx) => {
                      const itemId = item.orderItemId || item.id || idx;
                      const itemStatus = item.itemStatus || ord.orderStatus;
                      return (
                        <li
                          key={itemId}
                          className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom"
                        >
                          <div className="d-flex align-items-center gap-3">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="rounded object-fit-contain border bg-light"
                                style={{ width: "50px", height: "50px" }}
                              />
                            )}
                            <div>
                              <span className="fw-semibold text-dark d-block">
                                {item.productName || item.name}
                              </span>
                              <small className="text-muted">
                                Qty: {item.quantity} × ₹{item.price}
                              </small>
                              {["PENDING", "PLACED", "CONFIRMED"].includes(
                                itemStatus?.toUpperCase(),
                              ) && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm mt-2 d-block"
                                  onClick={() => handleCancelItem(currentOrderId, itemId)}
                                  disabled={cancellingId === itemId}
                                >
                                  {cancellingId === itemId ? "Cancelling..." : "Cancel Item"}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="d-flex flex-column align-items-end gap-2">
                            <span
                              className="badge"
                              style={getStatusStyle(itemStatus)}
                            >
                              {formatStatus(itemStatus)}
                            </span>
                            <span className="fw-bold text-dark">
                              ₹
                              {(
                                item.lineTotal || item.quantity * item.price
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                  <p className="mb-0 fs-5 fw-medium text-dark">
                    Total Amount:{" "}
                    <strong
                      style={{ color: "var(--cart-orange-dark, #ff5c00)" }}
                    >
                      ₹
                      {Number(total).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </p>
                  <button
                    type="button"
                    className="btn btn-warning fw-semibold"
                    onClick={() => navigate(`/orders/${currentOrderId}`)}
                    aria-label={`View details for order ${currentOrderId}`}
                  >
                    Order Details
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
