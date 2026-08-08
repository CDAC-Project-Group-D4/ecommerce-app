import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { catalogApi } from "../api/customerApi";
import { ProductCard } from "../components/customerComponents/product/ProductCard";
import { ProductFilter } from "../components/customerComponents/product/ProductFilter"; // 👈 Import the filter component
import Navbar from "../components/Navbar";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || ""; // Get search string from Navbar redirect

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [loading, setLoading] = useState(false);

  // Dynamic EAV states
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // 1. Load active categories on initial mount[cite: 1]
  useEffect(() => {
    catalogApi
      .getCategories()
      .then((res) => {
        const rawData = res.data?.content || res.data || res;
        setCategories(Array.isArray(rawData) ? rawData : []);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // 2. Load dynamic category attributes[cite: 1]
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

  // SearchResults.jsx
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // 1. Create a baseline filters object
        const payload = {
          search: query?.trim() || undefined,
          categoryId: selectedCategoryId || undefined,
          sort: sortBy === "id" ? undefined : sortBy,
          page: 0,
          size: 10,
        };

        // 2. Loop through dynamic attribute values and strip out empty arrays/selections
        // If selectedAttributes looks like: { Color: ['Red'], RAM: '16GB' }
        Object.entries(selectedAttributes || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            // If your UI uses checkboxes (Array), convert it to comma-separated values for backend mapping
            payload[key] = Array.isArray(value) ? value.join(",") : value;
          }
        });

        // 3. Remove keys that are explicitly undefined before sending to catalogApi
        Object.keys(payload).forEach(
          (key) => payload[key] === undefined && delete payload[key],
        );

        const res = await catalogApi.getProducts(payload);

        // 4. Ensure your state accurately captures your custom Axios instance response schema
        // Spring Data Page responses return data wrapped inside a .content array
        const productList = res.data?.content || res.content || res.data || [];
        setProducts(productList);
      } catch (err) {
        console.error("Failed to query catalog matching parameters:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategoryId, sortBy, selectedAttributes]);

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
    setSelectedCategoryId("");
    setSortBy("id");
    setSelectedAttributes({});
    setAvailableAttributes([]);
    // Clearing search parameters means resetting the URL search query as well
    setSearchParams({});
  };

  const hasActiveFilters =
    query !== "" ||
    selectedCategoryId !== "" ||
    sortBy !== "id" ||
    Object.keys(selectedAttributes).length > 0;

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* CSS Layout variables mirroring Home layout styles[cite: 1] */}
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

      <div className="container py-5">
        <div className="mb-4">
          <h3 className="fw-bold mb-1">
            🔍 Search Results for:{" "}
            <span style={{ color: "#ff5c00" }}>
              "{query || "All Products"}"
            </span>
          </h3>
          <p className="text-muted small">
            Refine your search criteria using the filters below
          </p>
        </div>

        {/* 1. Reuse the application Filter Panel directly[cite: 1] */}
        <ProductFilter
          searchTerm={query}
          setSearchTerm={(val) => setSearchParams({ query: val })} // Updates the URL parameters directly if edited on page
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

        {/* 2. Product Grid Loop Rendering[cite: 1] */}
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "#ff5c00" }}
              role="status"
            />
            <p className="mt-3 text-muted fw-semibold">Filtering items...</p>
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
            <h5 className="mt-3 fw-bold">No items found</h5>
            <p className="text-muted mb-3">
              We couldn't find matches matching your criteria. Try adjusting
              your category sorting or clearing active conditions.
            </p>
            <button
              className="reset-btn d-inline-block"
              onClick={handleResetFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}