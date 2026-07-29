function StarRating({ rating, hoverRating, onChange, onHover }) {
    return (
        <div className="star-rating" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    className={
                        star <= (hoverRating || rating)
                            ? "review-star active"
                            : "review-star"
                    }
                    onClick={() => onChange(star)}
                    onMouseEnter={() => onHover(star)}
                    onMouseLeave={() => onHover(0)}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export default StarRating;
