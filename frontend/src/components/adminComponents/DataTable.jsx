import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

/**
 * Reusable Data Table Component
 *
 * @param {Array} columns - Config array: [{ header: 'Name', accessor: 'name' }, { header: 'Actions', render: (row) => <button/> }]
 * @param {Array} data - Raw array of objects to display
 * @param {boolean} isLoading - Spinner state
 * @param {string} searchPlaceholder - Placeholder for the search input
 * @param {boolean} searchable - Show/hide search bar
 * @param {number} defaultPageSize - Default rows per page
 */
const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchable = true,
  defaultPageSize = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 1. Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '').toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  // Reset to page 1 if user searches
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 2. Pagination Math
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, startIndex, pageSize]);

  return (
    <div className="card shadow-sm border-0">
      {/* Top Header / Search Bar */}
      {searchable && (
        <div className="card-header bg-white py-3 border-bottom-0">
          <div className="row align-items-center g-2">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 text-md-end text-muted small">
              Showing {totalItems === 0 ? 0 : startIndex + 1} to{' '}
              {Math.min(startIndex + pageSize, totalItems)} of {totalItems} entries
            </div>
          </div>
        </div>
      )}

      {/* Table Body */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    style={col.style || {}}
                    className={col.className || ''}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-5 text-muted">
                    <Inbox size={36} className="mb-2 opacity-50" />
                    <p className="mb-0">No records found</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={row.id || row.userId || row.orderId || rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={col.cellClassName || ''}>
                        {col.render
                          ? col.render(row, rowIndex)
                          : row[col.accessor] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination Controls */}
      {totalPages > 1 && (
        <div className="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
          {/* Page size select */}
          <div className="d-flex align-items-center gap-2 text-muted small">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: '70px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
              <span className="d-none d-sm-inline">Previous</span>
            </button>

            <span className="text-muted small px-2">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <span className="d-none d-sm-inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;