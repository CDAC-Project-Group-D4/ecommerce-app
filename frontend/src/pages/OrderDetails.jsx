import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import WriteReviewButton from "../components/customerComponents/reviews/WriteReviewButton";
import OrderStatusBadge from "../components/customerComponents/Orders/OrderStatusBadge";
import { getMyReviews } from "../api/reviewApi";
import { getMyReturns } from "../api/returnApi";

import "../css/OrderDetails.css";
import "../css/Returns.css";

function OrderDetails() {

    const { orderId } = useParams();

    const navigate = useNavigate();
    const location = useLocation();
    const [myReviews, setMyReviews] = useState([]);
    const [myReturns, setMyReturns] = useState([]);
    const [cancellingItemId, setCancellingItemId] = useState(null);

    const {
        selectedOrder,
        loading,
        loadOrder,
        handleCancelOrderItem
    } = useOrders();

    useEffect(() => {

        loadOrder(orderId);

    }, [orderId]);

    useEffect(() => {
        Promise.allSettled([getMyReviews(), getMyReturns()])
            .then(([reviewsResult, returnsResult]) => {
                setMyReviews(
                    reviewsResult.status === "fulfilled" ? reviewsResult.value : []
                );
                setMyReturns(
                    returnsResult.status === "fulfilled" ? returnsResult.value : []
                );
            });
    }, []);

    if (loading) {

        return (
            <div className="text-center mt-5">
                <h3>Loading Order...</h3>
            </div>
        );

    }

    if (!selectedOrder) {

        return (
            <div className="text-center mt-5">
                <h3>Order Not Found</h3>
            </div>
        );

    }

    const order = selectedOrder;
    const isItemDelivered = (item) =>
        ["DELIVERED", "COMPLETED"].includes(item.itemStatus?.toUpperCase());
    const isItemReturnWindowOpen = (item) => {
        if (!isItemDelivered(item) || !item.deliveredAt) {
            return false;
        }

        const deadline = new Date(
            new Date(item.deliveredAt).getTime() + 7 * 24 * 60 * 60 * 1000
        );
        return new Date() <= deadline;
    };

    const cancelItem = async (orderItemId) => {
        if (!window.confirm("Are you sure you want to cancel this item?")) {
            return;
        }

        setCancellingItemId(orderItemId);
        try {
            await handleCancelOrderItem(order.orderId, orderItemId);
        } catch (err) {
            alert(err?.response?.data?.message || "Could not cancel the item. Please try again.");
        } finally {
            setCancellingItemId(null);
        }
    };

    return (

        <div className="order-details-page">

            {/* Header */}

            <div className="order-details-header">

                <h2>📦 Order Details</h2>

                <p>

                    Order #{order.orderId}

                </p>

            </div>

            <div className="container py-4">

                {location.state?.message && (
                    <div className="alert alert-success" role="status">
                        {location.state.message}
                    </div>
                )}

                <div className="d-flex justify-content-end mb-3">
                    <button
                        type="button"
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/returns")}
                    >
                        My Returns
                    </button>
                </div>

                <div className="row g-4 justify-content-center">

                    {/* Left Side */}

                    <div className="col-lg-8">

                        {/* Products */}

                        <div className="card shadow-sm border-0 mb-4">

                            <div className="card-body">

                                <h4 className="mb-4">

                                    Ordered Products

                                </h4>

                                {

                                    order.orderItems.map(item => (

                                        <div
                                            key={item.orderItemId}
                                            className="product-row"
                                        >

                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="product-image"
                                            />

                                            <div className="flex-grow-1">

                                                <h5>

                                                    {item.productName}

                                                </h5>

                                                <p>

                                                    Qty : {item.quantity}

                                                </p>

                                            </div>

                                            <div className="order-item-controls">
                                                <div className="d-flex flex-column align-items-end gap-2">
                                                    <OrderStatusBadge
                                                        status={item.itemStatus || order.orderStatus}
                                                    />
                                                    <h5>

                                                        ₹{item.lineTotal}

                                                    </h5>
                                                </div>

                                                <div className="return-item-actions">
                                                {["PENDING", "PLACED", "CONFIRMED"].includes(
                                                    (item.itemStatus || order.orderStatus)?.toUpperCase()
                                                ) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => cancelItem(item.orderItemId)}
                                                        disabled={cancellingItemId === item.orderItemId}
                                                    >
                                                        {cancellingItemId === item.orderItemId
                                                            ? "Cancelling..."
                                                            : "Cancel Item"}
                                                    </button>
                                                )}
                                                {
                                                    isItemDelivered(item) &&
                                                    (
                                                        myReviews.some(
                                                            (review) =>
                                                                review.orderId === order.orderId &&
                                                                review.productId === item.productId
                                                        )
                                                            ?
                                                            <span className="reviewed-badge">
                                                                ✓ Reviewed
                                                            </span>
                                                            :
                                                            <WriteReviewButton
                                                                orderId={order.orderId}
                                                                product={item}
                                                            />
                                                    )
                                                }

                                                {
                                                    isItemDelivered(item) &&
                                                    (
                                                        myReturns.some(
                                                            (request) =>
                                                                String(request.orderItemId) ===
                                                                String(item.orderItemId)
                                                        )
                                                            ?
                                                            <span className="return-requested-badge">
                                                                Return requested
                                                            </span>
                                                            :
                                                            isItemReturnWindowOpen(item)
                                                                ?
                                                                <button
                                                                    type="button"
                                                                    className="return-request-btn"
                                                                    onClick={() => navigate(
                                                                        `/returns/new?orderId=${order.orderId}&orderItemId=${item.orderItemId}`
                                                                    )}
                                                                >
                                                                    Return / Replace
                                                                </button>
                                                                :
                                                                <span className="return-window-closed">
                                                                    Return window closed
                                                                </span>
                                                    )
                                                }
                                                </div>
                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        </div>

                        {/* Address */}

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h4>

                                    Delivery Address

                                </h4>

                                <hr />

                                <h5>

                                    {order.address.fullName}

                                </h5>

                                <p>

                                    {order.address.mobileNumber}

                                </p>

                                <p>

                                    {order.address.addressLine1}

                                    <br />

                                    {order.address.addressLine2}

                                    <br />

                                    {order.address.city},

                                    {order.address.state}

                                    -

                                    {order.address.pincode}

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div className="col-lg-4">

                        <div className="card shadow-sm border-0 sticky-top">

                            <div className="card-body">

                                <h4>

                                    Order Summary

                                </h4>

                                <hr />

                                <div className="d-flex justify-content-between mb-2">

                                    <span>Status</span>

                                    <strong>

                                        {order.orderStatus.replaceAll("_", " ")}

                                    </strong>

                                </div>

                                <div className="d-flex justify-content-between mb-2">

                                    <span>Payment</span>

                                    <strong>

                                        {order.paymentMethod.replaceAll("_", " ")}

                                    </strong>

                                </div>

                                <div className="d-flex justify-content-between mb-2">

                                    <span>Total</span>

                                    <strong>

                                        ₹{order.totalAmt}

                                    </strong>

                                </div>

                                <div className="d-flex justify-content-between mb-4">

                                    <span>Placed On</span>

                                    <strong>

                                        {new Date(order.placedAt).toLocaleDateString()}

                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default OrderDetails;
