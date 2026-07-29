import { useNavigate } from "react-router-dom";

function WriteReviewButton({ orderId, product }) {
    const navigate = useNavigate();

    const openReviewPage = () => {
        const params = new URLSearchParams({
            orderId: String(orderId),
            productId: String(product.productId),
            productName: product.productName
        });

        navigate(`/reviews/add?${params.toString()}`);
    };

    return (
        <button
            type="button"
            className="write-review-btn"
            onClick={openReviewPage}
        >
            Write Review
        </button>
    );
}

export default WriteReviewButton;
