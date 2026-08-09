import React, { useState, useEffect } from "react";
import axios from "axios";

export function ProfileTab() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // 1. Double Check LocalStorage Token Names
      const token = 
        localStorage.getItem("token") || 
        localStorage.getItem("jwtToken") || 
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("token");

      console.log("Fetched Auth Token:", token); // Inspect element -> console me check karein token aa raha h ya null

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/v1/users/me", {
        headers: { 
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` 
        },
      });

      console.log("User Profile Response:", res.data);
      setUser(res.data);
      setError("");
    } catch (err) {
      console.error("Full Axios Error Object:", err);
      if (err.response) {
        // Server status level error
        setError(`Server Error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        // Network/Backend not reachable error
        setError("Network Error: Spring Boot server local system par running nahi h ya CORS blocked h.");
      } else {
        setError("Failed to load user information.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ text: "New passwords do not match!", isError: true });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");

      const response = await axios.put(
        "http://localhost:8080/api/v1/users/change-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { 
            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` 
          },
        }
      );

      setMessage({ text: response.data || "Password updated successfully!", isError: false });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to change password!";
      setMessage({ text: errMsg, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading Profile...</div>;
  if (error) return <div className="alert alert-danger my-3">{error}</div>;

  return (
    <div>
      <h4 className="mb-4 border-bottom pb-2">Personal Information</h4>

      {user && (
        <div className="row mb-4 bg-light p-3 rounded mx-0">
          <div className="col-md-6 mb-2">
            <strong>Full Name:</strong> <p className="mb-0 text-muted">{user.fullName}</p>
          </div>
          <div className="col-md-6 mb-2">
            <strong>Email:</strong> <p className="mb-0 text-muted">{user.email}</p>
          </div>
          <div className="col-md-6 mb-2">
            <strong>Phone:</strong> <p className="mb-0 text-muted">{user.phone || "N/A"}</p>
          </div>
          <div className="col-md-6 mb-2">
            <strong>Role:</strong> <p className="mb-0 text-muted">{user.role}</p>
          </div>
        </div>
      )}

      <h5 className="mt-4 mb-3 border-bottom pb-2">Change Password</h5>

      {message.text && (
        <div className={`alert ${message.isError ? "alert-danger" : "alert-success"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handlePasswordChange} style={{ maxWidth: "450px" }}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-warning text-white" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}