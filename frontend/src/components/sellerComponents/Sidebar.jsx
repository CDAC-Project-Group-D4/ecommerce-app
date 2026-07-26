import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import "../../css/Sidebar.css";

const NAV_ITEMS = [
    { to: "/seller/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/seller/store-info", label: "Store Information", icon: "store" },
    { to: "/seller/products", label: "Products", icon: "box" },
    { to: "/seller/orders", label: "Orders & Delivery", icon: "truck" },
    { to: "/seller/returns", label: "Returns", icon: "return" },
    { to: "/seller/customer-info", label: "Customer information", icon: "users" },
    { to: "/seller/cancel-order", label: "Cancelled Order", icon: "cancel" },
];

function Sidebar({ storeName = "Your Store" }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        navigate("/signin");
    };

    return (
        <aside className="sd-sidebar">
            <div className="sd-brand">
                <Icon name="cart" size={20} />
                <span>Seller</span>
            </div>

            <button className="sd-shop-switcher">
                <span className="sd-shop-avatar" />
                <span className="sd-shop-text">
                    <span className="sd-shop-label">Shop viewing</span>
                    <span className="sd-shop-name">{storeName}</span>
                </span>
            </button>

            <nav className="sd-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `sd-nav-item ${isActive ? "active" : ""}`}
                    >
                        <Icon name={item.icon} size={17} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sd-footer">
                <button className="sd-nav-item sd-logout" onClick={handleLogout}>
                    <Icon name="logout" size={17} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;