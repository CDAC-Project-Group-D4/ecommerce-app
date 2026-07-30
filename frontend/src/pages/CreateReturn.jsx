import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrder } from "../api/orderApi";
import { createReturnRequest } from "../api/returnApi";
import "../css/Returns.css";

const isWithinReturnWindow = (order) => {
    if (!["DELIVERED", "COMPLETED"].includes(order?.orderStatus)) return false;
    if (!order?.deliveredAt) return false;
    const deadline = new Date(order.deliveredAt);
    deadline.setDate(deadline.getDate() + 7);
    return new Date() <= deadline;
};

function CreateReturn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const orderItemId = searchParams.get("orderItemId");

    const [item, setItem] = useState(null);
    const [requestType, setRequestType] = useState("RETURN");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const verify = async () => {
            if (!orderId || !orderItemId) {
                setError("Order or item information is missing.");
                setLoading(false);
                return;
            }

            try {
                const order = await getOrder(orderId);
                if (!isWithinReturnWindow(order)) {
                    setError("The 7-day return window is closed for this order.");
                    return;
                }

                const matchedItem = order.orderItems.find(
                    (orderItem) => String(orderItem.orderItemId) === String(orderItemId)
                );
                if (!matchedItem) {
                    setError("This item does not belong to the selected order.");
                    return;
                }
                setItem(matchedItem);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to verify return eligibility."
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [orderId, orderItemId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!reason.trim()) return;

        try {
            setSubmitting(true);
            setError("");
            await createReturnRequest({
                orderId: Number(orderId),
                orderItemId: Number(orderItemId),
                requestType,
                reason: reason.trim()
            });
            navigate("/returns", {
                replace: true,
                state: { message: "Return request submitted successfully." }
            });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to submit the return request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="returns-state">Checking return eligibility...</div>;
    }

    if (!item) {
        return (
            <div className="returns-state">
                <h2>Return unavailable</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/orders")}>Back to Orders</button>
            </div>
        );
    }

    return (
        <div className="returns-page">
            <header className="returns-hero">
                <h1>Return or Replace Item</h1>
                <p>Requests must be submitted within 7 days of delivery.</p>
            </header>

            <main className="return-form-card">
                <button className="return-back" onClick={() => navigate(`/orders/${orderId}`)}>
                    ← Back to order
                </button>

                <div className="return-product">
                    <img src={item.productImage} alt={item.productName} />
                    <div>
                        <h3>{item.productName}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <strong>₹{item.lineTotal}</strong>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        What would you like?
                        <select
                            value={requestType}
                            onChange={(event) => setRequestType(event.target.value)}
                        >
                            <option value="RETURN">Return for refund</option>
                            <option value="REPLACE">Replace item</option>
                        </select>
                    </label>

                    <label>
                        Reason
                        <textarea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            rows="5"
                            maxLength="1000"
                            placeholder="Describe the problem with this item"
                            required
                        />
                    </label>

                    <div className="return-form-hint">
                        {requestType === "RETURN"
                            ? "An approved return receives a simulated refund for this item's total."
                            : "An approved replacement does not create a refund."}
                    </div>

                    {error && <div className="return-error" role="alert">{error}</div>}

                    <button
                        type="submit"
                        className="return-primary"
                        disabled={submitting || !reason.trim()}
                    >
                        {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default CreateReturn;
