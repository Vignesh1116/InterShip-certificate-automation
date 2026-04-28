import { useState } from "react";
import { API } from "../api";
import "./Admin.css";

function Admin() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setResult(null);
    try {
      const res = await API.post(`/generate/${userId}`, null, {
        params: {
          role: role,
          start_date: start,
          end_date: end,
        },
      });
      setResult(res.data);
      setMessage({
        type: "success",
        text: "Certificate generated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to generate certificate.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="admin-page" id="admin-page">
      <div className="admin-container">
        {/* Page Header */}
        <div className="admin-header" id="admin-header">
          <div>
            <h1 className="admin-title">⚙️ Admin Panel</h1>
            <p className="admin-subtitle">Generate and manage internship certificates</p>
          </div>
          <span className="badge badge-warning">Admin Access</span>
        </div>

        <div className="admin-grid">
          {/* Generate Certificate Form */}
          <div className="admin-card" id="card-generate">
            <div className="admin-card-header">
              <div className="admin-card-icon">📜</div>
              <div>
                <h3 className="admin-card-title">Generate Certificate</h3>
                <p className="text-muted">Create a new certificate for a student</p>
              </div>
            </div>

            <form onSubmit={generate} className="admin-form" id="form-generate">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-user-id">User ID</label>
                <input
                  id="admin-user-id"
                  className="form-input"
                  type="number"
                  placeholder="Enter student user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-role">Role / Position</label>
                <input
                  id="admin-role"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-start-date">Start Date</label>
                  <input
                    id="admin-start-date"
                    className="form-input"
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-end-date">End Date</label>
                  <input
                    id="admin-end-date"
                    className="form-input"
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-full btn-lg ${loading ? "btn-loading" : ""}`}
                disabled={loading}
                id="btn-generate"
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <span>🚀</span> Generate Certificate
                  </>
                )}
              </button>
            </form>

            {/* Alert */}
            {message && (
              <div className={`alert alert-${message.type}`} style={{ marginTop: "16px" }} id="generate-alert">
                {message.type === "success" ? "✓" : "✕"} {message.text}
              </div>
            )}
          </div>

          {/* Result / Info Panel */}
          <div className="admin-side-panel">
            {/* Generated Certificate Result */}
            {result && (
              <div className="admin-card result-card" id="card-result">
                <div className="result-header">
                  <span className="result-check">✓</span>
                  <h3>Certificate Created</h3>
                </div>
                <div className="result-details">
                  <div className="result-row">
                    <span className="result-label">Certificate ID</span>
                    <span className="result-value text-mono">{result.cert_id}</span>
                  </div>
                  <div className="divider" />
                  <div className="result-row">
                    <span className="result-label">File Path</span>
                    <span className="result-value text-mono" style={{ fontSize: "0.8rem" }}>{result.file}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="admin-card info-card" id="card-info">
              <h3 className="admin-card-title" style={{ marginBottom: "16px" }}>📋 Quick Guide</h3>
              <div className="info-steps">
                <div className="info-step">
                  <div className="step-number">1</div>
                  <div className="step-text">
                    <p className="step-title">Find User ID</p>
                    <p className="step-desc">Check the database for the student's user ID</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">2</div>
                  <div className="step-text">
                    <p className="step-title">Fill Details</p>
                    <p className="step-desc">Enter role, start and end dates</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="step-number">3</div>
                  <div className="step-text">
                    <p className="step-title">Generate</p>
                    <p className="step-desc">Click generate to create PDF with QR code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;