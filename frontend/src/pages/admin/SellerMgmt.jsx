import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";

export default function SellerMgmt() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global Commission Settings State
  const [commission, setCommission] = useState({
    defaultRate: 10,
    categoryRates: {},
  });
  const [savingCommission, setSavingCommission] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [newDefaultRate, setNewDefaultRate] = useState("");

  // Search & Action State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Audit Logs State
  const [sellerLogs, setSellerLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const commissionRes = await adminApi
        .getCommissionSetting()
        .catch(() => null);
      console.log(commissionRes);
      if (commissionRes?.data) {
        setCommission(commissionRes.data);
        setNewDefaultRate(commissionRes.data.defaultRate || "10");
      }

      // Fetch sellers directly from AdminSellerController
      const sellersRes = await adminApi.getSellers();
      console.log(sellersRes);
      const sellersData = Array.isArray(sellersRes)
        ? sellersRes
        : sellersRes?.content || [];

      setSellers(sellersData);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError(
        err.response?.data?.message || "Failed to load seller management data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (sellerId, isCurrentlyBlocked) => {
    setActionLoading(true);
    try {
      if (isCurrentlyBlocked) {
        await adminApi.unblockSeller(sellerId);
        alert(`Seller #${sellerId} unblocked successfully.`);
      } else {
        await adminApi.blockSeller(sellerId);
        alert(`Seller #${sellerId} blocked successfully.`);
      }
      loadData();
    } catch (err) {
      console.error("Block action failed:", err);
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (
      !window.confirm(
        `Are you sure you want to soft delete seller #${sellerId}?`,
      )
    ) {
      return;
    }
    setActionLoading(true);
    try {
      await adminApi.deleteSeller(sellerId);
      alert(`Seller #${sellerId} soft-deleted successfully.`);
      loadData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCommission = async (e) => {
    e.preventDefault();
    setSavingCommission(true);
    console.log(commission);
    try {
      const payload = {
        ...commission,
        commissionPercentage: Number(newDefaultRate),
      };
      const response = await adminApi.updateCommissionSetting(newDefaultRate);
      console.log(response)
      setCommission(payload);
      alert(
        response.data?.message || "Commission setting updated successfully!",
      );
      setShowCommissionModal(false);
    } catch (err) {
      console.error("Failed to update commission:", err);
      alert(`Update Failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setSavingCommission(false);
    }
  };

  const handleInspectSeller = async (seller) => {
    const sId = seller.id || seller.sellerId;
    setSelectedSeller(seller);
    setLoadingLogs(true);
    try {
      const response = await adminApi.getAuditLogs({ sellerId: sId });
      const logs = Array.isArray(response.data)
        ? response.data
        : response.data?.logs || [];
      setSellerLogs(logs);
    } catch (err) {
      console.error("Failed to fetch seller logs:", err);
      setSellerLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Safe Search Filter (Prevents crashes when fields are missing)
  const filteredSellers = sellers.filter((seller) => {
    if (!seller) return false;
    const name = String(
      seller.name || seller.fullName || seller.storeName || "",
    ).toLowerCase();
    const email = String(seller.email || "").toLowerCase();
    const id = String(seller.id || seller.sellerId || "").toLowerCase();
    const query = searchTerm.toLowerCase().trim();

    if (!query) return true;
    return name.includes(query) || email.includes(query) || id.includes(query);
  });

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 mb-4 border-bottom">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Seller Management</h1>
          <p className="text-muted small mb-0">
            Manage vendor accounts, release payouts, track activity, and
            configure commission settings.
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <button
            onClick={() => setShowCommissionModal(true)}
            className="btn btn-outline-dark btn-sm"
          >
            <i className="bi bi-gear-fill me-1"></i> Commission Settings (
            {commission.commissionPercentage || 0}%)
          </button>
          <button onClick={loadData} className="btn btn-primary btn-sm">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>API Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <span className="text-muted small fw-semibold d-block mb-1">
                Default Commission Rate
              </span>
              <h3 className="fw-bold mb-0 text-primary">
                {commission.commissionPercentage || 0}%
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <span className="text-muted small fw-semibold d-block mb-1">
                Total Sellers
              </span>
              <h3 className="fw-bold mb-0 text-dark">{sellers.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <span className="text-muted small fw-semibold d-block mb-1">
                API Status
              </span>
              <h3 className="fw-bold mb-0 text-success fs-5">
                <i className="bi bi-check-circle-fill me-1"></i> Connected
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search sellers by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th scope="col" className="ps-3">
                  Seller Details
                </th>
                <th scope="col">Seller ID</th>
                <th scope="col">Status</th>
                <th scope="col">Joined Date</th>
                <th scope="col" className="text-end pe-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div
                      className="spinner-border spinner-border-sm text-primary me-2"
                      role="status"
                    ></div>
                    <span className="text-muted">Loading sellers...</span>
                  </td>
                </tr>
              ) : filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No sellers found.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller, index) => {
                  const sId = seller.id || seller.sellerId;
                  const displayName =
                    seller.fullName ||
                    seller.name ||
                    seller.storeName ||
                    "Vendor";
                  const isBlocked =
                    seller.blocked === true ||
                    seller.status === "BLOCKED" ||
                    seller.status === "Blocked";

                  return (
                    <tr key={sId || index}>
                      <td className="ps-3">
                        <div className="fw-bold text-dark">{displayName}</div>
                        <div className="small text-muted">{seller.email}</div>
                      </td>
                      <td className="font-monospace text-secondary small">
                        {sId}
                      </td>
                      <td>
                        <span
                          className={`badge ${isBlocked ? "bg-danger" : "bg-success"}`}
                        >
                          {isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {seller.createdAt ||
                          seller.created_at ||
                          seller.joinedDate ||
                          "N/A"}
                      </td>
                      <td className="text-end pe-3">
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleToggleBlock(sId, isBlocked)}
                            disabled={actionLoading}
                            className={`btn ${isBlocked ? "btn-outline-success" : "btn-outline-warning"}`}
                            title={
                              isBlocked ? "Unblock Seller" : "Block Seller"
                            }
                          >
                            <i
                              className={`bi ${isBlocked ? "bi-check-circle" : "bi-slash-circle"} me-1`}
                            ></i>
                            {isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            onClick={() => handleInspectSeller(seller)}
                            className="btn btn-outline-primary"
                            title="View Activity Logs"
                          >
                            <i className="bi bi-eye me-1"></i> Activity
                          </button>
                          <button
                            onClick={() => handleDeleteSeller(sId)}
                            disabled={actionLoading}
                            className="btn btn-outline-danger"
                            title="Delete Seller"
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Modal */}
      {showCommissionModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal d-block fade show" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    Update Commission Settings
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCommissionModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpdateCommission}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">
                        Default Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        className="form-control"
                        value={newDefaultRate}
                        onChange={(e) => setNewDefaultRate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowCommissionModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingCommission}
                      className="btn btn-primary btn-sm"
                    >
                      {savingCommission ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Activity Logs Modal */}
      {selectedSeller && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal d-block fade show" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                  <div>
                    <h5 className="modal-title fw-bold">
                      Seller Activity & Audit Log
                    </h5>
                    <small className="text-muted">
                      {selectedSeller.fullName || selectedSeller.name} (
                      {selectedSeller.id})
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedSeller(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  {loadingLogs ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border spinner-border-sm text-primary me-2"
                        role="status"
                      ></div>
                      <span className="text-muted">Fetching audit logs...</span>
                    </div>
                  ) : sellerLogs.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      No activity logs found for this seller.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-striped align-middle">
                        <thead className="table-light small">
                          <tr>
                            <th>Action / Event</th>
                            <th>Timestamp</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerLogs.map((log, index) => (
                            <tr key={log.id || index}>
                              <td className="fw-semibold small">
                                {log.action || log.event || "System Event"}
                              </td>
                              <td className="text-muted small">
                                {log.createdAt
                                  ? new Date(log.createdAt).toLocaleString()
                                  : "N/A"}
                              </td>
                              <td className="small text-secondary">
                                {log.details || JSON.stringify(log.meta || {})}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer bg-light">
                  <button
                    onClick={() => setSelectedSeller(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
