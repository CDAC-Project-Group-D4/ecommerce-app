import React from "react";

export function ProductFilter({
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,
  sortBy,
  setSortBy,
  categories,
  availableAttributes,
  selectedAttributes,
  handleAttributeChange,
  handleResetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="filter-card p-3 p-md-4 mb-4">
      {/* Search & Main Selectors */}
      <div className="row g-3">
        {/* Search Input */}
        <div className="col-md-5">
          <label className="form-label small fw-semibold text-muted mb-1">
            Search Catalog
          </label>
          <input
            type="text"
            className="form-control custom-input"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="col-md-4">
          <label className="form-label small fw-semibold text-muted mb-1">
            Category
          </label>
          <select
            className="form-select custom-select"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">
            Sort By
          </label>
          <select
            className="form-select custom-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Default Sort</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Dynamic EAV Attributes Section */}
      {availableAttributes.length > 0 && (
        <div className="mt-3 pt-3 border-top">
          <h6 className="fw-bold mb-2 text-muted small text-uppercase">
            Category Filters
          </h6>
          <div className="row g-3">
            {availableAttributes.map((attr) => (
              <div key={attr.name} className="col-md-3 col-sm-6">
                <label className="form-label small fw-semibold text-muted mb-1">
                  {attr.name}
                </label>
                <select
                  className="form-select custom-select"
                  value={selectedAttributes[attr.name] || ""}
                  onChange={(e) =>
                    handleAttributeChange(attr.name, e.target.value)
                  }
                >
                  <option value="">All {attr.name}s</option>
                  {(attr.values || []).map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Filters Bar */}
      {hasActiveFilters && (
        <div className="mt-3 pt-2 d-flex justify-content-end">
          <button className="reset-btn btn-sm" onClick={handleResetFilters}>
            ✕ Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
