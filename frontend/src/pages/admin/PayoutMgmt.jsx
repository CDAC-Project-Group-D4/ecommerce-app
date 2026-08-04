import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";

export default function PayoutMgmt() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination States
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal & Processing States
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Payouts whenever page or statusFilter changes
  useEffect(() => {
    fetchPayouts();
  }, [page, statusFilter]);

  const fetchPayouts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Map UI filter to backend PaymentStatus Enum or null
      const statusParam = statusFilter === "All" ? null : statusFilter.toUpperCase();

      const response = await adminApi.getPayouts(statusParam, page, size);

      if (response && response.data) {
        const rawData = response.data;

        // Handle Spring Boot Page<SellerPayout> response (.content) or plain array
        const payoutList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.content)
          ? rawData.content
          : [];

        setPayouts(payoutList);
        setTotalPages(rawData?.totalPages || 1);
      } else {
        setPayouts([]);
      }
    } catch (err) {
      console.error("Error fetching payouts:", err);
      setError(
        err.response?.data?.message || "Failed to load payout requests."
      );
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  // Release Payout Handler
  const handleReleasePayout = async (sellerId) => {
    setIsProcessing(true);
    try {
      const response = await adminApi.releasePayout(sellerId);

      // Local state update upon success
      setPayouts((prev) =>
        prev.map((p) => {
          const targetSellerId = p.sellerId || p.seller?.id || p.vendorId;
          return targetSellerId === sellerId
            ? {
                ...p,
                status: "COMPLETED",
                releasedAt: new Date().toISOString(),
              }
            : p;
        })
      );

      alert(
        response.data?.message ||
          `Payout released successfully for seller ID: ${sellerId}`
      );
      setSelectedPayout(null);
    } catch (err) {
      console.error("Failed to release payout:", err);
      alert(
        `Payout Release Failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const safePayouts = Array.isArray(payouts) ? payouts : [];

  // Local Search Filter
  const filteredPayouts = safePayouts.filter((item) => {
    const vendorName = item.sellerName || item.seller?.name || item.vendorName || "";
    const id = String(item.id || item._id || "");
    const sellerId = String(item.sellerId || item.seller?.id || item.vendorId || "");

    const matchesSearch =
      vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sellerId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate Summary KPI Stats
  const stats = {
    pendingAmount: safePayouts
      .filter((p) => String(p.status).toUpperCase() === "PENDING")
      .reduce((acc, p) => acc + Number(p.amount || 0), 0),
    pendingCount: safePayouts.filter(
      (p) => String(p.status).toUpperCase() === "PENDING"
    ).length,
    completedAmount: safePayouts
      .filter((p) => String(p.status).toUpperCase() === "COMPLETED")
      .reduce((acc, p) => acc + Number(p.amount || 0), 0),
    totalProcessed: safePayouts.filter(
      (p) => String(p.status).toUpperCase() === "COMPLETED"
    ).length,
  };

  const renderStatusBadge = (status) => {
    const upper = String(status || "PENDING").toUpperCase();
    const bgMap = {
      PENDING: "bg-warning-subtle text-warning-emphasis border-warning-subtle",
      COMPLETED: "bg-success-subtle text-success-emphasis border-success-subtle",
      FAILED: "bg-danger-subtle text-danger-emphasis border-danger-subtle",
    };
    return (
      <span className={`badge border ${bgMap[upper] || "bg-secondary-subtle text-secondary"}`}>
        {upper}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 mb-4 border-bottom">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Payout Management</h1>
          <p className="text-muted small mb-0">
            Approve and execute payout releases to registered sellers.
          </p>
        </div>
        <button
          onClick={fetchPayouts}
          className="btn btn-outline-primary btn-sm mt-2 mt-md-0"
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </button>
      </div>

      {/* Global Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <span className="text-muted small fw-semibold">Pending Releases</span>
              <h3 className="fw-bold mb-1 mt-2 text-warning">
                ${stats.pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
              <small className="text-muted">{stats.pendingCount} payout requests pending</small>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <span className="text-muted small fw-semibold">Total Paid Out</span>
              <h3 className="fw-bold mb-1 mt-2 text-success">
                ${stats.completedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
              <small className="text-muted">{stats.totalProcessed} completed payouts</small>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search seller name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-8 d-flex justify-content-md-end gap-2">
              <div className="btn-group btn-group-sm" role="group">
                {["All", "Pending", "Completed"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn ${
                      statusFilter === status ? "btn-dark" : "btn-outline-secondary"
                    }`}
                    onClick={() => {
                      setStatusFilter(status);
                      setPage(0);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th scope="col" className="ps-3">Payout ID</th>
                <th scope="col">Seller</th>
                <th scope="col">Amount</th>
                <th scope="col">Created Date</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end pe-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    <span className="text-muted">Loading payouts...</span>
                  </td>
                </tr>
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No payouts found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout, idx) => {
                  const currentSellerId = payout.sellerId || payout.seller?.id || payout.vendorId;
                  return (
                    <tr key={payout.id || idx}>
                      <td className="ps-3 fw-bold font-monospace text-primary">
                        #{payout.id || `PAY-${currentSellerId}`}
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {payout.sellerName || payout.seller?.name || payout.vendorName || "Seller"}
                        </div>
                        <small className="text-muted">Seller ID: {currentSellerId}</small>
                      </td>
                      <td className="fw-bold text-dark">
                        ${Number(payout.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-muted small">
                        {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td>{renderStatusBadge(payout.status)}</td>
                      <td className="text-end pe-3">
                        <button
                          onClick={() => setSelectedPayout(payout)}
                          className="btn btn-sm btn-light border"
                        >
                          Manage <i className="bi bi-box-arrow-up-right ms-1"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
            <span className="small text-muted">
              Page {page + 1} of {totalPages}
            </span>
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-secondary"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedPayout && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal d-block fade show" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">Release Payout</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPayout(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="bg-light p-3 rounded mb-3">
                    <span className="text-uppercase text-muted extra-small fw-bold">Seller</span>
                    <div className="fw-bold fs-6">
                      {selectedPayout.sellerName || selectedPayout.seller?.name || "Seller"}
                    </div>
                    <small className="text-muted">
                      ID: {selectedPayout.sellerId || selectedPayout.seller?.id || selectedPayout.vendorId}
                    </small>
                  </div>

                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span className="text-muted">Payout Amount</span>
                      <span className="fw-bold fs-5 text-dark">
                        ${Number(selectedPayout.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span className="text-muted">Status</span>
                      <span>{renderStatusBadge(selectedPayout.status)}</span>
                    </li>
                  </ul>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedPayout(null)}
                  >
                    Close
                  </button>

                  {String(selectedPayout.status).toUpperCase() !== "COMPLETED" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleReleasePayout(
                          selectedPayout.sellerId || selectedPayout.seller?.id || selectedPayout.vendorId
                        )
                      }
                      disabled={isProcessing}
                      className="btn btn-success btn-sm"
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Releasing...
                        </>
                      ) : (
                        "Release Payout"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}