import { useState, useEffect } from "react";
import { catalogApi } from "../api/customerApi";
import { ProductCard } from "../components/customerComponents/product/ProductCard";
import { ProductFilter } from "../components/customerComponents/product/ProductFilter";
import Navbar from "../components/Navbar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [loading, setLoading] = useState(false);

  // Dynamic EAV state
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // 1. Load active categories on initial mount
  useEffect(() => {
    catalogApi
      .getCategories()
      .then((res) => {
        // Direct array extraction or response wrapper check
        const rawData = res.data?.content || res.data || res;
        setCategories(Array.isArray(rawData) ? rawData : []);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // 2. Load dynamic attributes
  useEffect(() => {
    setSelectedAttributes({});

    if (!selectedCategoryId) {
      setAvailableAttributes([]);
      return;
    }

    catalogApi
      .getCategoryAttributes(selectedCategoryId)
      .then((res) => {
        const rawData = res.data?.content || res.data || res;
        setAvailableAttributes(Array.isArray(rawData) ? rawData : []);
      })
      .catch((err) => console.error("Failed to load category attributes", err));
  }, [selectedCategoryId]);

  // 3. Fetch products when static filters OR dynamic EAV selections change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await catalogApi.getProducts({
          search: searchTerm,
          categoryId: selectedCategoryId,
          sort: sortBy,
          ...selectedAttributes,
        });
        setProducts(res.data?.content || res.content || res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategoryId, sortBy, selectedAttributes]);

  const handleAttributeChange = (attrName, value) => {
    setSelectedAttributes((prev) => {
      const updated = { ...prev };
      if (value) {
        updated[attrName] = value;
      } else {
        delete updated[attrName];
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategoryId("");
    setSortBy("id");
    setSelectedAttributes({});
    setAvailableAttributes([]);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategoryId !== "" ||
    sortBy !== "id" ||
    Object.keys(selectedAttributes).length > 0;

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      <style>{`
        .filter-card {
          border: 1px solid rgba(255, 122, 41, 0.15);
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(35, 24, 18, 0.05);
        }

        .custom-input, .custom-select {
          border: 1px solid #f2e7e0;
          border-radius: 10px;
          padding: 0.65rem 1rem;
          color: var(--cart-text, #211a17);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .custom-input:focus, .custom-select:focus {
          border-color: var(--cart-orange, #ff7a29);
          box-shadow: 0 0 0 3px rgba(255, 122, 41, 0.18);
          outline: none;
        }

        .empty-state-card {
          border: 1px dashed rgba(255, 122, 41, 0.3);
          border-radius: 16px;
          background: #fff8f3;
        }

        .reset-btn {
          background-color: transparent;
          border: 1px solid #ff7a29;
          color: #ff7a29;
          border-radius: 10px;
          padding: 0.65rem 1rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          background-color: #ff7a29;
          color: #ffffff;
        }
      `}</style>

      <Navbar />

      <div className="cart-header text-center mb-4">
        <h2 className="fw-bold mb-1">🛍️ Explore Products</h2>
        <p className="mb-0" style={{ opacity: 0.9 }}>
          Discover top-quality items curated just for you
        </p>
      </div>

      <div className="container pb-5">
        {/* Filter Component */}
        <ProductFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          availableAttributes={availableAttributes}
          selectedAttributes={selectedAttributes}
          handleAttributeChange={handleAttributeChange}
          handleResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Product Grid Area */}
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
                key={product.productId || product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-card text-center py-5 px-3">
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <h5
              className="mt-3 fw-bold"
              style={{ color: "var(--cart-text, #211a17)" }}
            >
              No products found
            </h5>
            <p className="text-muted mb-3">
              We couldn't find anything matching your search criteria. Try
              adjusting or resetting your filters.
            </p>
            <button
              className="reset-btn d-inline-block"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
