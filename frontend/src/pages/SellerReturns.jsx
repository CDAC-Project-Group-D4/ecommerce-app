import { useEffect, useState } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import SellerNavbar from "../components/sellerComponents/SellerNavbar";
import { decideSellerReturn, getSellerReturns } from "../api/returnApi";
import "../css/Returns.css";

function SellerReturns() {
    const [returns, setReturns] = useState([]);
    const [notes, setNotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getSellerReturns()
            .then(setReturns)
            .catch((requestError) => setError(
                requestError.response?.data?.message || "Unable to load returns."
            ))
            .finally(() => setLoading(false));
    }, []);

    const decide = async (id, decision) => {
        try {
            setWorkingId(id);
            setError("");
            const updated = await decideSellerReturn(id, decision, notes[id] || "");
            setReturns((current) => current.map(
                (request) => request.returnRequestId === id ? updated : request
            ));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to save decision.");
        } finally {
            setWorkingId(null);
        }
    };

    return (
        <div className="sd-shell">
            <Sidebar />
            <main className="sd-main seller-returns-main">
                <SellerNavbar title="Returns & Refunds" icon="return" />
                <p className="seller-returns-policy">
                    Customer requests shown here passed the 7-day return-window check.
                </p>

                {error && <div className="return-error">{error}</div>}
                {loading && <div className="returns-state">Loading return requests...</div>}

                {!loading && returns.length === 0 && (
                    <div className="returns-empty">
                        <h2>No return requests</h2>
                        <p>New requests for your products will appear here.</p>
                    </div>
                )}

                <div className="seller-return-grid">
                    {returns.map((request) => {
                        const pending = !request.sellerDecision
                            || request.sellerDecision === "PENDING";
                        return (
                            <article className="seller-return-card" key={request.returnRequestId}>
                                <div className="return-card-heading">
                                    <div>
                                        <span>Order #{request.orderId}</span>
                                        <h3>{request.productName}</h3>
                                    </div>
                                    <span className="return-status">
                                        {pending ? "PENDING" : request.sellerDecision}
                                    </span>
                                </div>
                                <p>Customer: {request.customerName}</p>
                                <p><strong>{request.requestType}</strong> · {request.reason}</p>
                                {request.imageUrls?.length > 0 && (
                                    <div className="return-evidence-gallery">
                                        {request.imageUrls.map((imageUrl, index) => (
                                            <a href={`http://localhost:8080${imageUrl}`} target="_blank" rel="noreferrer" key={imageUrl}>
                                                <img src={`http://localhost:8080${imageUrl}`} alt={`Customer evidence ${index + 1}`} />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {pending ? (
                                    <>
                                        <textarea
                                            rows="3"
                                            placeholder="Notes for the customer (optional)"
                                            value={notes[request.returnRequestId] || ""}
                                            onChange={(event) => setNotes((current) => ({
                                                ...current,
                                                [request.returnRequestId]: event.target.value
                                            }))}
                                        />
                                        <div className="seller-return-actions">
                                            <button
                                                className="return-approve"
                                                disabled={workingId === request.returnRequestId}
                                                onClick={() => decide(request.returnRequestId, "APPROVED")}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="return-reject"
                                                disabled={workingId === request.returnRequestId}
                                                onClick={() => decide(request.returnRequestId, "REJECTED")}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="return-decision">
                                        {request.sellerNotes || "Decision submitted."}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default SellerReturns;
