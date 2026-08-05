import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import {
  History,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  User,
  ShieldAlert,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");

  // Expanded details state
  const [expandedRow, setExpandedRow] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Single, memoized fetch function for both initial mount & manual refresh
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAuditLogs();

      // If Spring Boot returns Page<AuditLog> (paginated), response.data.content is the array
      const rawData = response.data;
      const logArray = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.content)
          ? rawData.content
          : [];

      setLogs(logArray);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch audit logs. Please try again.");
      setLogs([]); // Reset to empty array on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Execute the unified fetch safely
    if (isMounted) {
      fetchAuditLogs();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchAuditLogs]);

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // Helper to format Action Badge style
  const getActionBadge = (action = "") => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle">
          {action}
        </span>
      );
    }
    if (
      act.includes("DELETE") ||
      act.includes("REMOVE") ||
      act.includes("REJECT")
    ) {
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
          {action}
        </span>
      );
    }
    if (
      act.includes("UPDATE") ||
      act.includes("APPROVE") ||
      act.includes("RESOLVE")
    ) {
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
          {action}
        </span>
      );
    }
    return (
      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
        {action}
      </span>
    );
  };

  const safeLogs = Array.isArray(logs) ? logs : [];
  console.log(safeLogs);

  // Filter Logic
  const filteredLogs = safeLogs.filter((log) => {
    const matchesSearch =
      (log.adminEmail || log.userEmail || log.performedBy || log.username || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (log.adminId?.toString() || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (log.action || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || log.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesAction =
      selectedAction === "ALL" || log.action?.toUpperCase() === selectedAction;

    return matchesSearch && matchesAction;
  });

  // Unique actions for the dropdown filter
  const uniqueActions = Array.from(
    new Set(safeLogs.map((l) => l.action?.toUpperCase()).filter(Boolean)),
  );

  // Pagination Math
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container-fluid p-0">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Audit Logs</h3>
          <p className="text-muted mb-0">
            Track system events, user activities, and security actions
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={fetchAuditLogs}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          <span>Refresh Logs</span>
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
                  placeholder="Search by user, action, or log details..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Action Filter */}
            <div className="col-md-4 col-lg-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Filter size={18} />
                </span>
                <select
                  className="form-select border-start-0"
                  value={selectedAction}
                  onChange={(e) => {
                    setSelectedAction(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">All Actions</option>
                  {uniqueActions.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="card-title mb-0 d-flex align-items-center gap-2">
            <History size={18} className="text-primary" />
            <span>Activity Trail ({filteredLogs.length})</span>
          </h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading logs...</span>
              </div>
            </div>
          ) : currentLogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <ShieldAlert
                size={36}
                className="mb-2 text-secondary opacity-50"
              />
              <p className="mb-0">
                No audit logs matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}></th>
                    <th style={{ width: "20%" }}>Timestamp</th>
                    <th style={{ width: "25%" }}>Performed By</th>
                    <th style={{ width: "20%" }}>Action</th>
                    <th style={{ width: "30%" }}>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log, index) => {
                    const logId = log.id || index;
                    const isExpanded = expandedRow === logId;
                    const timestamp =
                      log.createdAt ||
                      log.timestamp ||
                      new Date().toISOString();

                    return (
                      <React.Fragment key={logId}>
                        <tr>
                          {/* Toggle Expand Icon */}
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 text-dark text-decoration-none"
                              onClick={() => toggleRow(logId)}
                              aria-label="Toggle Log Details"
                            >
                              {isExpanded ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>
                          </td>

                          {/* Timestamp */}
                          <td className="small text-secondary">
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={14} className="text-muted" />
                              <span>
                                {new Date(timestamp).toLocaleString()}
                              </span>
                            </div>
                          </td>

                          {/* Performed By */}
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
                                  {log.adminEmail ||
                                    log.userEmail ||
                                    log.username ||
                                    "System Event"}
                                </div>
                                {log.role && (
                                  <div
                                    className="text-muted"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {log.role}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Action */}
                          <td>{getActionBadge(log.action || "ACTIVITY")}</td>

                          {/* Summary */}
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "300px" }}
                          >
                            <span className="small text-dark">
                              {log.details ||
                                log.description ||
                                log.message ||
                                "No details provided"}
                            </span>
                          </td>
                        </tr>

                        {/* Collapsible Metadata Drawer */}
                        {isExpanded && (
                          <tr className="bg-light">
                            <td colSpan="5" className="p-3">
                              <div className="card border">
                                <div className="card-header bg-white py-2 fw-semibold text-muted small">
                                  Log Payload & Context Data
                                </div>
                                <div className="card-body p-2 bg-dark rounded-bottom">
                                  <pre
                                    className="text-success mb-0 small"
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {JSON.stringify(log, null, 2)}
                                  </pre>
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
        {!loading && filteredLogs.length > 0 && (
          <div className="card-footer bg-white py-3 d-flex align-items-center justify-content-between">
            <span className="small text-muted">
              Showing{" "}
              <span className="fw-semibold">{indexOfFirstItem + 1}</span> to{" "}
              <span className="fw-semibold">
                {Math.min(indexOfLastItem, filteredLogs.length)}
              </span>{" "}
              of <span className="fw-semibold">{filteredLogs.length}</span> logs
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
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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

export default AuditLogs;
