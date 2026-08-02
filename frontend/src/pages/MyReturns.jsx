import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyReturns } from "../api/returnApi";
import "../css/Returns.css";

const getStatus = (request) => {
    if (request.adminDecision) return `Admin ${request.adminDecision}`;
    if (request.sellerDecision === "REJECTED") return "Under Admin Review";
    if (request.sellerDecision === "APPROVED") {
        return request.requestType === "RETURN"
            ? `Refund ${request.refundStatus}`
            : "Replacement Approved";
    }
    return "Pending Seller Review";
};

function MyReturns() {
    const navigate = useNavigate();
    const location = useLocation();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getMyReturns()
            .then(setReturns)
            .catch((requestError) => setError(
                requestError.response?.data?.message || "Unable to load returns."
            ))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="returns-page">
            <header className="returns-hero">
                <h1>My Returns</h1>
                <p>Track return, replacement, and refund decisions.</p>
            </header>

            <main className="returns-list">
                <button className="return-back" onClick={() => navigate("/orders")}>
                    ← Back to orders
                </button>

                {location.state?.message && (
                    <div className="return-success">{location.state.message}</div>
                )}
                {error && <div className="return-error">{error}</div>}
                {loading && <div className="returns-state">Loading returns...</div>}

                {!loading && !error && returns.length === 0 && (
                    <div className="returns-empty">
                        <h2>No return requests</h2>
                        <p>Your return and replacement requests will appear here.</p>
                    </div>
                )}

                {returns.map((request) => (
                    <article className="return-card" key={request.returnRequestId}>
                        <img src={request.productImage} alt={request.productName || "Order item"} />
                        <div className="return-card-main">
                            <div className="return-card-heading">
                                <div>
                                    <span>Order #{request.orderId}</span>
                                    <h3>{request.productName || "Full order request"}</h3>
                                </div>
                                <span className="return-status">{getStatus(request)}</span>
                            </div>
                            <p><strong>{request.requestType}</strong> · {request.reason}</p>
                            {request.imageUrls?.length > 0 && (
                                <div className="return-evidence-gallery">
                                    {request.imageUrls.map((imageUrl, index) => (
                                        <a href={`http://localhost:8080${imageUrl}`} target="_blank" rel="noreferrer" key={imageUrl}>
                                            <img src={`http://localhost:8080${imageUrl}`} alt={`Return evidence ${index + 1}`} />
                                        </a>
                                    ))}
                                </div>
                            )}
                            {request.sellerNotes && <p>Seller: {request.sellerNotes}</p>}
                            {request.adminNotes && <p>Admin: {request.adminNotes}</p>}
                            {request.refundAmount && (
                                <div className="refund-box">
                                    Refund: ₹{request.refundAmount}
                                    {request.refundReference && ` · ${request.refundReference}`}
                                </div>
                            )}
                            <small>
                                Requested {new Date(request.requestedAt).toLocaleString()}
                            </small>
                        </div>
                    </article>
                ))}
            </main>
        </div>
    );
}

export default MyReturns;
