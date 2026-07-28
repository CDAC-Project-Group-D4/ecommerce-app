import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useOrders } from "../context/OrderContext";

import OrderCard from "../components/customerComponents/Orders/OrderCard";
import EmptyOrders from "../components/customerComponents/orders/EmptyOrders";

import "../css/Orders.css";

function Orders() {

    const navigate = useNavigate();

    const {
        orders,
        loading,
        error,
        loadOrders
    } = useOrders();

    useEffect(() => {

        loadOrders();

    }, [loadOrders]);

    if (loading) {

        return (
            <div className="orders-loading">
                <h2>Loading Orders...</h2>
            </div>
        );

    }

    return (

        <div className="orders-page">

            <div className="orders-header">

                <h2>📦 My Orders</h2>

                <p>

                    View and track all your orders

                </p>

            </div>

            {

                error &&

                <div className="orders-error">

                    {error}

                </div>

            }

            {

                orders.length === 0 ?

                    <EmptyOrders />

                    :

                    <div className="orders-list">

                        {

                            orders.map(order => (

                                <OrderCard

                                    key={order.orderId}

                                    order={order}

                                    onView={() =>
                                        navigate(`/orders/${order.orderId}`)
                                    }

                                />

                            ))

                        }

                    </div>

            }

        </div>

    );

}

export default Orders;