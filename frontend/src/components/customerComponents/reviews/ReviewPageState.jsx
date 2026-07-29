import { useNavigate } from "react-router-dom";

function ReviewPageState({ loading, title, message }) {
    const navigate = useNavigate();

    return (
        <div className="review-page">
            <main className="review-state-card">
                {loading ? (
                    <>
                        <div className="review-spinner" />
                        <h2>Checking review eligibility...</h2>
                    </>
                ) : (
                    <>
                        <div className="review-state-icon">!</div>
                        <h2>{title}</h2>
                        <p>{message}</p>
                        <button
                            type="button"
                            className="review-state-btn"
                            onClick={() => navigate("/orders")}
                        >
                            Back to Orders
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}

export default ReviewPageState;
