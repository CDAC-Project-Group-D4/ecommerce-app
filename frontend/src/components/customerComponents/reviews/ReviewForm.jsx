import { useState } from "react";
import StarRating from "./StarRating";

function ReviewForm({ loading, error, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ rating, comment: comment.trim() });
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-rating-section">
                <label>Your Rating</label>
                <StarRating
                    rating={rating}
                    hoverRating={hoverRating}
                    onChange={setRating}
                    onHover={setHoverRating}
                />
                <span className="review-rating-text">
                    {rating > 0
                        ? `${rating} out of 5 stars`
                        : "Select a rating"}
                </span>
            </div>

            <label className="review-comment-label">
                Your Review
                <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="What did you like or dislike about this product?"
                    rows="6"
                    maxLength="1000"
                />
            </label>

            <div className="review-character-count">
                {comment.length}/1000
            </div>

            {error && (
                <div className="review-form-error" role="alert">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="review-submit-btn"
                disabled={loading || rating === 0}
            >
                {loading ? "Submitting Review..." : "Submit Review"}
            </button>
        </form>
    );
}

export default ReviewForm;
