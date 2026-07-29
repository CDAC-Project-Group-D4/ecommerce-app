import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReviewForm from "../components/customerComponents/reviews/ReviewForm";
import ReviewHeader from "../components/customerComponents/reviews/ReviewHeader";
import ReviewPageState from "../components/customerComponents/reviews/ReviewPageState";
import { createReview, getMyReviews } from "../api/reviewApi";
import { getOrder } from "../api/orderApi";
import "../css/Review.css";

function AddReview() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [checkingEligibility, setCheckingEligibility] = useState(true);
    const [eligibilityError, setEligibilityError] = useState(null);
    const [verifiedProductName, setVerifiedProductName] = useState("");

    const orderId = searchParams.get("orderId");
    const productId = searchParams.get("productId");
    const productName = searchParams.get("productName");

    useEffect(() => {
        const checkEligibility = async () => {
            if (!orderId || !productId) {
                setEligibilityError({
                    title: "Invalid review link",
                    message: "Order or product information is missing."
                });
                setCheckingEligibility(false);
                return;
            }

            try {
                const [order, reviews] = await Promise.all([
                    getOrder(orderId),
                    getMyReviews()
                ]);

                if (
                    order.orderStatus !== "DELIVERED" &&
                    order.orderStatus !== "COMPLETED"
                ) {
                    setEligibilityError({
                        title: "Review not available yet",
                        message:
                            "You can review this product after the order is delivered."
                    });
                    return;
                }

                const product = order.orderItems.find(
                    (item) => String(item.productId) === String(productId)
                );

                if (!product) {
                    setEligibilityError({
                        title: "Product not found",
                        message: "This product does not belong to this order."
                    });
                    return;
                }

                const alreadyReviewed = reviews.some(
                    (review) =>
                        String(review.orderId) === String(orderId) &&
                        String(review.productId) === String(productId)
                );

                if (alreadyReviewed) {
                    setEligibilityError({
                        title: "Already reviewed",
                        message:
                            "You have already submitted a review for this product."
                    });
                    return;
                }

                setVerifiedProductName(product.productName);
            } catch (requestError) {
                setEligibilityError({
                    title: "Unable to verify order",
                    message:
                        requestError.response?.data?.message ||
                        "Please try again later."
                });
            } finally {
                setCheckingEligibility(false);
            }
        };

        checkEligibility();
    }, [orderId, productId]);

    const submitReview = async ({ rating, comment }) => {
        if (!orderId || !productId) {
            setError("Order or product information is missing.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createReview({
                orderId: Number(orderId),
                productId: Number(productId),
                rating,
                comment
            });

            navigate(`/orders/${orderId}`, {
                replace: true,
                state: { message: "Review submitted successfully." }
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit your review."
            );
        } finally {
            setLoading(false);
        }
    };

    if (checkingEligibility) {
        return <ReviewPageState loading />;
    }

    if (eligibilityError) {
        return (
            <ReviewPageState
                title={eligibilityError.title}
                message={eligibilityError.message}
            />
        );
    }

    return (
        <div className="review-page">
            <main className="review-card">
                <button
                    type="button"
                    className="review-back-btn"
                    onClick={() => navigate("/orders")}
                >
                    ← Back to orders
                </button>

                <ReviewHeader
                    productName={verifiedProductName || productName}
                />
                <ReviewForm
                    loading={loading}
                    error={error}
                    onSubmit={submitReview}
                />
            </main>
        </div>
    );
}

export default AddReview;
