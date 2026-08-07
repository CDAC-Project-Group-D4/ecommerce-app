import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { catalogApi, cartApi } from "../api/customerApi";
import Navbar from "../components/Navbar";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Initial State from Location or null
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // 2. Fetch product details if page is reloaded or accessed directly
  useEffect(() => {
    if (!product) {
      setLoading(true);
      catalogApi
        .getProductById(id)
        .then((res) => {
          setProduct(res.data || res);
        })
        .catch((err) => console.error("Failed to load product details:", err))
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  // Handle Add to Cart action
  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity: Number(quantity),
      });
      alert(
        `Successfully added ${quantity} unit(s) of "${product.name}" to your cart!`,
      );
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Could not add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        <Navbar />
        <div className="text-center my-5 py-5">
          <div
            className="spinner-border"
            style={{ color: "var(--cart-orange, #ff7a29)" }}
            role="status"
          ></div>
          <p className="mt-3 text-muted fw-semibold">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        <Navbar />
        <div className="container my-5">
          <div
            className="p-5 text-center shadow-sm rounded-4"
            style={{
              backgroundColor: "#fff8f3",
              border: "1px dashed rgba(255, 122, 41, 0.3)",
            }}
          >
            <div style={{ fontSize: "3rem" }}>⚠️</div>
            <h4 className="fw-bold mt-2" style={{ color: "#211a17" }}>
              Product not found
            </h4>
            <p className="text-muted mb-4">
              The product you are looking for does not exist or has been
              removed.
            </p>
            <button
              className="btn btn-accent rounded-3 px-4 py-2"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      <Navbar />

      <style>{`
        .product-image-container {
          background: linear-gradient(145deg, #fff8f3, #f3eee9);
          border: 1px solid rgba(255, 122, 41, 0.15);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(35, 24, 18, 0.05);
        }

        .product-detail-card {
          border: 1px solid rgba(255, 122, 41, 0.15);
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(35, 24, 18, 0.05);
        }

        .product-category-badge {
          background-color: #f3f0ee;
          color: var(--cart-muted, #746962);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .product-rating-badge {
          background-color: #fff4eb;
          color: var(--cart-orange-dark, #ff5c00);
          border: 1px solid rgba(255, 122, 41, 0.25);
          font-weight: 600;
        }

        .qty-btn {
          border: 1px solid #f2e7e0;
          background: #fff8f3;
          color: var(--cart-orange-dark, #ff5c00);
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .qty-btn:hover:not(:disabled) {
          background: var(--cart-orange-dark, #ff5c00);
          color: #ffffff;
        }

        .qty-input {
          border-top: 1px solid #f2e7e0;
          border-bottom: 1px solid #f2e7e0;
          border-left: none;
          border-right: none;
          background: #ffffff;
          font-weight: 600;
          color: #211a17;
        }

        .spec-table th {
          background-color: #fff8f3 !important;
          color: #211a17;
          font-weight: 600;
        }
      `}</style>

      <div className="container pb-5 my-4">
        {/* Navigation / Back Button */}
        <button
          className="btn btn-outline-secondary rounded-3 px-3 py-1 mb-4 d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
          style={{ fontSize: "0.9rem" }}
        >
          ← Back
        </button>

        <div className="row g-4">
          {/* Product Image Section */}
          <div className="col-lg-6">
            <div className="product-image-container p-4 text-center">
              <img
                src={
                  product.imageUrl ||
                  product.thumbnailUrl ||
                  "https://placehold.co/400"
                }
                alt={product.name}
                className="img-fluid rounded object-fit-contain"
                style={{ maxHeight: "420px", width: "100%" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400";
                }}
              />
            </div>
          </div>

          {/* Product Information Section */}
          <div className="col-lg-6">
            <div className="product-detail-card p-4 p-md-5 h-100 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge product-category-badge px-3 py-2 rounded-2">
                  {product.categoryName || product.category || "General"}
                </span>
                {product.storeName && (
                  <small className="text-muted fw-semibold">
                    Sold by:{" "}
                    <span style={{ color: "var(--cart-orange-dark, #ff5c00)" }}>
                      {product.storeName}
                    </span>
                  </small>
                )}
              </div>

              <h2 className="fw-bold mb-2" style={{ color: "#211a17" }}>
                {product.name}
              </h2>

              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge product-rating-badge px-2 py-1 rounded-pill">
                  ⭐ {product.avgRating || "4.5"}
                </span>
                {product.reviewCount !== undefined && (
                  <small className="text-muted fw-medium">
                    ({product.reviewCount} reviews)
                  </small>
                )}
              </div>

              <h2
                className="fw-bold my-2"
                style={{ color: "var(--cart-orange-dark, #ff5c00)" }}
              >
                ₹{product.price}
              </h2>

              <hr style={{ borderColor: "#f2e7e0" }} />

              <p className="text-secondary lh-base mb-4">
                {product.description ||
                  "No description available for this product."}
              </p>

              {/* Dynamic Specifications Block */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#211a17" }}>
                    Specifications
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered spec-table mb-0 rounded-3 overflow-hidden">
                      <tbody>
                        {product.specifications.map((spec, idx) => (
                          <tr key={idx}>
                            <th className="w-50 px-3 py-2">
                              {spec.attributeName || spec.key}
                            </th>
                            <td className="px-3 py-2">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Row: Quantity Selector + Add to Cart Button */}
              <div className="mt-auto pt-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="input-group" style={{ width: "130px" }}>
                    <button
                      className="btn qty-btn"
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={addingToCart}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center qty-input"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="btn qty-btn"
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={addingToCart}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-accent btn-lg flex-grow-1 rounded-3 py-2"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    style={{ fontSize: "1rem" }}
                  >
                    {addingToCart ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
