import { useState } from "react";
import { useLocation } from "react-router-dom";
import Icon from "./Icon";
import { getCurrentUser } from "../../utils/authhelper";
import "../../css/SellerNavbar.css";

const PAGE_CONFIG = {
    "/seller/dashboard": { title: "Seller Dashboard", icon: "dashboard" },
    "/seller/store-info": { title: "Store Information", icon: "store" },
    "/seller/products": { title: "Store Products", icon: "box" },
    "/seller/orders": { title: "Orders & Delivery", icon: "truck" },
    "/seller/returns": { title: "Returns", icon: "return" },
    "/seller/customer-info": { title: "Customer Information", icon: "users" },
    "/seller/cancel-order": { title: "Cancelled Orders", icon: "cancel" },
};

function SellerNavbar({ title: customTitle, icon: customIcon }) {
    const location = useLocation();
    const currentUser = getCurrentUser();
    const sellerName = currentUser?.name || currentUser?.fullName || "Seller";
    const sellerEmail = currentUser?.email || "seller@example.com";

    const [hasUnread, setHasUnread] = useState(true);

    const currentConfig = PAGE_CONFIG[location.pathname] || { title: "Seller Dashboard", icon: "dashboard" };
    const pageTitle = customTitle || currentConfig.title;
    const iconName = customIcon || currentConfig.icon;

    return (
        <div className="seller-navbar-divider">
            {/* Page Section Title + Icon on Left */}
            <div className="sn-title-container">
                {iconName && <Icon name={iconName} size={22} />}
                <h1 className="sn-page-title">{pageTitle}</h1>
            </div>

            {/* Right Side: Notification Button + Seller Information */}
            <div className="sn-actions-profile">
                <button
                    type="button"
                    className="sn-notify-btn"
                    title="Notifications"
                    onClick={() => setHasUnread(false)}
                >
                    <Icon name="bell" size={18} />
                    {hasUnread && <span className="sn-notify-badge" />}
                </button>

                <div className="sn-user-card">
                    <div className="sn-user-avatar">
                        <Icon name="user" size={18} />
                    </div>
                    <div className="sn-user-details">
                        <span className="sn-user-name">{sellerName}</span>
                        <span className="sn-user-email">{sellerEmail}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerNavbar;
