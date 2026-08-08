import { useState, useEffect } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import SellerNavbar from "../components/sellerComponents/SellerNavbar";
import Icon from "../components/sellerComponents/Icon";
import { getStoreOrders } from "../api/storeApi";
import { getStoreProducts } from "../api/productApi";
import { useSeller } from "../context/SellerContext";
import "../css/SellerDashboard.css";

function SellerOrders() {
    const { storeName, refreshStore, store: contextStore, loadingStore } = useSeller();
    const [rawOrders, setRawOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    useEffect(() => {
        if (!contextStore && !loadingStore && refreshStore) {
            refreshStore();
        }
    }, [contextStore, loadingStore, refreshStore]);

    const fetchOrdersAndProducts = () => {
        setLoading(true);
        setError(null);

        Promise.all([getStoreOrders(), getStoreProducts()])
            .then(([ordersData, productsData]) => {
                setRawOrders(ordersData || []);
                setProducts(productsData || []);
            })
            .catch((err) => {
                console.error("Error fetching seller orders or products:", err);
                setError(err?.response?.data?.message || err?.message || "Failed to load seller orders");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrdersAndProducts();
    }, []);

    // Product Map: productId -> product object
    const stockMap = {};
    (products || []).forEach((prod) => {
        if (prod.id !== undefined) {
            stockMap[prod.id] = prod;
        }
    });

    // Flatten & process backend order items for table view
    const processedItems = [];
    let confirmedCount = 0;
    let cancelledCount = 0;
    let totalRevenue = 0;

    rawOrders.forEach((order) => {
        const customerName = order.userFullName || order.address?.fullName || "Customer";
        const shippingName = order.address?.fullName;
        const customerPhone = order.userPhone || order.address?.mobileNumber;
        const orderStatus = (order.orderStatus || "PENDING").toUpperCase();

        if (["CONFIRMED", "PLACED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"].includes(orderStatus)) {
            confirmedCount++;
        } else if (["CANCELLED", "REJECTED"].includes(orderStatus)) {
            cancelledCount++;
        }

        if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach((item) => {
                const pId = item.productId;
                const matchedProduct = stockMap[pId];
                const availableStock = matchedProduct?.stock !== undefined ? matchedProduct.stock : 0;
                const orderedQty = Number(item.quantity) || 0;
                const itemAmount = item.lineTotal || (item.price * orderedQty) || 0;
                totalRevenue += Number(itemAmount);

                const itemKey = `ORD-${order.orderId}_ITEM-${item.orderItemId || pId}`;

                processedItems.push({
                    itemKey: itemKey,
                    id: `ORD-${order.orderId}`,
                    rawOrderId: order.orderId,
                    orderItemId: item.orderItemId,
                    productId: `PRD-${pId}`,
                    rawProductId: pId,
                    productName: item.productName || matchedProduct?.name || "Product",
                    customerName: customerName,
                    shippingName: shippingName,
                    customerPhone: customerPhone,
                    orderedQty: orderedQty,
                    currentStock: availableStock,
                    totalAmt: itemAmount,
                    status: orderStatus,
                    placedAt: order.placedAt ? new Date(order.placedAt).toLocaleDateString() : "—"
                });
            });
        }
    });

    // Filter items by status tab & search query
    const filteredItems = processedItems.filter((item) => {
        let matchesStatus = true;
        if (statusFilter !== "ALL") {
            matchesStatus = item.status === statusFilter;
        }

        const query = searchTerm.toLowerCase();
        const matchesSearch =
            item.customerName.toLowerCase().includes(query) ||
            item.productName.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query) ||
            item.productId.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    const totalProcessedCount = processedItems.length;
    const fulfillmentRate = totalProcessedCount > 0
        ? ((confirmedCount / totalProcessedCount) * 100).toFixed(1)
        : "0.0";

    const getStatusBadgeClass = (st) => {
        switch (st) {
            case "DELIVERED":
            case "COMPLETED":
            case "CONFIRMED":
            case "PLACED":
                return "badge-delivered";
            case "SHIPPED":
            case "OUT_FOR_DELIVERY":
                return "badge-shipped";
            case "CANCELLED":
            case "REJECTED":
                return "badge-cancelled";
            default:
                return "badge-pending";
        }
    };

    return (
        <div className="sd-shell">
            <Sidebar storeName={storeName} />

            <main className="sd-main">
                <SellerNavbar title="Orders & Confirmation" />

                {/* Alert Notification */}
                {error && (
                    <div style={{ color: "#b91c1c", backgroundColor: "#fef2f2", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #fecaca", fontWeight: "500" }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Section 1: Orders Overview Summary Cards */}
                <section className="sd-section">
                    <h2 className="sd-section-title">
                        <Icon name="bar" size={18} /> Orders Overview & Stock Fulfillment
                    </h2>
                    <div className="sd-card-row">
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Order Items</span>
                            <span className="sd-stat-value">{loading ? "..." : totalProcessedCount.toLocaleString()}</span>
                        </div>
                        <div className="sd-stat-card" style={{ borderLeft: "4px solid #16a34a" }}>
                            <span className="sd-stat-label">Confirmed Orders</span>
                            <span className="sd-stat-value" style={{ color: "#16a34a" }}>
                                {loading ? "..." : confirmedCount.toLocaleString()}
                            </span>
                        </div>
                        <div className="sd-stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
                            <span className="sd-stat-label">Cancelled Orders</span>
                            <span className="sd-stat-value" style={{ color: "#dc2626" }}>
                                {loading ? "..." : cancelledCount.toLocaleString()}
                            </span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Stock Fulfillment Rate</span>
                            <span className="sd-stat-value" style={{ color: Number(fulfillmentRate) >= 80 ? "#16a34a" : "#d97706" }}>
                                {loading ? "..." : `${fulfillmentRate}%`}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Section 2: Orders Table */}
                <section className="sd-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <h2 className="sd-section-title" style={{ margin: 0 }}>
                                <Icon name="truck" size={18} /> Customer Orders Listing
                            </h2>
                            <div style={{ display: "flex", gap: "6px", marginLeft: "12px" }}>
                                {["ALL", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                                    <button
                                        key={status}
                                        className={`btn btn-sm ${statusFilter === status ? "btn-dark" : "btn-outline-secondary"}`}
                                        onClick={() => setStatusFilter(status)}
                                        style={{ borderRadius: "20px", fontSize: "12px", padding: "4px 12px" }}
                                    >
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sd-search" style={{ margin: 0 }}>
                            <Icon name="search" size={16} />
                            <input
                                type="text"
                                placeholder="Search Customer, Order ID or Product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sd-table-card">
                        <table className="sd-orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Customer Name</th>
                                    <th>Ordered Qty</th>
                                    <th>Current Stock in DB</th>
                                    <th>Total Amount</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="sd-no-results">
                                            Loading customer orders from backend...
                                        </td>
                                    </tr>
                                ) : filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr key={item.itemKey}>
                                            <td className="sd-cell-code">{item.id}</td>
                                            <td className="sd-cell-subcode">{item.productId}</td>
                                            <td className="sd-cell-name">{item.productName}</td>
                                            <td>
                                                <div style={{ fontWeight: "600", color: "#111827" }}>{item.customerName}</div>
                                                {item.customerPhone && (
                                                    <div style={{ fontSize: "11.5px", color: "#6b7280" }}>{item.customerPhone}</div>
                                                )}
                                            </td>
                                            <td className="sd-cell-qty" style={{ fontWeight: "700" }}>{item.orderedQty}</td>
                                            <td className="sd-cell-qty" style={{ fontWeight: "700", color: item.currentStock > 5 ? "#16a34a" : "#dc2626" }}>
                                                {item.currentStock}
                                            </td>
                                            <td style={{ fontWeight: "600" }}>₹{Number(item.totalAmt).toFixed(2)}</td>
                                            <td>
                                                <span className={`sd-status-badge ${getStatusBadgeClass(item.status)}`} style={{ textTransform: "uppercase" }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="sd-no-results">
                                            {searchTerm
                                                ? `No orders found matching "${searchTerm}"`
                                                : "No orders found in your store"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default SellerOrders;
