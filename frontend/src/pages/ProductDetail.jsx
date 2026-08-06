import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // 👈 FIX HERE// or 'react-router-dom' depending on your router setup
import { catalogApi } from '../api/customerApi'; // import your API service

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();

  // 1. First, check if product data was passed via navigation state
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);

  // 2. Fallback: Fetch product by ID if refreshed or opened directly via URL
  useEffect(() => {
    if (!product) {
      setLoading(true);
      catalogApi.getProductById(id)
        .then((res) => {
          setProduct(res.data || res);
        })
        .catch((err) => console.error('Failed to load product details:', err))
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  useEffect(() => {
  console.log("Current Product Object:", product);
}, [product]);
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="alert alert-danger text-center my-5">Product not found.</div>;
  }

  return (

    <div className="container my-5">
      <div className="row g-4">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.imageUrl || "https://placehold.co/400"}
            alt={product.name}
            className="img-fluid rounded shadow-sm w-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400";
            }}
          />
        </div>

        {/* Product Information */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4 className="text-primary my-3">₹{product.price}</h4>
          <p className="text-muted">{product.description || "No description available."}</p>
          
          <button className="btn btn-success btn-lg mt-3">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}