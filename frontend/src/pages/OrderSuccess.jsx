import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar"; 

import "../css/OrderSuccess.css";

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
            {/* 👈 Renders Navbar at the top of the Order Success page */}
            <Navbar />

            <div className="success-page">
                <div className="container">
                    <div className="success-card">
                        <div className="success-icon">
                            ✓
                        </div>

                        <h1>
                            Order Placed Successfully!
                        </h1>

                        <p>
                            Thank you for shopping with us.
                        </p>

                        {orderId && (
                            <h5>
                                Order ID : #{orderId}
                            </h5>
                        )}

                        <div className="success-buttons">
                            <Link
                                to="/wishlist"
                                className="btn btn-warning"
                            >
                                View Wishlist
                            </Link>

                            <Link
                                to="/orders"
                                className="btn btn-outline-warning"
                            >
                                My Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;