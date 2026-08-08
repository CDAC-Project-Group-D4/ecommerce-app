import { useState, useEffect } from "react";
import { catalogApi } from "../api/customerApi";
import { ProductCard } from "../components/customerComponents/product/ProductCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all products automatically on initial mount without filters
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const res = await catalogApi.getProducts({}); // Empty query fetches all defaults
        setProducts(res.data?.content || res.content || res.data || []); //
        console.log(res)
      } catch (err) {
        console.error("Error fetching products:", err); //[cite: 1]
      } finally {
        setLoading(false); //[cite: 1]
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      <style>{`
      .empty-state-card {
        border: 1px dashed rgba(255, 122, 41, 0.3);
        border-radius: 16px;
        background: #fff8f3;
      }
      /* Ensure the header container acts as a flush background block */
      .cart-header {
        margin-top: 0 !important; 
      }
    `}</style>

      <Navbar />

      <div className="cart-header text-center pb-5 pt-5 m-0">
        <h2 className="fw-bold m-0 pb-1">🛍️ Explore Products</h2>
        <p className="m-0 pt-1" style={{ opacity: 0.9 }}>
          Discover top-quality items curated just for you
        </p>
      </div>

      <div className="container pb-5">
        {/* Product Grid Area[cite: 1] */}
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "var(--cart-orange, #ff7a29)" }}
              role="status"
            />
            <p className="mt-3 text-muted fw-semibold">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="row g-4">
            {products.map((product) => (
              <ProductCard
                key={product.productId || product.id} //[cite: 1]
                product={product} //[cite: 1]
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-card text-center py-5 px-3">
            <div style={{ fontSize: "3rem" }}>📦</div>
            <h5
              className="mt-3 fw-bold"
              style={{ color: "var(--cart-text, #211a17)" }}
            >
              No products available
            </h5>
            <p className="text-muted mb-0">
              Check back later! We are currently stocking up our catalog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}