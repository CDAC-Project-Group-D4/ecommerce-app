import { useState } from "react";
import { Link } from "react-router-dom";
import { cartApi } from "../../../api/customerApi";

export const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity: 1,
      });
      alert("Product added to cart!");
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      alert("Could not add product to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <style>{`
        .product-card-container {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .product-card-container:hover {
          transform: translateY(-4px);
        }

        .product-card-img-wrapper {
          background: linear-gradient(145deg, #fff8f3, #f3eee9);
          border-bottom: 1px solid rgba(255, 122, 41, 0.1);
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }

        .product-rating-badge {
          background-color: #fff4eb;
          color: var(--cart-orange-dark, #ff5c00);
          border: 1px solid rgba(255, 122, 41, 0.25);
          font-weight: 600;
          font-size: 0.8rem;
        }

        .product-category-badge {
          background-color: #f3f0ee;
          color: var(--cart-muted, #746962);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        /* Added Styling for Dynamic EAV Badges */
        .product-attribute-badge {
          background-color: #ffffff;
          color: #5c524b;
          border: 1px solid #ebdcd0;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 6px;
        }
      `}</style>

      <div className="card cart-item-card product-card-container h-100 border-0">
        {/* Styled Image Container */}
        <div className="product-card-img-wrapper position-relative p-3 text-center">
          <img
            src={product.imageUrl || "https://placehold.co/200"}
            className="img-fluid"
            alt={product.name}
            style={{ height: "180px", objectFit: "contain" }}
          />
        </div>

        <div className="card-body d-flex flex-column p-3">
          {/* Category Tag */}
          <div className="mb-2">
            <span className="badge product-category-badge px-2 py-1 rounded-2">
              {product.categoryName || product.category || "General"}
            </span>
          </div>

          {/* Title */}
          <h6
            className="fw-bold mb-2 text-truncate"
            title={product.name}
            style={{ color: "var(--cart-text, #211a17)", fontSize: "1rem" }}
          >
            {product.name}
          </h6>

          {/* ADDED: Dynamic EAV Badges Row */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mb-3 d-flex flex-wrap gap-1">
              {product.attributes.map((attr, index) => (
                <span
                  key={index}
                  className="badge product-attribute-badge px-2 py-1"
                >
                  <span className="text-muted fw-normal">{attr.name}:</span>{" "}
                  {attr.value}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto">
            {/* Price & Rating Row */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span
                className="fw-bold fs-5"
                style={{ color: "var(--cart-orange-dark, #ff5c00)" }}
              >
                ₹{product.price}
              </span>
              <span className="badge product-rating-badge px-2 py-1 rounded-pill">
                ⭐ {product.avgRating || "4.5"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Link
                to={`/products/${product.id}`}
                state={{ product }}
                className="btn btn-outline-secondary rounded-3 flex-grow-1 py-2 text-center"
                style={{ fontSize: "0.875rem" }}
              >
                View
              </Link>

              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="btn btn-accent rounded-3 flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-semibold"
                style={{
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-bag-plus"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                      />
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
