import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  // Generate State
  const [internshipId, setInternshipId] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState(null);
  const [genMessage, setGenMessage] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setGenMessage(null);
    setGenResult(null);
    try {
      const res = await API.post(`/generate/intern/${internshipId}`);
      setGenResult(res.data);
      setGenMessage({
        type: "success",
        text: "Certificate generated successfully!",
      });
    } catch (err) {
      setGenMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to generate certificate.",
      });
    }
    setGenLoading(false);
  };

  return (
    <div className="admin-page" id="admin-page">
      <div className="admin-container">
        {/* Page Header */}
        <div className="admin-header" id="admin-header">
          <div>
            <h1 className="admin-title">📜 Issue Certificate</h1>
            <p className="admin-subtitle">Generate official documents using Intern IDs</p>
          </div>
          <span className="badge badge-warning">Administrative Access</span>
        </div>

        <div className="admin-grid">
          {/* Main Action Area */}
          <div className="admin-main-area">
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-icon">🖨️</div>
                <div>
                  <h3 className="admin-card-title">Generate Certificate</h3>
                  <p className="text-muted">Enter the unique Intern ID assigned during registration</p>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Internship ID</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    placeholder="e.g. INT-1234" 
                    value={internshipId} 
                    onChange={e=>setInternshipId(e.target.value)} 
                    required 
                  />
                  <p className="form-help-text">You can find the Intern ID on the Home dashboard student list.</p>
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary btn-full btn-lg ${genLoading ? "btn-loading" : ""}`} 
                  disabled={genLoading}
                >
                  {genLoading ? <span className="spinner" /> : "Generate Official Certificate"}
                </button>
              </form>

              {genMessage && (
                <div className={`alert alert-${genMessage.type}`} style={{ marginTop: "16px" }}>
                  {genMessage.type === "success" ? "✓" : "✕"} {genMessage.text}
                </div>
              )}
            </div>
          </div>

          {/* Result Panel */}
          <div className="admin-side-panel">
            {genResult && (
              <div className="admin-card result-card animate-fade-in">
                <div className="result-header">
                  <span className="result-check">✓</span>
                  <h3>Generation Successful</h3>
                </div>
                <div className="result-details">
                  <div className="result-row">
                    <span className="result-label">Certificate ID</span>
                    <span className="result-value text-mono">{genResult.cert_id}</span>
                  </div>
                  <div className="divider" />
                  <div className="result-row">
                    <span className="result-label">Student Name</span>
                    <span className="result-value">{genResult.student_name}</span>
                  </div>
                  <div className="divider" />
                    <div className="result-row" style={{border: "none", gap: "10px", flexDirection: "column"}}>
                      <button 
                        onClick={() => window.open(`http://${window.location.hostname}:8000/preview/${genResult.cert_id}`, "_blank")}
                        className="btn btn-outline btn-full"
                        style={{marginTop: "10px"}}
                      >
                        👁️ View Certificate
                      </button>
                      <button 
                        onClick={() => navigate("/certificates")}
                        className="btn btn-primary btn-full"
                      >
                        📂 Go to Certificates Page
                      </button>
                    </div>
                </div>
              </div>
            )}

            <div className="admin-card info-card">
              <h3 className="admin-card-title" style={{ marginBottom: "12px" }}>💡 Pro Tip</h3>
              <p style={{fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: "1.5"}}>
                To add new students or check their Intern IDs, please head over to the 
                <strong> Home Dashboard</strong>. Certificates can only be issued to 
                students who have completed their duration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;