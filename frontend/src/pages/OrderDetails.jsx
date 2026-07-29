import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import WriteReviewButton from "../components/customerComponents/reviews/WriteReviewButton";
import { getMyReviews } from "../api/reviewApi";

import "../css/OrderDetails.css";

function OrderDetails() {

    const { orderId } = useParams();

    const navigate = useNavigate();
    const [myReviews, setMyReviews] = useState([]);

    const {
        selectedOrder,
        loading,
        error,
        loadOrder,
        handleCancelOrder
    } = useOrders();

    useEffect(() => {

        loadOrder(orderId);

    }, [orderId]);

    useEffect(() => {
        getMyReviews()
            .then(setMyReviews)
            .catch(() => setMyReviews([]));
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

                                            <h5>

                                                ₹{item.lineTotal}

                                            </h5>

                                            {
                                                (
                                                    order.orderStatus === "DELIVERED" ||
                                                    order.orderStatus === "COMPLETED"
                                                ) &&
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

                                        {order.orderStatus}

                                    </strong>

                                </div>

                                <div className="d-flex justify-content-between mb-2">

                                    <span>Payment</span>

                                    <strong>

                                        {order.paymentMethod}

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

                                {

                                    order.orderStatus !== "SHIPPED"

                                    &&

                                    order.orderStatus !== "DELIVERED"

                                    &&

                                    order.orderStatus !== "COMPLETED"

                                    &&

                                    order.orderStatus !== "CANCELLED"

                                    &&

                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={async () => {

                                            await handleCancelOrder(order.orderId);

                                            navigate("/orders");

                                        }}
                                    >

                                        Cancel Order

                                    </button>

                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default OrderDetails;
