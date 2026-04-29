import React, { useState, useEffect } from "react";
import { API } from "../api";
import "./Certificates.css";

function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/certificates")
      .then((res) => {
        setCerts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePreview = (certId) => {
    window.open(`http://${window.location.hostname}:8000/preview/${certId}`, "_blank");
  };

  const handleDownload = (certId) => {
    window.open(`http://${window.location.hostname}:8000/download/${certId}`, "_blank");
  };

  return (
    <div className="certificates-page" id="certificates-page">
      <div className="certificates-container">
        <div className="certificates-header">
          <div className="certificates-icon-wrapper">
            <span className="certificates-icon-large">🎓</span>
          </div>
          <h1 className="certificates-title">Generated Certificates</h1>
          <p className="certificates-subtitle">
            View, preview, and download all issued certificates.
          </p>
        </div>

        {loading ? (
          <div className="loading-spinner"><span className="spinner"></span> Loading certificates...</div>
        ) : certs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No certificates have been generated yet.</p>
          </div>
        ) : (
          <div className="certificates-grid">
            {certs.map((c) => (
              <div className="certificate-card" key={c.cert_id}>
                <div className="certificate-card-header">
                  <span className="cert-id-badge text-mono">{c.cert_id}</span>
                  <span className="cert-date">{c.issue_date}</span>
                </div>
                <div className="certificate-card-body">
                  <h3 className="cert-student-name">{c.student_name}</h3>
                  <p className="cert-role">{c.role}</p>
                </div>
                <div className="certificate-card-actions">
                  <button onClick={() => handlePreview(c.cert_id)} className="btn btn-outline">
                    👁️ Preview
                  </button>
                  <button onClick={() => handleDownload(c.cert_id)} className="btn btn-primary">
                    ⬇️ Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Certificates;
