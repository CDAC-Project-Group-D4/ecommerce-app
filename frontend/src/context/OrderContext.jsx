import { createContext, useContext, useState, useCallback } from "react";
import {
    getOrders,
    getOrder,
    cancelOrder,
    cancelOrderItem
} from "../api/orderApi";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const loadOrders = useCallback(async () => {

        try {

            setLoading(true);

            const data = await getOrders();

            setOrders(data);

        } catch {

            setError("Unable to load orders.");

        } finally {

            setLoading(false);

        }

    }, []);

    const loadOrder = async (id) => {

        try {

            setLoading(true);

            const data = await getOrder(id);

            setSelectedOrder(data);

        } catch {

            setError("Unable to load order.");

        } finally {

            setLoading(false);

        }

    };

    const handleCancelOrder = async (id) => {

        try {

            await cancelOrder(id);

            loadOrders();

        } catch {

            setError("Unable to cancel order.");

        }

    };

    const handleCancelOrderItem = async (orderId, orderItemId) => {

        try {

            const updatedOrder = await cancelOrderItem(orderId, orderItemId);

            setSelectedOrder(updatedOrder);
            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.orderId === updatedOrder.orderId ? updatedOrder : order
                )
            );

            return updatedOrder;

        } catch (err) {

            setError("Unable to cancel order item.");
            throw err;

        }

    };

    return (

        <OrderContext.Provider
            value={{
                orders,
                selectedOrder,
                loading,
                error,
                loadOrders,
                loadOrder,
                handleCancelOrder,
                handleCancelOrderItem
            }}
        >

            {children}

        </OrderContext.Provider>

    );

};

export const useOrders = () => useContext(OrderContext);
