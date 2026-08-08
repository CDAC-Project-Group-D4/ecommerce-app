import { useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import "../css/Wishlist.css";

function Wishlist() {
  const {
    wishlistItems,
    loading,
    error,
    refreshWishlist,
    handleRemoveItem,
    handleMoveToCart,
  } = useWishlist();

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* 👈 Render the Navbar component here at the top of the page */}
      <Navbar />

      <div className="wishlist-header text-center mb-4 py-4">
        <h2 className="fw-bold mb-1">♥ Your Wishlist</h2>
        <p className="mb-0" style={{ opacity: 0.9 }}>
          {wishlistItems.length > 0
            ? `${wishlistItems.length} item${wishlistItems.length > 1 ? "s" : ""} saved for later`
            : "Save items you love here"}
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
            <div
              className="spinner-border"
              style={{ color: "#FF7A29" }}
              role="status"
            />
            <p className="mt-3 text-muted">Loading your wishlist...</p>
          </div>
        )}

        {!loading && wishlistItems.length === 0 && !error && (
          <div className="text-center py-5">
            <div className="wishlist-empty-icon">♡</div>
            <h4 className="mt-3">Your wishlist is empty</h4>
            <p className="text-muted">
              Tap the heart icon on a product to save it here.
            </p>
          </div>
        )}

        {!loading && wishlistItems.length > 0 && (
          <div className="row g-3">
            {wishlistItems.map((item) => (
              <div key={item.id} className="col-12">
                <div className="card wishlist-item-card">
                  <div className="card-body d-flex align-items-center gap-3">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="product-thumb"
                      />
                    ) : (
                      <div className="product-thumb-placeholder">No Image</div>
                    )}

                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{item.productName}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <span className="wishlist-price">₹{item.price}</span>
                        {item.inStock ? (
                          <span className="badge rounded-pill badge-in-stock">
                            In Stock
                          </span>
                        ) : (
                          <span className="badge rounded-pill badge-out-stock">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className="btn btn-wishlist-accent rounded-3"
                      disabled={!item.inStock}
                      onClick={() => handleMoveToCart(item.id)}
                    >
                      Move to Cart
                    </button>

                    <button
                      className="btn btn-wishlist-remove btn-sm rounded-3"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;