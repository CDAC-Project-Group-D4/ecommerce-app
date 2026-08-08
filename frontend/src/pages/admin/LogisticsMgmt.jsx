import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from "../../api/adminApi";
import {
  Truck,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Package,
  Calendar,
  AlertCircle,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  IndianRupee,
} from "lucide-react";

// Format CustomerAddressResponseDTO
const formatAddress = (addr) => {
  if (!addr) return "N/A";
  if (typeof addr === "string") return addr;

  const { addressLine1, addressLine2, city, state, pincode, country } = addr;
  const parts = [
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

// Extract Customer Name from CustomerAddressResponseDTO
const getCustomerName = (order) => {
  if (order?.address?.fullName) return order.address.fullName;
  if (order?.address?.name) return order.address.name;
  return "N/A";
};

// Extract Mobile Number from CustomerAddressResponseDTO
const getCustomerPhone = (order) => {
  if (order?.address?.mobileNumber) return order.address.mobileNumber;
  if (order?.address?.phone) return order.address.phone;
  return "N/A";
};

const LogisticsMgmt = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Orders from Spring Boot Endpoint
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAllOrders();

      const data = Array.isArray(response)
        ? response
        : response?.content || response.data?.data || [];

      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to fetch order and logistics data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleRow = (orderId) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId));
  };

  // Trigger Out For Delivery Action
  const handleMarkOutForDelivery = async (orderId) => {
    try {
      setActionLoading(true);
      setError(null);
      await adminApi.markOutForDelivery(orderId);

      // Re-fetch to get synced backend state or update locally
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: "OUT_FOR_DELIVERY" } : o,
        ),
      );
    } catch (err) {
      console.error("Out for delivery error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to mark order as Out For Delivery.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger Delivered Action
  const handleMarkDelivered = async (orderId) => {
    try {
      setActionLoading(true);
      setError(null);
      await adminApi.markDelivered(orderId);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: "DELIVERED" } : o,
        ),
      );
    } catch (err) {
      console.error("Mark delivered error:", err);
      setError(
        err.response?.data?.message || "Failed to mark order as Delivered.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Helper matching OrderStatus enum
  const getStatusBadge = (orderStatus = "") => {
    const st = String(orderStatus).toUpperCase();

    if (st === "DELIVERED" || st === "COMPLETED") {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
          <CheckCircle2 size={12} />
          {orderStatus}
        </span>
      );
    }
    if (st === "OUT_FOR_DELIVERY" || st === "SHIPPED") {
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1">
          <Truck size={12} />
          {orderStatus}
        </span>
      );
    }
    if (st === "PENDING" || st === "PLACED" || st === "CONFIRMED") {
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-1">
          <Clock size={12} />
          {orderStatus}
        </span>
      );
    }
    if (st === "CANCELLED" || st === "RETURNED") {
      return (
        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle d-inline-flex align-items-center gap-1">
          <XCircle size={12} />
          {orderStatus}
        </span>
      );
    }
    return (
      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
        {orderStatus}
      </span>
    );
  };

  // Search & Filter Logic based on OrderResponseDTO fields
  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return orders.filter((order) => {
      const orderIdStr = String(order.orderId || "").toLowerCase();
      const customerName = getCustomerName(order).toLowerCase();
      const addressStr = formatAddress(order.address).toLowerCase();
      const statusStr = String(order.orderStatus || "").toLowerCase();

      const matchesSearch =
        !term ||
        orderIdStr.includes(term) ||
        customerName.includes(term) ||
        addressStr.includes(term) ||
        statusStr.includes(term);

      const matchesStatus =
        selectedStatus === "ALL" ||
        String(order.orderStatus).toUpperCase() === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(
      new Set(
        orders
          .map((o) => String(o.orderStatus || "").toUpperCase())
          .filter(Boolean),
      ),
    );
  }, [orders]);

  // Pagination Math
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = useMemo(() => {
    return filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredOrders, indexOfFirstItem, indexOfLastItem]);

  return (
    <div className="container-fluid p-0">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Logistics & Order Delivery</h3>
          <p className="text-muted mb-0">
            Dispatch orders, update delivery progress, and view fulfillment
            details
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={fetchOrders}
          disabled={loading || actionLoading}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-4"
          role="alert"
        >
          <AlertCircle size={18} />
          <div>{error}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-8 col-lg-9">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by Order ID, Customer Name, or Address..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Filter size={18} />
                </span>
                <select
                  className="form-select border-start-0"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  {uniqueStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="card-title mb-0 d-flex align-items-center gap-2">
            <Truck size={18} className="text-primary" />
            <span>Fulfillment Queue ({filteredOrders.length})</span>
          </h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading orders...</span>
              </div>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Package size={36} className="mb-2 text-secondary opacity-50" />
              <p className="mb-0">No orders found matching your search.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "4%" }}></th>
                    <th style={{ width: "16%" }}>Order ID</th>
                    <th style={{ width: "22%" }}>Customer</th>
                    <th style={{ width: "26%" }}>Delivery Address</th>
                    <th style={{ width: "14%" }}>Status</th>
                    <th style={{ width: "18%" }} className="text-end pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => {
                    const orderId = order.orderId;
                    const isExpanded = expandedRow === orderId;

                    const formattedAddr = formatAddress(order.address);
                    const customerName = getCustomerName(order);
                    const customerPhone = getCustomerPhone(order);

                    return (
                      <React.Fragment key={orderId}>
                        <tr>
                          {/* Toggle Expand */}
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 text-dark text-decoration-none"
                              onClick={() => toggleRow(orderId)}
                            >
                              {isExpanded ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>
                          </td>

                          {/* Order ID & Date */}
                          <td>
                            <div className="fw-bold text-primary font-monospace small">
                              #{orderId}
                            </div>
                            <div
                              className="text-muted small d-flex align-items-center gap-1"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <Calendar size={12} />
                              {order.placedAt
                                ? new Date(order.placedAt).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>

                          {/* Customer */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-light text-dark fw-bold d-flex align-items-center justify-content-center border"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "0.75rem",
                                }}
                              >
                                <User size={14} />
                              </div>
                              <div>
                                <div className="fw-semibold text-dark small">
                                  {customerName}
                                </div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {customerPhone}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Delivery Address */}
                          <td>
                            <div className="d-flex align-items-center gap-1 text-dark small">
                              <MapPin
                                size={14}
                                className="text-muted flex-shrink-0"
                              />
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "220px" }}
                                title={formattedAddr}
                              >
                                {formattedAddr}
                              </span>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td>
                            {getStatusBadge(order.orderStatus || "PENDING")}
                          </td>

                          {/* Actions aligned with Backend Service Conditions */}
                          <td className="text-end pe-4">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={
                                  actionLoading ||
                                  order.orderStatus !== "SHIPPED"
                                }
                                onClick={() =>
                                  handleMarkOutForDelivery(orderId)
                                }
                                title={
                                  order.orderStatus !== "SHIPPED"
                                    ? "Order must be SHIPPED first"
                                    : "Mark Out for Delivery"
                                }
                              >
                                Out for Delivery
                              </button>
                              <button
                                className="btn btn-outline-success btn-sm"
                                disabled={
                                  actionLoading ||
                                  order.orderStatus !== "OUT_FOR_DELIVERY"
                                }
                                onClick={() => handleMarkDelivered(orderId)}
                                title={
                                  order.orderStatus !== "OUT_FOR_DELIVERY"
                                    ? "Order must be OUT_FOR_DELIVERY first"
                                    : "Mark Delivered"
                                }
                              >
                                Delivered
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Drawer */}
                        {isExpanded && (
                          <tr className="bg-light">
                            <td colSpan="6" className="p-3">
                              <div className="card border shadow-sm">
                                <div className="card-header bg-white py-2 fw-semibold text-muted small d-flex align-items-center gap-2">
                                  <Package size={16} />
                                  <span>Order & Items Breakdown</span>
                                </div>
                                <div className="card-body">
                                  <div className="row g-3 mb-3">
                                    <div className="col-md-3">
                                      <div className="p-2 bg-light rounded border">
                                        <div className="text-muted small">
                                          Total Amount
                                        </div>
                                        <div className="fw-semibold text-dark small d-flex align-items-center gap-1">
                                          <IndianRupee size={14} />
                                          {order.totalAmt ?? "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="p-2 bg-light rounded border">
                                        <div className="text-muted small">
                                          Payment Method
                                        </div>
                                        <div className="fw-semibold text-dark small">
                                          {order.paymentMethod || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="p-2 bg-light rounded border">
                                        <div className="text-muted small">
                                          Tracking ID
                                        </div>
                                        <div className="fw-semibold text-dark small font-monospace">
                                          {order.trackingId || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="p-2 bg-light rounded border">
                                        <div className="text-muted small">
                                          Payment Ref
                                        </div>
                                        <div className="fw-semibold text-dark small font-monospace">
                                          {order.paymentRef || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Order Items List */}
                                  {order.orderItems &&
                                    order.orderItems.length > 0 && (
                                      <div className="mb-3">
                                        <h6 className="fw-bold small text-secondary mb-2">
                                          Order Items ({order.orderItems.length}
                                          )
                                        </h6>
                                        <div className="list-group">
                                          {order.orderItems.map((item) => (
                                            <div
                                              key={item.orderItemId}
                                              className="list-group-item d-flex justify-content-between align-items-center py-2"
                                            >
                                              <div className="d-flex align-items-center gap-2">
                                                {item.productImage && (
                                                  <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    style={{
                                                      width: "32px",
                                                      height: "32px",
                                                      objectFit: "cover",
                                                      borderRadius: "4px",
                                                    }}
                                                  />
                                                )}
                                                <div>
                                                  <div className="fw-semibold small">
                                                    {item.productName}
                                                  </div>
                                                  <div className="text-muted extra-small">
                                                    Qty: {item.quantity} × ₹
                                                    {item.price}
                                                  </div>
                                                </div>
                                              </div>
                                              <span className="fw-bold small text-dark">
                                                ₹{item.lineTotal}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="card-footer bg-white py-3 d-flex align-items-center justify-content-between">
            <span className="small text-muted">
              Showing{" "}
              <span className="fw-semibold">{indexOfFirstItem + 1}</span> to{" "}
              <span className="fw-semibold">
                {Math.min(indexOfLastItem, filteredOrders.length)}
              </span>{" "}
              of <span className="fw-semibold">{filteredOrders.length}</span>{" "}
              orders
            </span>

            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={`page-${i + 1}`}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsMgmt;
