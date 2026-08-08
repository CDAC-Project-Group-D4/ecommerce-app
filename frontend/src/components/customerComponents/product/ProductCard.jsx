import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

export const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const BACKEND_URL = "http://localhost:8080";

  const imageSrc =
    product.imageUrl && product.imageUrl.startsWith("/")
      ? `${BACKEND_URL}${product.imageUrl}`
      : product.imageUrl;

  const { handleAddToCart } = useCart();

  const onAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents click from bubbling up to any parent link elements

    setLoading(true);
    try {
      await handleAddToCart(product.productId || product.id, 1);
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
          height: 180px;
        }

        .product-attribute-badge {
          background-color: #ffffff;
          color: #5c524b;
          border: 1px solid #ebdcd0;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 6px;
        }
      `}</style>

      <div className="card cart-item-card product-card-container h-100 border-0 shadow-sm">
        {/* Styled Image Container with Temp Placeholder Fallback */}
        <div className="product-card-img-wrapper position-relative p-3 d-flex align-items-center justify-content-center text-center">
          {imageSrc && !imgError ? (
            <img
              src={imageSrc}
              className="img-fluid"
              alt={product.name}
              onError={() => setImgError(true)}
              style={{ maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <span style={{ fontSize: "4rem" }}>📦</span>
          )}
        </div>

        <div className="card-body d-flex flex-column p-3">
          {/* Title */}
          <h6
            className="fw-bold mb-1 text-truncate"
            title={product.name}
            style={{ color: "var(--cart-text, #211a17)", fontSize: "1rem" }}
          >
            {product.name}
          </h6>

          {/* Description */}
          <p
            className="card-text text-muted small mb-2 text-truncate"
            title={product.description}
          >
            {product.description || "No description available."}
          </p>

          {/* Dynamic EAV Badges Row */}
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
            {/* Price Row */}
            <div className="mb-3">
              <span
                className="fw-bold fs-5"
                style={{ color: "var(--cart-orange-dark, #ff5c00)" }}
              >
                ₹{product.price}
              </span>
            </div>

            {/* Action Buttons Row */}
            <div className="d-flex gap-2">
              <Link
                to={`/products/${product.id}`}
                state={{ product }}
                onClick={(e) => e.stopPropagation()}
                className="btn btn-outline-secondary rounded-3 flex-grow-1 py-2 text-center text-decoration-none"
                style={{ fontSize: "0.875rem" }}
              >
                View
              </Link>

              <button
                onClick={onAddToCartClick}
                disabled={loading}
                className="btn btn-accent rounded-3 flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-semibold"
                style={{
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  cursor: loading ? "not-allowed" : "pointer",
                  background:
                    "var(--cart-gradient, linear-gradient(135deg, #ff9142 0%, #ff5c00 100%))",
                  color: "#ffffff",
                  border: "none",
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