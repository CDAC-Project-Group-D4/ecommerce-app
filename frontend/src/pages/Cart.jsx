import { useEffect } from "react";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        loading,
        error,
        refreshCart,
        handleUpdateQuantity,
        handleRemoveItem,
        handleClearCart,
    } = useCart();

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const grandTotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
            <style>{`
        :root {
          --cart-accent: #FF7A29;
          --cart-accent-dark: #E85D00;
        }
        .cart-header {
          background: linear-gradient(135deg, #FF9142 0%, #FF5C00 100%);
          border-radius: 0 0 24px 24px;
          color: white;
          padding: 2.5rem 0 3rem;
        }
        .cart-item-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s ease;
        }
        .cart-item-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
        }
        .qty-btn {
          border: 1.5px solid var(--cart-accent);
          color: var(--cart-accent-dark);
          background: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          font-weight: 600;
          line-height: 1;
        }
        .qty-btn:hover:not(:disabled) {
          background: var(--cart-accent);
          color: white;
        }
        .qty-btn:disabled {
          opacity: 0.4;
        }
        .btn-accent {
          background: var(--cart-accent);
          border: none;
          color: white;
          font-weight: 600;
        }
        .btn-accent:hover {
          background: var(--cart-accent-dark);
          color: white;
        }
        .summary-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          position: sticky;
          top: 1.5rem;
        }
        .product-thumb {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 12px;
          background: #f2f2f2;
        }
      `}</style>

            {/* Header banner matching Sign In page gradient */}
            <div className="cart-header text-center mb-4">
                <h2 className="fw-bold mb-1">🛒 Your Cart</h2>
                <p className="mb-0" style={{ opacity: 0.9 }}>
                    {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""} ready for checkout` : "Let's find something you love"}
                </p>
            </div>

            <div className="container pb-5">
                {error && (
                    <div className="alert alert-danger rounded-3" role="alert">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: "#FF7A29" }} role="status" />
                        <p className="mt-3 text-muted">Loading your cart...</p>
                    </div>
                )}

                {!loading && cartItems.length === 0 && !error && (
                    <div className="text-center py-5">
                        <div style={{ fontSize: "4rem" }}>🛍️</div>
                        <h4 className="mt-3">Your cart is empty</h4>
                        <p className="text-muted">Browse products and add something you like.</p>
                    </div>
                )}

                {!loading && cartItems.length > 0 && (
                    <div className="row g-4">
                        {/* Cart items */}
                        <div className="col-lg-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="card cart-item-card mb-3">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        {item.productImageUrl ? (
                                            <img
                                                src={item.productImageUrl}
                                                alt={item.productName}
                                                className="product-thumb"
                                            />
                                        ) : (
                                            <div
                                                className="product-thumb d-flex align-items-center justify-content-center text-muted"
                                                style={{ fontSize: "0.7rem" }}
                                            >
                                                No Image
                                            </div>
                                        )}

                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fw-semibold">{item.productName}</h6>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-muted">₹{item.price}</span>
                                                {item.inStock ? (
                                                    <span className="badge rounded-pill" style={{ backgroundColor: "#E6F7EC", color: "#1E7B3B" }}>
                            In Stock
                          </span>
                                                ) : (
                                                    <span className="badge rounded-pill" style={{ backgroundColor: "#FDECEC", color: "#C0392B" }}>
                            Out of Stock
                          </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="qty-btn"
                                                disabled={item.quantity === 1}
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="fw-semibold" style={{ minWidth: "20px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div style={{ minWidth: "90px", textAlign: "right" }}>
                                            <strong>₹{item.lineTotal}</strong>
                                        </div>

                                        <button
                                            className="btn btn-sm btn-outline-danger rounded-3"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                className="btn btn-outline-secondary rounded-3 mt-2"
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Order summary */}
                        <div className="col-lg-4">
                            <div className="card summary-card">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">Order Summary</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Items ({itemCount})</span>
                                        <span>₹{grandTotal.toFixed(2)}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-4">
                                        <strong>Grand Total</strong>
                                        <strong style={{ color: "#FF5C00" }}>₹{grandTotal.toFixed(2)}</strong>
                                    </div>
                                    <button className="btn btn-accent w-100 rounded-3 py-2">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
