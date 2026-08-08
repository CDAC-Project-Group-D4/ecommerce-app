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
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  Store,
  Image as ImageIcon,
  MessageSquare,
  X,
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

  // Image Preview Modal State
  const [previewImage, setPreviewImage] = useState(null);

  // Action Modal State
  const [activeModal, setActiveModal] = useState({
    show: false,
    returnId: null,
    actionType: null, // 'ACCEPT' or 'REJECT'
  });
  const [adminNotes, setAdminNotes] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDisputedReturns();
      setDisputes(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching disputes:", err);
      setError("Failed to fetch disputed returns. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const openActionModal = (returnId, actionType) => {
    setAdminNotes("");
    setActiveModal({
      show: true,
      returnId,
      actionType,
    });
  };

  const closeModal = () => {
    setActiveModal({ show: false, returnId: null, actionType: null });
    setAdminNotes("");
  };

  const handleConfirmAction = async () => {
    const { returnId, actionType } = activeModal;
    if (!returnId) return;

    let currentAdminId = null;
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentAdminId = storedUser.id || storedUser.userId;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }

    try {
      setActionLoading(true);
      setError(null);

      const payload = {
        adminId: currentAdminId,
        adminNotes:
          adminNotes.trim() ||
          (actionType === "ACCEPT"
            ? "Dispute accepted. Refund approved"
            : "Dispute rejected!"),
      };

      if (actionType === "ACCEPT") {
        await adminApi.acceptDispute(returnId, payload);
        setDisputes((prev) =>
          prev.map((d) => {
            const currentId = d.returnRequestId || d.id;
            return currentId === returnId
              ? {
                  ...d,
                  adminDecision: "APPROVED",
                  adminNotes: payload.adminNotes,
                  refundStatus: "COMPLETED",
                }
              : d;
          }),
        );
      } else {
        await adminApi.rejectDispute(returnId, payload);
        setDisputes((prev) =>
          prev.map((d) => {
            const currentId = d.returnRequestId || d.id;
            return currentId === returnId
              ? {
                  ...d,
                  adminDecision: "REJECTED",
                  adminNotes: payload.adminNotes,
                  refundStatus: "REJECTED",
                }
              : d;
          }),
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          `Failed to process ${actionType.toLowerCase()} dispute for Return Request #${returnId}.`,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status = "") => {
    const st = status.toString().toUpperCase();
    if (
      st.includes("RESOLVED") ||
      st.includes("CLOSED") ||
      st.includes("ACCEPTED") ||
      st.includes("APPROVED") ||
      st.includes("COMPLETED")
    ) {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle">
          {status}
        </span>
      );
    }
    if (
      st.includes("PENDING") ||
      st.includes("OPEN") ||
      st.includes("DISPUTED")
    ) {
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
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
        {status || "UNKNOWN"}
      </span>
    );
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const returnId = dispute.returnRequestId || dispute.id || "";
    const matchesSearch =
      (dispute.raisedBy || dispute.userEmail || dispute.userName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (dispute.reason || dispute.subject || dispute.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (dispute.description || dispute.details || dispute.sellerNotes || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      returnId.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const statusToCheck =
      dispute.adminDecision || dispute.sellerDecision || "DISPUTED";
    const matchesStatus =
      selectedStatus === "ALL" ||
      statusToCheck.toUpperCase() === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(
    new Set(
      disputes
        .map((d) =>
          (d.adminDecision || d.sellerDecision || d.status)?.toUpperCase(),
        )
        .filter(Boolean),
    ),
  );

  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisputes = filteredDisputes.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="container-fluid p-0">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dispute Management</h3>
          <p className="text-muted mb-0">
            Review user claims, track seller responses, and resolve platform
            disputes
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={fetchDisputes}
          disabled={loading || actionLoading}
        >
          <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
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
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-8 col-lg-9">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by Return ID, user email, reason, or notes..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
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
            <span>Disputed Return Requests ({filteredDisputes.length})</span>
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
              <p className="mb-0">
                No disputed returns matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}></th>
                    <th style={{ width: "15%" }}>Return ID / Order</th>
                    <th style={{ width: "20%" }}>Raised By</th>
                    <th style={{ width: "25%" }}>Reason / Claim</th>
                    <th style={{ width: "15%" }}>Admin Decision</th>
                    <th style={{ width: "20%" }} className="text-end pe-4">
                      Admin Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDisputes.map((dispute, index) => {
                    const returnId =
                      dispute.returnRequestId || dispute.id || index;
                    const isExpanded = expandedRow === returnId;
                    const isResolved =
                      dispute.adminDecision &&
                      dispute.adminDecision !== "PENDING";

                    const images = Array.isArray(dispute.imageUrls)
                      ? dispute.imageUrls
                      : dispute.customerPhoto
                        ? [dispute.customerPhoto]
                        : [];

                    return (
                      <React.Fragment key={returnId}>
                        <tr>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 text-dark text-decoration-none"
                              onClick={() => toggleRow(returnId)}
                              aria-label="Toggle Dispute Details"
                            >
                              {isExpanded ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>
                          </td>
                          <td className="small text-secondary">
                            <div className="fw-bold text-dark">
                              REQ #{dispute.returnRequestId || dispute.id}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              Order #{dispute.orderId || "N/A"}
                            </div>
                          </td>
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
                                  {dispute.userEmail ||
                                    dispute.raisedBy ||
                                    "Customer"}
                                </div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  User ID: {dispute.userId || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold small text-dark">
                              {dispute.reason || "Dispute Claim"}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              Type: {dispute.requestType || "RETURN"}
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(dispute.adminDecision || "PENDING")}
                          </td>
                          <td className="text-end pe-4">
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-success d-flex align-items-center gap-1"
                                disabled={actionLoading || isResolved}
                                onClick={() =>
                                  openActionModal(returnId, "ACCEPT")
                                }
                              >
                                <CheckCircle size={14} />
                                <span>Accept</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger d-flex align-items-center gap-1"
                                disabled={actionLoading || isResolved}
                                onClick={() =>
                                  openActionModal(returnId, "REJECT")
                                }
                              >
                                <XCircle size={14} />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Collapsible Details Drawer */}
                        {isExpanded && (
                          <tr className="bg-light">
                            <td colSpan="6" className="p-3">
                              <div className="card border shadow-sm">
                                <div className="card-header bg-white py-2 fw-semibold text-muted small d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center gap-2">
                                    <FileText size={16} />
                                    <span>Return Dispute Overview</span>
                                  </div>
                                  <span className="font-monospace text-secondary">
                                    Order Item ID:{" "}
                                    {dispute.orderItemId || "N/A"}
                                  </span>
                                </div>
                                <div className="card-body">
                                  <div className="row g-4">
                                    {/* Left Side: Customer Claim */}
                                    <div className="col-md-6 border-end">
                                      <div className="d-flex align-items-center gap-2 mb-3 text-primary">
                                        <User size={18} />
                                        <h6 className="fw-bold mb-0">
                                          Customer Claim
                                        </h6>
                                      </div>
                                      <div className="mb-3">
                                        <span className="text-muted small d-block mb-1">
                                          Customer Email:
                                        </span>
                                        <div className="fw-semibold small text-dark mb-2">
                                          {dispute.userEmail || "N/A"}
                                        </div>
                                        <span className="text-muted small d-block mb-1">
                                          Return Reason:
                                        </span>
                                        <div className="p-2 bg-light rounded border small text-dark mb-3">
                                          {dispute.reason ||
                                            "No reason provided."}
                                        </div>
                                      </div>

                                      {/* Attached Images */}
                                      <div>
                                        <span className="text-muted small d-block mb-1">
                                          Attached Photos ({images.length}):
                                        </span>
                                        {images.length > 0 ? (
                                          <div className="d-flex flex-wrap gap-2">
                                            {images.map((imgUrl, idx) => (
                                              <button
                                                key={idx}
                                                type="button"
                                                className="btn p-1 border rounded bg-white shadow-sm cursor-pointer"
                                                onClick={() =>
                                                  setPreviewImage(imgUrl)
                                                }
                                              >
                                                <img
                                                  src={imgUrl}
                                                  alt={`Proof ${idx + 1}`}
                                                  className="rounded"
                                                  style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                  }}
                                                />
                                              </button>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="p-3 bg-light border rounded text-center text-muted small">
                                            <ImageIcon
                                              size={20}
                                              className="mb-1 opacity-50"
                                            />
                                            <div>
                                              No proof photos attached by
                                              customer
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Right Side: Seller Response */}
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center gap-2 mb-3 text-dark">
                                        <Store size={18} />
                                        <h6 className="fw-bold mb-0">
                                          Seller & Admin Status
                                        </h6>
                                      </div>
                                      <div className="mb-3">
                                        <span className="text-muted small d-block mb-1">
                                          Seller Decision:
                                        </span>
                                        <div className="mb-2">
                                          {getStatusBadge(
                                            dispute.sellerDecision ||
                                              "REJECTED",
                                          )}
                                        </div>
                                        <span className="text-muted small d-block mb-1">
                                          Seller Notes:
                                        </span>
                                        <div className="p-2 bg-light rounded border small text-dark mb-3">
                                          {dispute.sellerNotes ||
                                            "No seller notes provided."}
                                        </div>
                                        {dispute.adminNotes && (
                                          <>
                                            <span className="text-muted small d-block mb-1">
                                              Admin Resolution Notes:
                                            </span>
                                            <div className="p-2 bg-info-subtle border border-info-subtle rounded small text-dark">
                                              {dispute.adminNotes}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <details className="mt-4 pt-3 border-top">
                                    <summary className="text-muted small fw-semibold cursor-pointer">
                                      View Raw Payload JSON
                                    </summary>
                                    <div className="bg-dark p-2 rounded mt-2">
                                      <pre
                                        className="text-success mb-0 small font-monospace"
                                        style={{
                                          maxHeight: "160px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        {JSON.stringify(dispute, null, 2)}
                                      </pre>
                                    </div>
                                  </details>
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

        {/* Pagination */}
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content bg-transparent border-0 text-end"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm rounded-circle"
                  onClick={() => setPreviewImage(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="text-center">
                <img
                  src={previewImage}
                  alt="Proof Preview"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Action Modal */}
      {activeModal.show && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-header-title mb-0 d-flex align-items-center gap-2 fw-bold fs-6">
                  <MessageSquare size={18} className="text-primary" />
                  <span>
                    {activeModal.actionType === "ACCEPT"
                      ? "Accept Dispute (Rule for Customer)"
                      : "Reject Dispute (Uphold Seller)"}
                  </span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={actionLoading}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Please enter optional notes or a justification for Return
                  Request <strong>#{activeModal.returnId}</strong>.
                </p>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Admin Notes / Remarks
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Enter resolution notes here..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    disabled={actionLoading}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light border btn-sm"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    activeModal.actionType === "ACCEPT"
                      ? "btn-success"
                      : "btn-danger"
                  }`}
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                    ></span>
                  ) : activeModal.actionType === "ACCEPT" ? (
                    "Confirm Accept"
                  ) : (
                    "Confirm Reject"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeMgmt;
