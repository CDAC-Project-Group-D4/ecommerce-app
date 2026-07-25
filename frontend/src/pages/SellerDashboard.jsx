import { useState } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import Icon from "../components/sellerComponents/Icon";
import "../css/SellerDashboard.css";

// Sample Order Data
const INITIAL_ORDERS = [
    { id: "ORD-7821", productId: "PRD-101", productName: "Self Love Club Retro Print", customerName: "Emily Carter", quantity: 2, status: "Successful" },
    { id: "ORD-7822", productId: "PRD-204", productName: "Retro Quote Wall Print", customerName: "Charlotte Smith", quantity: 1, status: "Pending" },
    { id: "ORD-7823", productId: "PRD-305", productName: "Minimalist Abstract Frame", customerName: "Henry Reed", quantity: 3, status: "Rejected" },
    { id: "ORD-7824", productId: "PRD-102", productName: "Vintage Aesthetic Poster", customerName: "Sophia Martinez", quantity: 1, status: "Successful" },
    { id: "ORD-7825", productId: "PRD-408", productName: "Boho Sun & Moon Canvas", customerName: "Liam Johnson", quantity: 2, status: "Pending" },
    { id: "ORD-7826", productId: "PRD-201", productName: "Mid-Century Modern Art", customerName: "Olivia Davis", quantity: 1, status: "Successful" },
    { id: "ORD-7827", productId: "PRD-512", productName: "Botanical Leaf Line Art", customerName: "Ethan Brown", quantity: 4, status: "Rejected" },
    { id: "ORD-7828", productId: "PRD-105", productName: "Japanese Wave Painting", customerName: "Ava Wilson", quantity: 2, status: "Successful" },
    { id: "ORD-7829", productId: "PRD-309", productName: "Geometric Terracotta Print", customerName: "Lucas Miller", quantity: 1, status: "Pending" },
    { id: "ORD-7830", productId: "PRD-412", productName: "Typography Coffee Poster", customerName: "Mia Taylor", quantity: 3, status: "Successful" },
];

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

function SellerDashboard() {
    const storeName = "Your Store";
    const [orders] = useState(INITIAL_ORDERS);
    const [searchTerm, setSearchTerm] = useState("");

    // Calculate pie chart statistics from orders
    const successfulCount = orders.filter((o) => o.status === "Successful").length;
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const rejectedCount = orders.filter((o) => o.status === "Rejected").length;

    // Filter orders by search term
    const filteredOrders = orders.filter(
        (o) =>
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sd-shell">
            <Sidebar storeName={storeName} />

            <main className="sd-main">
                <div className="sd-topbar">
                    <div className="sd-search">
                        <Icon name="search" size={16} />
                        <input
                            type="text"
                            placeholder="Search Customer, Order ID or Product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Section 1: Stats Overview */}
                <section className="sd-section">
                    <h2 className="sd-section-title">
                        <Icon name="bar" size={18} /> Stats Overview
                    </h2>
                    <div className="sd-card-row">
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Orders</span>
                            <span className="sd-stat-value">24,432</span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Sales per annum</span>
                            <span className="sd-stat-value">1,423</span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Products</span>
                            <span className="sd-stat-value">578</span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Customers</span>
                            <span className="sd-stat-value">578</span>
                        </div>
                    </div>
                </section>

                {/* Section 2: Order Breakdown Pie Chart (Between Stats Overview and Order Listing) */}
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
                    <h2 className="sd-section-title">
                        <Icon name="message" size={18} /> Order Listing
                    </h2>
                    <div className="sd-table-card">
                        <table className="sd-orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Customer Name</th>
                                    <th>Quantity</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="sd-cell-code">{order.id}</td>
                                            <td className="sd-cell-subcode">{order.productId}</td>
                                            <td className="sd-cell-name">{order.productName}</td>
                                            <td>{order.customerName}</td>
                                            <td className="sd-cell-qty">{order.quantity}</td>
                                            <td>
                                                <span className={`sd-status-badge badge-${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="sd-no-results">
                                            No orders found matching "{searchTerm}"
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