import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  User,
  ShieldAlert,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

const DisputeMgmt = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Expanded details state
  const [expandedRow, setExpandedRow] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Single memoized fetch function for initial mount & manual refresh
  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Endpoint: GET /api/admin/disputes
      const response = await adminApi.getDisputedReturns();
      setDisputes(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch disputes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchDisputes();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchDisputes]);

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // Status Change Handler
  const handleUpdateStatus = async (disputeId, newStatus) => {
    try {
      setActionLoading(true);
      setError(null);
      // Endpoint: PATCH /api/admin/disputes/:id
      await adminApi.updateDisputeStatus(disputeId, { status: newStatus });

      // Update local state smoothly
      setDisputes((prev) =>
        prev.map((d) => (d.id === disputeId ? { ...d, status: newStatus } : d)),
      );
    } catch (err) {
      console.error(err);
      setError(`Failed to update dispute status to ${newStatus}.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to format Status Badge style
  const getStatusBadge = (status = "") => {
    const st = status.toUpperCase();
    if (
      st.includes("RESOLVED") ||
      st.includes("CLOSED") ||
      st.includes("APPROVED")
    ) {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle">
          {status}
        </span>
      );
    }
    if (st.includes("PENDING") || st.includes("OPEN")) {
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
          {status}
        </span>
      );
    }
    if (st.includes("REVIEW") || st.includes("IN_PROGRESS")) {
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
          {status}
        </span>
      );
    }
    if (st.includes("REJECTED") || st.includes("CANCELLED")) {
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
          {status}
        </span>
      );
    }
    return (
      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
        {status}
      </span>
    );
  };

  // Filter Logic
  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      (dispute.raisedBy || dispute.userEmail || dispute.userName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (dispute.reason || dispute.subject || dispute.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (dispute.description || dispute.details || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (dispute.id || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" ||
      dispute.status?.toUpperCase() === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Unique statuses for dropdown filter
  const uniqueStatuses = Array.from(
    new Set(disputes.map((d) => d.status?.toUpperCase()).filter(Boolean)),
  );

  // Pagination Math
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisputes = filteredDisputes.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="container-fluid p-0">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dispute Management</h3>
          <p className="text-muted mb-0">
            Review user claims, track resolutions, and manage platform disputes
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={fetchDisputes}
          disabled={loading || actionLoading}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          <span>Refresh Disputes</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-4"
          role="alert"
        >
          <AlertCircle size={18} />
          <div>{error}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-md-8 col-lg-9">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by ID, user, reason, or details..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-md-4 col-lg-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Filter size={18} />
                </span>
                <select
                  className="form-select border-start-0"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  {uniqueStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="card-title mb-0 d-flex align-items-center gap-2">
            <AlertTriangle size={18} className="text-warning" />
            <span>Dispute Cases ({filteredDisputes.length})</span>
          </h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading disputes...</span>
              </div>
            </div>
          ) : currentDisputes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <ShieldAlert
                size={36}
                className="mb-2 text-secondary opacity-50"
              />
              <p className="mb-0">No disputes matching your search criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}></th>
                    <th style={{ width: "15%" }}>Created At</th>
                    <th style={{ width: "20%" }}>Raised By</th>
                    <th style={{ width: "20%" }}>Reason / Subject</th>
                    <th style={{ width: "15%" }}>Status</th>
                    <th style={{ width: "25%" }} className="text-end pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDisputes.map((dispute, index) => {
                    const disputeId = dispute.id || index;
                    const isExpanded = expandedRow === disputeId;
                    const createdAt =
                      dispute.createdAt ||
                      dispute.timestamp ||
                      new Date().toISOString();

                    return (
                      <React.Fragment key={disputeId}>
                        <tr>
                          {/* Toggle Expand Icon */}
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 text-dark text-decoration-none"
                              onClick={() => toggleRow(disputeId)}
                              aria-label="Toggle Dispute Details"
                            >
                              {isExpanded ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>
                          </td>

                          {/* Created At */}
                          <td className="small text-secondary">
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={14} className="text-muted" />
                              <span>
                                {new Date(createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          {/* Raised By */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-light text-dark fw-bold d-flex align-items-center justify-content-center border"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "0.75rem",
                                }}
                              >
                                <User size={14} />
                              </div>
                              <div>
                                <div className="fw-semibold text-dark small">
                                  {dispute.raisedBy ||
                                    dispute.userEmail ||
                                    dispute.userName ||
                                    "Anonymous User"}
                                </div>
                                {dispute.userRole && (
                                  <div
                                    className="text-muted"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {dispute.userRole}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Reason / Subject */}
                          <td>
                            <div className="fw-semibold small text-dark">
                              {dispute.reason ||
                                dispute.subject ||
                                "Dispute Claim"}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td>{getStatusBadge(dispute.status || "PENDING")}</td>

                          {/* Quick Actions */}
                          <td className="text-end pe-4">
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-success d-flex align-items-center gap-1"
                                disabled={
                                  actionLoading ||
                                  dispute.status?.toUpperCase() === "RESOLVED"
                                }
                                onClick={() =>
                                  handleUpdateStatus(disputeId, "RESOLVED")
                                }
                              >
                                <CheckCircle size={14} />
                                <span>Resolve</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger d-flex align-items-center gap-1"
                                disabled={
                                  actionLoading ||
                                  dispute.status?.toUpperCase() === "REJECTED"
                                }
                                onClick={() =>
                                  handleUpdateStatus(disputeId, "REJECTED")
                                }
                              >
                                <XCircle size={14} />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Collapsible Detail Drawer */}
                        {isExpanded && (
                          <tr className="bg-light">
                            <td colSpan="6" className="p-3">
                              <div className="card border shadow-sm">
                                <div className="card-header bg-white py-2 fw-semibold text-muted small d-flex align-items-center gap-2">
                                  <FileText size={16} />
                                  <span>Dispute Case Context & Payload</span>
                                </div>
                                <div className="card-body">
                                  <div className="mb-3">
                                    <h6 className="fw-bold small text-secondary mb-1">
                                      Description / Details:
                                    </h6>
                                    <p className="small text-dark mb-0 bg-light p-2 rounded border">
                                      {dispute.description ||
                                        dispute.details ||
                                        dispute.message ||
                                        "No detailed statement provided."}
                                    </p>
                                  </div>

                                  <h6 className="fw-bold small text-secondary mb-1">
                                    Full Payload JSON:
                                  </h6>
                                  <div className="bg-dark p-2 rounded">
                                    <pre
                                      className="text-success mb-0 small"
                                      style={{
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                      }}
                                    >
                                      {JSON.stringify(dispute, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && filteredDisputes.length > 0 && (
          <div className="card-footer bg-white py-3 d-flex align-items-center justify-content-between">
            <span className="small text-muted">
              Showing{" "}
              <span className="fw-semibold">{indexOfFirstItem + 1}</span> to{" "}
              <span className="fw-semibold">
                {Math.min(indexOfLastItem, filteredDisputes.length)}
              </span>{" "}
              of <span className="fw-semibold">{filteredDisputes.length}</span>{" "}
              disputes
            </span>

            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeMgmt;
