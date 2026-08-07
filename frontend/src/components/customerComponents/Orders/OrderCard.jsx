import OrderStatusBadge from "./OrderStatusBadge";

function OrderCard({ order, onView }) {
    const totalItems = order.orderItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <div className="card order-card shadow-sm border-0 mb-4">
            <div className="card-body">
                <div className="order-card-header">
                    <div>
                        <h5>Order #{order.orderId}</h5>
                        <p className="text-muted mb-0">
                            Placed on{" "}
                            {new Date(order.placedAt).toLocaleDateString()}
                        </p>
                    </div>

                    <OrderStatusBadge status={order.orderStatus} />
                </div>

                <hr />

                <div className="order-products">
                    {order.orderItems.map((item) => (
                        <div
                            className="order-product-item"
                            key={item.orderItemId}
                        >
                            <img
                                src={item.productImage}
                                alt={item.productName}
                                className="order-image"
                            />

                            <div className="order-product-info">
                                <h5>{item.productName}</h5>
                                <p className="text-muted mb-0">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>

                            <div className="d-flex flex-column align-items-end gap-2">
                                <OrderStatusBadge
                                    status={item.itemStatus || order.orderStatus}
                                />
                                <strong className="order-line-total">
                                    ₹{item.lineTotal}
                                </strong>
                            </div>
                        </div>
                    ))}
                </div>

                <hr />

                <div className="order-card-footer">
                    <span className="text-muted">
                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </span>

                    <div className="order-footer-actions">
                        <h4 className="price mb-0">₹{order.totalAmt}</h4>

                        <button
                            className="btn btn-warning"
                            onClick={onView}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderCard;
