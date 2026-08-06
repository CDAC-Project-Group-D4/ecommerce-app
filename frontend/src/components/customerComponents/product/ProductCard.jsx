import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        <img 
          src={product.imageUrl || 'https://placehold.co/200'} 
          className="card-img-top p-3" 
          alt={product.name}
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.name}</h5>
          <p className="card-text text-muted mb-1">
            <small>{product.categoryName || product.category}</small>
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold fs-5">₹{product.price}</span>
              <span className="badge bg-warning text-dark">⭐ {product.avgRating || '4.5'}</span>
            </div>
            {/* Click to open Product Detail Page */}
            <Link 
            to={`/products/${product.id}`} 
            state={{ product }} 
            className="btn btn-outline-primary w-100"
          >
            View Details
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};