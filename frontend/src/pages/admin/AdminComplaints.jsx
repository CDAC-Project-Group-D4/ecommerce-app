import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filtering States
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'resolved'
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Resolve Modal States
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch complaints on tab or page change
  useEffect(() => {
    fetchComplaints(currentPage, activeTab);
  }, [currentPage, activeTab]);

  const fetchComplaints = async (page = 0, tab = "all") => {
    setLoading(true);
    setError(null);

    // Map active tab to Boolean | null for Spring Boot API
    let resolvedParam = null;
    if (tab === "pending") resolvedParam = false;
    if (tab === "resolved") resolvedParam = true;

    try {
      const response = await adminApi.getComplaints(
        resolvedParam,
        page,
        pageSize,
      );

      if (response && response.data) {
        const data = response.data;

        // Defensive handling for Spring Boot Page<T> vs raw Array
        const complaintList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];

        setComplaints(complaintList);
        setTotalPages(data?.totalPages || 1);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(
        err.response?.data?.message || "Failed to fetch customer complaints.",
      );
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely resolve item ID across standard DTO field variations
  const getComplaintId = (item) => item?.id || item?.complaintId || item?._id;

  // Handle Complaint Resolution Submission
  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const targetId = getComplaintId(selectedComplaint);
    if (!targetId) {
      alert("Error: Missing complaint identifier.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Matches ResolveComplaintRequestDTO
      const payload = {
        resolutionNotes: resolutionNotes.trim(),
        status: "RESOLVED",
      };

      const response = await adminApi.resolveComplaint(targetId, payload);

      // Local state update
      setComplaints((prev) =>
        prev.map((c) =>
          getComplaintId(c) === targetId
            ? {
                ...c,
                resolved: true,
                resolutionNotes: resolutionNotes,
                updatedAt: new Date().toISOString(),
                ...response.data,
              }
            : c,
        ),
      );

      alert("Complaint resolved successfully!");
      setSelectedComplaint(null);
      setResolutionNotes("");
    } catch (err) {
      console.error("Failed to resolve complaint:", err);
      alert(
        `Failed to resolve complaint: ${
          err.response?.data?.message || err.message
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side search filtering (by customer name, ID, or subject)
  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const filteredComplaints = safeComplaints.filter((item) => {
    const customer = item.customerName || item.userEmail || item.userName || "";
    const subject = item.subject || item.title || item.issueType || "";
    const id = String(getComplaintId(item) || "");

    return (
      customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm)
    );
  });

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 mb-4 border-bottom">
        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">Customer Complaints</h1>
          <p className="text-muted small mb-0">
            Review and resolve grievances submitted by customers.
          </p>
        </div>
        <button
          onClick={() => fetchComplaints(currentPage, activeTab)}
          className="btn btn-outline-primary btn-sm mt-2 mt-md-0"
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh List
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Search & Filter Tabs */}
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
                  placeholder="Search by ID, customer name, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-8 d-flex justify-content-md-end gap-2">
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "all" ? "btn-dark" : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    setActiveTab("all");
                    setCurrentPage(0);
                  }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "pending"
                      ? "btn-warning text-dark"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    setActiveTab("pending");
                    setCurrentPage(0);
                  }}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "resolved"
                      ? "btn-success"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    setActiveTab("resolved");
                    setCurrentPage(0);
                  }}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th className="ps-3">ID</th>
                <th>Customer</th>
                <th>Subject / Type</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th className="text-end pe-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div
                      className="spinner-border spinner-border-sm text-primary me-2"
                      role="status"
                    ></div>
                    <span className="text-muted">Loading complaints...</span>
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item, index) => {
                  const itemId = getComplaintId(item);
                  return (
                    <tr key={itemId || `complaint-${index}`}>
                      <td className="ps-3 font-monospace fw-bold text-primary">
                        #{itemId || "N/A"}
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {item.customerName || item.userName || "Customer"}
                        </div>
                        <div className="small text-muted">
                          {item.userEmail || item.contactEmail}
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {item.subject || item.issueType || "General Issue"}
                        </div>
                        <small
                          className="text-muted text-truncate d-inline-block"
                          style={{ maxWidth: "250px" }}
                        >
                          {item.description || item.message}
                        </small>
                      </td>
                      <td className="small text-muted">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {item.resolved ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            Resolved
                          </span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="text-end pe-3">
                        <button
                          onClick={() => setSelectedComplaint(item)}
                          className="btn btn-sm btn-light border"
                        >
                          View & Manage <i className="bi bi-eye ms-1"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Spring Pagination Controls */}
        {totalPages > 1 && (
          <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
            <span className="small text-muted">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedComplaint && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal d-block fade show" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    Complaint Details #
                    {getComplaintId(selectedComplaint) || "N/A"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setSelectedComplaint(null);
                      setResolutionNotes("");
                    }}
                  ></button>
                </div>

                <form onSubmit={handleResolveSubmit}>
                  <div className="modal-body">
                    {/* Customer Info */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="text-uppercase text-muted extra-small fw-bold d-block">
                          Customer
                        </label>
                        <span className="fw-semibold">
                          {selectedComplaint.customerName ||
                            selectedComplaint.userName ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <label className="text-uppercase text-muted extra-small fw-bold d-block">
                          Logged At
                        </label>
                        <span>
                          {selectedComplaint.createdAt
                            ? new Date(
                                selectedComplaint.createdAt,
                              ).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Complaint Content */}
                    <div className="p-3 bg-light rounded mb-3">
                      <h6 className="fw-bold mb-1">
                        {selectedComplaint.subject ||
                          selectedComplaint.issueType ||
                          "Complaint Details"}
                      </h6>
                      <p
                        className="mb-0 text-secondary small"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {selectedComplaint.description ||
                          selectedComplaint.message ||
                          "No details provided."}
                      </p>
                    </div>

                    {/* Existing Resolution Notes if already resolved */}
                    {selectedComplaint.resolved && (
                      <div className="p-3 bg-success-subtle border border-success-subtle rounded mb-3">
                        <label className="fw-bold text-success d-block mb-1">
                          Resolution Summary
                        </label>
                        <p className="mb-0 small text-dark">
                          {selectedComplaint.resolutionNotes ||
                            "Marked as resolved."}
                        </p>
                      </div>
                    )}

                    {/* Input Notes if still pending */}
                    {!selectedComplaint.resolved && (
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Resolution Details{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Provide details on how this issue was resolved..."
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          required
                        ></textarea>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer bg-light">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedComplaint(null);
                        setResolutionNotes("");
                      }}
                    >
                      Close
                    </button>

                    {!selectedComplaint.resolved && (
                      <button
                        type="submit"
                        className="btn btn-success btn-sm"
                        disabled={isSubmitting || !resolutionNotes.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                            ></span>
                            Resolving...
                          </>
                        ) : (
                          "Mark as Resolved"
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
