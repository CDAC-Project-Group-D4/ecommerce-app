import { useState, useEffect } from 'react';
import { catalogApi } from '../api/customerApi';
import { ProductCard } from '../components/customerComponents/product/ProductCard';
import Navbar from '../components/Navbar';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // 👈 Changed to Category ID
  const [sortBy, setSortBy] = useState('id'); // Default matching backend default
  const [loading, setLoading] = useState(false);

  // Fetch Categories on Mount
  // Fetch Categories on Mount
useEffect(() => {
  catalogApi.getCategories()
    .then((res) => {
      // Handles: direct array (res), Axios payload (res.data), or Spring Page (res.data.content)
      const categoriesData = Array.isArray(res) 
        ? res 
        : res.data?.content || res.data || [];
        
      setCategories(categoriesData);
      console.log('Loaded Categories:', categoriesData);
    })
    .catch((err) => console.error('Failed to load categories', err));
}, []);

  // Fetch Products whenever Search, CategoryId, or Sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await catalogApi.getProducts({
          search: searchTerm,
          categoryId: selectedCategoryId,
          sort: sortBy,
        });
        
        // Handles Spring Page<ProductCardDTO> response
        setProducts(res.data?.content || res.content || res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategoryId, sortBy]);

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4">Explore Products</h2>

        {/* Filter and Control Bar */}
        <div className="row g-3 mb-4">
          {/* Search Input */}
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="col-md-4">
            <select 
              className="form-select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">All Categories..</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="col-md-3">
            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">Default Sort</option>
              <option value="price">Price: Low to High</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Product List Grid */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center my-4">
            No products found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}