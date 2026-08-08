import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Cart.css";

// Update this to your actual backend base URL if your server serves images dynamically
const BACKEND_URL = "http://localhost:8080";

function Cart() {
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const {
    cartItems,
    loading,
    error,
    refreshCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCart();
  const { handleAddToWishlist } = useWishlist();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const grandTotal = cartItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const removeSelectedItem = async (moveToWishlist) => {
    if (!itemToRemove || removing) return;

    setRemoving(true);

    if (moveToWishlist) {
      const added = await handleAddToWishlist(itemToRemove.productId);
      if (!added) {
        setRemoving(false);
        return;
      }
    }

    const removed = await handleRemoveItem(itemToRemove.id);
    setRemoving(false);

    if (removed) {
      setItemToRemove(null);
    }
  };

  // Helper to format/resolve dynamic product image URLs
  const getImageUrl = (rawUrl) => {
    if (!rawUrl) return "https://placehold.co/100";
    if (rawUrl.startsWith("/")) {
      return `${BACKEND_URL}${rawUrl}`;
    }
    return rawUrl;
  };

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* Integrated global navigation component */}
      <Navbar />

      {/* --- Cart Content Header Section --- */}
      <div
        className="cart-header text-center py-4 mb-4"
        style={{ backgroundColor: "#fff", borderBottom: "1px solid #eef0f2" }}
      >
        <h2 className="fw-bold mb-1" style={{ color: "#211a17" }}>
          Your Cart
        </h2>
        <p className="mb-0 text-muted fw-medium">
          {itemCount > 0
            ? `${itemCount} item${itemCount > 1 ? "s" : ""} ready for checkout`
            : "Let's find something you love"}
        </p>
      </div>

      {/* --- Dynamic Data Workspace Content --- */}
      <div className="container pb-5">
        {error && (
          <div
            className="alert alert-danger rounded-3 shadow-sm border-0 px-4 py-3"
            role="alert"
          >
            <span className="fw-semibold me-2">⚠️ Error:</span> {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-5 my-5">
            <div
              className="spinner-border"
              style={{ color: "#FF7A29", width: "3rem", height: "3rem" }}
              role="status"
            />
            <p className="mt-3 text-muted fw-semibold">
              Loading your cart items...
            </p>
          </div>
        )}

        {!loading && cartItems.length === 0 && !error && (
          <div className="text-center py-5 my-5 border rounded-4 bg-white shadow-sm px-4">
            <div style={{ fontSize: "4.5rem" }} className="mb-3">
              🛍️
            </div>
            <h4 className="fw-bold text-dark mb-2">Your cart is empty</h4>
            <p className="text-muted mb-4 max-width-md mx-auto">
              Browse our latest collection elements and stack them right into
              your selection profile whenever ready.
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary px-4 py-2 rounded-3 fw-semibold shadow-sm"
              style={{ backgroundColor: "#FF7A29", borderColor: "#FF7A29" }}
            >
              Explore Products
            </button>
          </div>
        )}

        {!loading && cartItems.length > 0 && (
          <div className="row g-4">
            {/* Cart items collection column */}
            <div className="col-lg-8">
              {cartItems.map((item) => {
                const rawUrl =
                  item.productImageUrl ||
                  item.imageUrl ||
                  item.image_url ||
                  item.thumbnailUrl;
                const imageSrc = getImageUrl(rawUrl);

                return (
                  <div
                    key={item.id}
                    className="card cart-item-card mb-3 border-0 shadow-sm rounded-4 overflow-hidden"
                  >
                    <div className="card-body d-flex align-items-center gap-3 p-3 bg-white">
                      <img
                        src={imageSrc}
                        alt={item.productName || "Product"}
                        className="product-thumb rounded-3 border"
                        style={{
                          width: "85px",
                          height: "85px",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100";
                        }}
                      />

                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold text-dark">
                          {item.productName}
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-dark fw-semibold">
                            ₹{item.price}
                          </span>
                          {item.inStock ? (
                            <span
                              className="badge rounded-pill fw-bold"
                              style={{
                                backgroundColor: "#E6F7EC",
                                color: "#1E7B3B",
                                fontSize: "0.7rem",
                              }}
                            >
                              In Stock
                            </span>
                          ) : (
                            <span
                              className="badge rounded-pill fw-bold"
                              style={{
                                backgroundColor: "#FDECEC",
                                color: "#C0392B",
                                fontSize: "0.7rem",
                              }}
                            >
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded-3 border">
                        <button
                          className="qty-btn btn p-0 border-0 fw-bold fs-5 d-flex align-items-center justify-content-center"
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#6c757d",
                          }}
                          onClick={() => {
                            if (item.quantity === 1) {
                              setItemToRemove(item);
                            } else {
                              handleUpdateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                        >
                          −
                        </button>
                        <span
                          className="fw-bold text-dark"
                          style={{
                            minWidth: "24px",
                            textAlign: "center",
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn btn p-0 border-0 fw-bold fs-5 d-flex align-items-center justify-content-center"
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#6c757d",
                          }}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <div
                        style={{ minWidth: "100px", textAlign: "right" }}
                        className="px-2"
                      >
                        <strong className="fs-6 text-dark">
                          ₹{item.lineTotal.toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-danger border-0 rounded-3 px-3 py-2 fw-medium"
                        onClick={() => setItemToRemove(item)}
                        style={{ transition: "all 0.2s" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                className="btn btn-outline-secondary border-dashed rounded-3 mt-2 fw-semibold px-4 py-2 bg-white"
                onClick={handleClearCart}
              >
                Clear Shopping Cart
              </button>
            </div>

            {/* Order payment details summary card */}
            <div className="col-lg-4">
              <div className="card summary-card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">
                    Order Summary
                  </h5>
                  <div className="d-flex justify-content-between mb-3 fw-medium">
                    <span className="text-muted">
                      Items Quantity ({itemCount})
                    </span>
                    <span className="text-dark">
                      ₹
                      {grandTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 fw-medium">
                    <span className="text-muted">Shipping Charges</span>
                    <span className="text-success fw-semibold">FREE</span>
                  </div>
                  <hr className="text-muted opacity-25 my-3" />
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <strong className="fs-6 text-dark">Grand Total</strong>
                    <strong className="fs-4" style={{ color: "#FF5C00" }}>
                      ₹
                      {grandTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                  <button
                    className="btn w-100 rounded-3 py-3 fw-bold shadow-sm text-white border-0"
                    style={{
                      backgroundColor: "#FF7A29",
                      backgroundImage:
                        "linear-gradient(135deg, #FF7A29 0%, #FF5C00 100%)",
                    }}
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Wishlist Promotion Context Action Modal --- */}
      {itemToRemove && (
        <div
          className="cart-dialog-backdrop d-flex justify-content-center align-items-center"
          role="presentation"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1060,
          }}
        >
          <div
            className="cart-remove-dialog bg-white p-4 rounded-4 shadow border text-center max-width-sm position-relative mx-3"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-dialog-title"
            style={{ maxWidth: "420px" }}
          >
            <div
              className="cart-dialog-icon mb-2 fs-1"
              style={{ color: "#FF7A29" }}
            >
              ♡
            </div>
            <h4 id="remove-dialog-title" className="fw-bold mb-2">
              Remove from cart?
            </h4>
            <p className="text-muted px-2 mb-4">
              Would you like to save <strong>{itemToRemove.productName}</strong>{" "}
              to your wishlist before removing it?
            </p>

            <div className="cart-dialog-actions d-flex flex-column gap-2">
              <button
                className="btn text-white w-100 py-2 rounded-3 fw-semibold border-0"
                style={{ backgroundColor: "#FF7A29" }}
                disabled={removing}
                onClick={() => removeSelectedItem(true)}
              >
                {removing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving Changes...
                  </>
                ) : (
                  "Move to Wishlist"
                )}
              </button>
              <button
                className="btn btn-outline-danger w-100 py-2 rounded-3 fw-semibold"
                disabled={removing}
                onClick={() => removeSelectedItem(false)}
              >
                Remove Only
              </button>
              <button
                className="btn btn-link text-decoration-none text-secondary w-100 pt-2 fw-medium"
                disabled={removing}
                onClick={() => setItemToRemove(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;