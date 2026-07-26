import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../css/Cart.css";
function Cart() {
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

    const grandTotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);
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

    return (
        <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
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
                                            onClick={() => setItemToRemove(item)}
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

            {itemToRemove && (
                <div className="cart-dialog-backdrop" role="presentation">
                    <div
                        className="cart-remove-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="remove-dialog-title"
                    >
                        <div className="cart-dialog-icon">♡</div>
                        <h4 id="remove-dialog-title">Remove from cart?</h4>
                        <p>
                            Would you like to save <strong>{itemToRemove.productName}</strong> to
                            your wishlist before removing it?
                        </p>

                        <div className="cart-dialog-actions">
                            <button
                                className="btn cart-dialog-wishlist"
                                disabled={removing}
                                onClick={() => removeSelectedItem(true)}
                            >
                                {removing ? "Please wait..." : "Move to Wishlist"}
                            </button>
                            <button
                                className="btn cart-dialog-remove"
                                disabled={removing}
                                onClick={() => removeSelectedItem(false)}
                            >
                                Remove Only
                            </button>
                            <button
                                className="btn cart-dialog-cancel"
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
