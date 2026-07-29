function ReviewHeader({ productName }) {
    return (
        <div className="review-header">
            <div className="review-header-icon">★</div>
            <h1>Write a Review</h1>
            <p>
                Share your experience with{" "}
                <strong>{productName || "this product"}</strong>
            </p>
        </div>
    );
}

export default ReviewHeader;
