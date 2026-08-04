import { useState, useEffect } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import SellerNavbar from "../components/sellerComponents/SellerNavbar";
import Icon from "../components/sellerComponents/Icon";
import { getStoreOrders } from "../api/storeApi";
import { useSeller } from "../context/SellerContext";
import "../css/SellerDashboard.css";
import "../css/CustomerInfo.css";

function CustomerInfo() {
    const { storeName } = useSeller();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setLoading(true);
        getStoreOrders()
            .then((ordersData) => {
                // Group orders by customer name & mobile number to aggregate customer details
                const customerMap = new Map();

                (ordersData || []).forEach((order) => {
                    const address = order.address;
                    const name = address?.fullName || "Guest Customer";
                    const phone = address?.mobileNumber || "—";
                    const key = `${name.toLowerCase()}_${phone}`;

                    const addressParts = [
                        address?.addressLine1,
                        address?.addressLine2,
                        address?.city,
                        address?.state,
                        address?.pincode
                    ].filter(Boolean).join(", ");

                    const fullAddress = addressParts || "Address not provided";

                    const orderAmt = Number(order.totalAmt) || 0;
                    const orderDate = order.placedAt ? new Date(order.placedAt).toLocaleDateString() : "—";

                    if (!customerMap.has(key)) {
                        customerMap.set(key, {
                            id: `CUST-${customerMap.size + 1}`,
                            fullName: name,
                            mobileNumber: phone,
                            address: fullAddress,
                            city: address?.city || "—",
                            state: address?.state || "—",
                            pincode: address?.pincode || "",
                            totalOrders: 1,
                            totalSpent: orderAmt,
                            lastOrderId: `ORD-${order.orderId}`,
                            lastOrderDate: orderDate
                        });
                    } else {
                        const existing = customerMap.get(key);
                        existing.totalOrders += 1;
                        existing.totalSpent += orderAmt;
                        existing.lastOrderId = `ORD-${order.orderId}`;
                        existing.lastOrderDate = orderDate;
                    }
                });

                setCustomers(Array.from(customerMap.values()));
                setError(null);
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || (typeof err === "string" ? err : err.message) || "Failed to load customer information";
                setError(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Filter customers based on search query
    const filteredCustomers = customers.filter((cust) => {
        const query = searchTerm.toLowerCase();
        return (
            cust.fullName.toLowerCase().includes(query) ||
            cust.mobileNumber.toLowerCase().includes(query) ||
            cust.address.toLowerCase().includes(query) ||
            cust.city.toLowerCase().includes(query)
        );
    });

    const totalCustomersCount = customers.length;
    const totalSpentSum = customers.reduce((acc, c) => acc + c.totalSpent, 0);

    return (
        <div className="sd-shell">
            <Sidebar storeName={storeName} />

            <main className="sd-main">
                <SellerNavbar title="Customer Information" />

                {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}

                {/* Section 1: Customer Overview Stats */}
                <section className="sd-section">
                    <div className="sd-card-row">
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Unique Customers</span>
                            <span className="sd-stat-value">{loading ? "..." : totalCustomersCount}</span>
                        </div>
                        <div className="sd-stat-card">
                            <span className="sd-stat-label">Total Customer Revenue</span>
                            <span className="sd-stat-value">
                                {loading ? "..." : `₹${totalSpentSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Section 2: Customer Table */}
                <section className="sd-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                        <h2 className="sd-section-title" style={{ margin: 0 }}>
                            <Icon name="users" size={18} /> Customers ({filteredCustomers.length})
                        </h2>
                        <div className="sd-search" style={{ margin: 0 }}>
                            <Icon name="search" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, phone or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sd-table-card">
                        <table className="sd-orders-table">
                            <thead>
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
                                    <th>Shipping Address</th>
                                    <th>Total Orders</th>
                                    <th>Total Spent</th>
                                    <th>Last Order ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="sd-no-results">
                                            Loading customer details...
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((cust) => (
                                        <tr key={cust.id}>
                                            <td className="sd-cell-code">{cust.id}</td>
                                            <td className="sd-cell-name">
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <div className="ci-avatar-thumb">
                                                        <Icon name="user" size={14} />
                                                    </div>
                                                    <span>{cust.fullName}</span>
                                                </div>
                                            </td>
                                            <td>{cust.mobileNumber}</td>
                                            <td style={{ maxWidth: "260px", whiteSpace: "normal" }}>{cust.address}</td>
                                            <td className="sd-cell-qty">{cust.totalOrders}</td>
                                            <td style={{ fontWeight: "600" }}>₹{cust.totalSpent.toFixed(2)}</td>
                                            <td>
                                                <span className="sd-cell-code">{cust.lastOrderId}</span>
                                                <div style={{ fontSize: "11px", color: "#9ca3af" }}>{cust.lastOrderDate}</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="sd-no-results">
                                            {searchTerm ? `No customer found matching "${searchTerm}"` : "No customer orders received yet"}
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

export default CustomerInfo;
