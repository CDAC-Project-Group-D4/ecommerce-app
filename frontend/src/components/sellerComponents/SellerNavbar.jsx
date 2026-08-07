import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Icon from "./Icon";
import { getCurrentUser } from "../../utils/authhelper";
import { getSellerNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../api/notificationApi";
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

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const currentConfig = PAGE_CONFIG[location.pathname] || { title: "Seller Dashboard", icon: "dashboard" };
    const pageTitle = customTitle || currentConfig.title;
    const iconName = customIcon || currentConfig.icon;

    const fetchNotifications = () => {
        setLoading(true);
        getSellerNotifications()
            .then((data) => {
                setNotifications(data || []);
            })
            .catch((err) => {
                console.error("Failed to load notifications:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new low-stock notifications automatically every 10 seconds
        const intervalId = setInterval(() => {
            getSellerNotifications()
                .then((data) => {
                    setNotifications(data || []);
                })
                .catch((err) => console.error("Background notification error:", err));
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleItemClick = async (notif) => {
        if (!notif.read) {
            try {
                await markNotificationAsRead(notif.id);
                setNotifications((prev) =>
                    prev.map((item) => (item.id === notif.id ? { ...item, read: true } : item))
                );
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    return (
        <div className="seller-navbar-divider">
            {/* Page Section Title + Icon on Left */}
            <div className="sn-title-container">
                {iconName && <Icon name={iconName} size={22} />}
                <h1 className="sn-page-title">{pageTitle}</h1>
            </div>

            {/* Right Side: Notification Button + Seller Information */}
            <div className="sn-actions-profile" ref={dropdownRef}>
                <div style={{ position: "relative" }}>
                    <button
                        type="button"
                        className="sn-notify-btn"
                        title="Notifications"
                        onClick={() => {
                            setShowDropdown(!showDropdown);
                            if (!showDropdown) fetchNotifications();
                        }}
                    >
                        <Icon name="bell" size={18} />
                        {unreadCount > 0 && <span className="sn-notify-badge-count">{unreadCount}</span>}
                    </button>

                    {/* Notification Dropdown Box */}
                    {showDropdown && (
                        <div className="sn-dropdown-box">
                            <div className="sn-dropdown-header">
                                <div>
                                    <strong style={{ fontSize: "14px", color: "#111827" }}>Notifications</strong>
                                    <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>
                                        ({notifications.length})
                                    </span>
                                </div>
                                {unreadCount > 0 && (
                                    <button className="sn-mark-read-btn" onClick={handleMarkAllRead}>
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="sn-dropdown-list">
                                {loading ? (
                                    <div className="sn-dropdown-empty">Loading notifications...</div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`sn-dropdown-item ${!notif.read ? "unread" : ""}`}
                                            onClick={() => handleItemClick(notif)}
                                        >
                                            <div className="sn-item-icon">⚠️</div>
                                            <div className="sn-item-content">
                                                <p className="sn-item-message">{notif.message}</p>
                                                <div className="sn-item-meta">
                                                    <span className="sn-item-time">
                                                        {new Date(notif.createdAt).toLocaleString()}
                                                    </span>
                                                    {notif.currentStock !== undefined && (
                                                        <span className="sn-item-stock-tag">
                                                            Stock: {notif.currentStock} / Threshold: {notif.lowStockThreshold}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="sn-dropdown-empty">🎉 No notifications right now!</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

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
