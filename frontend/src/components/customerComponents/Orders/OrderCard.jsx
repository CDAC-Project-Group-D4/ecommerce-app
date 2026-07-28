import OrderStatusBadge from "./OrderStatusBadge";

function OrderCard({ order, onView }) {

    const firstItem = order.orderItems[0];

    return (

        <div className="card order-card shadow-sm border-0 mb-4">

            <div className="card-body">

                <div className="row align-items-center">

                    <div className="col-md-2 text-center">

                        <img
                            src={firstItem.productImage}
                            alt={firstItem.productName}
                            className="order-image"
                        />

                    </div>

                    <div className="col-md-6">

                        <h5>{firstItem.productName}</h5>

                        <p className="text-muted mb-1">

                            Order #{order.orderId}

                        </p>

                        <p className="text-muted">

                            {new Date(order.placedAt).toLocaleDateString()}

                        </p>

                    </div>

                    <div className="col-md-4 text-md-end">

                        <h4 className="price">

                            ₹{order.totalAmt}

                        </h4>

                        <OrderStatusBadge
                            status={order.orderStatus}
                        />

                        <button
                            className="btn btn-warning mt-3"
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