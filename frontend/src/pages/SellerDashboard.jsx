import { useState, useEffect } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import SellerNavbar from "../components/sellerComponents/SellerNavbar";
import Icon from "../components/sellerComponents/Icon";
import { getMyStore, getStoreOrders } from "../api/storeApi.js";
import { useSeller } from "../context/SellerContext";
import "../css/SellerDashboard.css";

function OrderPieChart({ successful, rejected, pending }) {
    const chartData = [
        { label: "Successful", value: successful, color: "#16a34a", classSuffix: "successful" },
        { label: "Pending", value: pending, color: "#eab308", classSuffix: "pending" },
        { label: "Rejected", value: rejected, color: "#ef4444", classSuffix: "rejected" },
    ];

    const total = chartData.reduce((acc, item) => acc + item.value, 0);
    let cumulativeAngle = 0;

    const slices = chartData.map((item) => {
        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
        const angle = total > 0 ? (item.value / total) * 360 : 0;

        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        cumulativeAngle += angle;

        const cx = 100;
        const cy = 100;
        const rOuter = 80;
        const rInner = 52;

        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const x1Outer = cx + rOuter * Math.cos(startRad);
        const y1Outer = cy + rOuter * Math.sin(startRad);
        const x2Outer = cx + rOuter * Math.cos(endRad);
        const y2Outer = cy + rOuter * Math.sin(endRad);

        const x1Inner = cx + rInner * Math.cos(endRad);
        const y1Inner = cy + rInner * Math.sin(endRad);
        const x2Inner = cx + rInner * Math.cos(startRad);
        const y2Inner = cy + rInner * Math.sin(startRad);

        const largeArcFlag = angle > 180 ? 1 : 0;

        let pathData = "";
        if (angle >= 359.99) {
            pathData = `
                M ${cx - rOuter} ${cy}
                A ${rOuter} ${rOuter} 0 1 0 ${cx + rOuter} ${cy}
                A ${rOuter} ${rOuter} 0 1 0 ${cx - rOuter} ${cy}
                M ${cx - rInner} ${cy}
                A ${rInner} ${rInner} 0 1 1 ${cx + rInner} ${cy}
                A ${rInner} ${rInner} 0 1 1 ${cx - rInner} ${cy}
                Z
            `;
        } else if (angle > 0) {
            pathData = [
                `M ${x1Outer} ${y1Outer}`,
                `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                `L ${x1Inner} ${y1Inner}`,
                `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
                `Z`,
            ].join(" ");
        }

        return {
            ...item,
            percentage,
            pathData,
        };
    });

    return (
        <div className="sd-pie-card">
            <div className="sd-pie-content">
                <div className="sd-pie-visual">
                    <svg viewBox="0 0 200 200" className="sd-pie-svg">
                        {slices.map(
                            (slice) =>
                                slice.pathData && (
                                    <path
                                        key={slice.label}
                                        d={slice.pathData}
                                        fill={slice.color}
                                        className="sd-pie-slice"
                                    >
                                        <title>{`${slice.label}: ${slice.value} orders (${slice.percentage}%)`}</title>
                                    </path>
                                )
                        )}
                    </svg>
                    <div className="sd-pie-center font-bold">
                        <span className="sd-pie-count">{total}</span>
                        <span className="sd-pie-subtext">Total Orders</span>
                    </div>
                </div>

                <div className="sd-pie-legends">
                    {slices.map((slice) => (
                        <div key={slice.label} className={`sd-legend-box ${slice.classSuffix}`}>
                            <div className="sd-legend-header">
                                <span className="sd-legend-dot" style={{ backgroundColor: slice.color }} />
                                <span className="sd-legend-title">{slice.label} Orders</span>
                            </div>
                            <div className="sd-legend-val-row">
                                <span className="sd-legend-val">{slice.value}</span>
                                <span className="sd-legend-pct">{slice.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function formatStatusLabel(status) {
    if (!status) return "Pending";
    const s = String(status).toUpperCase();
    switch (s) {
        case "PENDING": return "Pending";
        case "PLACED": return "Placed";
        case "CONFIRMED": return "Confirmed";
        case "SHIPPED": return "Shipped";
        case "OUT_FOR_DELIVERY": return "Out for Delivery";
        case "DELIVERED": return "Delivered";
        case "COMPLETED": return "Completed";
        case "CANCELLED": return "Cancelled";
        case "RETURNED": return "Returned";
        default: return status;
    }
}

function getStatusBadgeClass(status) {
    if (!status) return "badge-pending";
    const s = String(status).toUpperCase();
    switch (s) {
        case "DELIVERED":
        case "COMPLETED":
            return "badge-delivered";
        case "SHIPPED":
        case "OUT_FOR_DELIVERY":
        case "CONFIRMED":
        case "PLACED":
            return "badge-shipped";
        case "CANCELLED":
            return "badge-cancelled";
        case "RETURNED":
            return "badge-returned";
        default:
            return "badge-pending";
    }
}

function getStatusCategory(status) {
    if (!status) return "Pending";
    const s = String(status).toUpperCase();
    if (["DELIVERED", "COMPLETED"].includes(s)) {
        return "Successful";
    }
    if (["CANCELLED", "RETURNED", "REJECTED"].includes(s)) {
        return "Rejected";
    }
    return "Pending";
}

function SellerDashboard() {
    const { store: contextStore, storeName } = useSeller();
    const [store, setStore] = useState(contextStore);
    const [rawOrders, setRawOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (contextStore) setStore(contextStore);
    }, [contextStore]);

    useEffect(() => {
        setLoading(true);
        getStoreOrders()
            .then((ordersData) => {
                setRawOrders(ordersData || []);
                setError(null);
            })
            .catch((err) => {
                setError(err.message || "Failed to load dashboard data");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Flatten orders & orderItems for table rendering & statistics
    const itemList = [];
    let totalRevenue = 0;
    const uniqueCustomers = new Set();
    const uniqueProducts = new Set();

    let successfulCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;

    rawOrders.forEach((order) => {
        const category = getStatusCategory(order.orderStatus);
        if (category === "Successful") successfulCount++;
        else if (category === "Pending") pendingCount++;
        else rejectedCount++;

        const customerName = order.address?.fullName || "Customer";
        if (customerName) uniqueCustomers.add(customerName);

        if (order.totalAmt) {
            totalRevenue += Number(order.totalAmt);
        }

        if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach((item) => {
                if (item.productId) uniqueProducts.add(item.productId);
                itemList.push({
                    id: `ORD-${order.orderId}`,
                    orderItemId: item.orderItemId,
                    productId: `PRD-${item.productId}`,
                    productName: item.productName || "Product",
                    customerName: customerName,
                    quantity: item.quantity,
                    totalAmt: item.lineTotal || (item.price * item.quantity) || 0,
                    statusCategory: category,
                    rawStatus: order.orderStatus || "PENDING"
                });
            });
        }
    });

    const totalOrders = rawOrders.length;

    // Filter order items by search term
    const filteredItems = itemList.filter(
        (item) =>
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sd-shell">
            <Sidebar storeName={storeName} />

            <main className="sd-main">
                <SellerNavbar title="Seller Dashboard" />

                {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}

                {store && !store.active && (
                    <div style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fde68a" }}>
                        <span>⚠️ <strong>Your store is currently Inactive.</strong> Your products are hidden from shoppers until you reactivate your store.</span>
                        <a href="/seller/store-info" style={{ backgroundColor: "#92400e", color: "#ffffff", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "bold" }}>
                            Manage Store
                        </a>
                    </div>
                )}

                {/* Section 1: Stats Overview */}
                <section className="sd-section">
                    <h2 className="sd-section-title">
                        <Icon name="bar" size={18} /> Stats Overview
                    </h2>
                    <div className="sd-card-row">
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Orders</span>
                            <span className="sd-stat-value">{loading ? "..." : totalOrders.toLocaleString()}</span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Revenue</span>
                            <span className="sd-stat-value">
                                {loading ? "..." : `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Products Sold</span>
                            <span className="sd-stat-value">{loading ? "..." : uniqueProducts.size.toLocaleString()}</span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Customers</span>
                            <span className="sd-stat-value">{loading ? "..." : uniqueCustomers.size.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* Section 2: Order Breakdown Pie Chart */}
                <section className="sd-section">
                    <h2 className="sd-section-title">
                        <Icon name="pie-chart" size={18} /> Order Status Breakdown
                    </h2>
                    <OrderPieChart
                        successful={successfulCount}
                        rejected={rejectedCount}
                        pending={pendingCount}
                    />
                </section>

                {/* Section 3: Order Listing Table */}
                <section className="sd-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                        <h2 className="sd-section-title" style={{ margin: 0 }}>
                            <Icon name="message" size={18} /> Order Listing
                        </h2>
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
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="sd-no-results">
                                            Loading store orders...
                                        </td>
                                    </tr>
                                ) : filteredItems.length > 0 ? (
                                    filteredItems.map((item, idx) => (
                                        <tr key={item.orderItemId || idx}>
                                            <td className="sd-cell-code">{item.id}</td>
                                            <td className="sd-cell-subcode">{item.productId}</td>
                                            <td className="sd-cell-name">{item.productName}</td>
                                            <td>{item.customerName}</td>
                                            <td className="sd-cell-qty">{item.quantity}</td>
                                            <td>₹{Number(item.totalAmt).toFixed(2)}</td>
                                            <td>
                                                <span className={`sd-status-badge ${getStatusBadgeClass(item.rawStatus)}`}>
                                                    {formatStatusLabel(item.rawStatus)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="sd-no-results">
                                            {searchTerm ? `No orders found matching "${searchTerm}"` : "No orders placed yet"}
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

export default SellerDashboard;