import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { signoutUser } from "../../api/authApi";
import { useSeller } from "../../context/SellerContext";
import "../../css/Sidebar.css";

const getImageUrl = (url) => {
    if (!url) return null;
    if (
        url.startsWith("http://") || 
        url.startsWith("https://") || 
        url.startsWith("data:") || 
        url.startsWith("blob:")
    ) {
        return url;
    }
    const cleanPath = url.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:8080${formattedPath}`;
};

const NAV_ITEMS = [
    { to: "/seller/dashboard", label: "Seller Dashboard", icon: "dashboard" },
    { to: "/seller/store-info", label: "Store Information", icon: "store" },
    { to: "/seller/products", label: "Products", icon: "box" },
    { to: "/seller/customer-info", label: "Customers", icon: "users" },
    { to: "/seller/orders", label: "Orders & Confirmation", icon: "truck" },
    { to: "/seller/returns", label: "Returns", icon: "return" },
];

function Sidebar({ storeName: propStoreName }) {
    const navigate = useNavigate();
    const sellerContext = useSeller();

    const displayStoreName = (propStoreName && propStoreName !== "Your Store")
        ? propStoreName
        : (sellerContext?.storeName || "Your Store");

    const profileImgUrl = getImageUrl(sellerContext?.store?.profilePhotoUrl);

    const handleLogout = async () => {
        try {
            await signoutUser();
        } catch (err) {
            console.error("Signout error:", err);
        }
        if (sellerContext?.clearSellerState) {
            sellerContext.clearSellerState();
        }
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
                <span
                    className="sd-shop-avatar"
                    style={profileImgUrl ? { backgroundImage: `url("${profileImgUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                    {profileImgUrl && (
                        <img
                            src={profileImgUrl}
                            alt="Shop Avatar"
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    )}
                </span>
                <span className="sd-shop-text">
                    <span className="sd-shop-label">Shop viewing</span>
                    <span className="sd-shop-name">{displayStoreName}</span>
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