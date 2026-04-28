import { useState } from "react";
import { API } from "../api";
import "./Verify.css";

function Verify() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    setLoading(true);
    setData(null);
    setSearched(false);
    try {
      const res = await API.get(`/verify/${id}`);
      setData(res.data);
    } catch (err) {
      setData({ status: "ERROR" });
    }
    setSearched(true);
    setLoading(false);
  };

  const isVerified = data?.status === "VERIFIED";

  return (
    <div className="verify-page" id="verify-page">
      <div className="verify-container">
        {/* Header */}
        <div className="verify-header">
          <div className="verify-icon-wrapper">
            <span className="verify-icon-large">🔍</span>
          </div>
          <h1 className="verify-title" id="verify-title">Certificate Verification</h1>
          <p className="verify-subtitle">
            Enter a certificate ID to instantly verify its authenticity.
            All certificates issued by Magizh Technologies are traceable.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={verify} className="verify-search" id="verify-form">
          <div className="verify-input-wrapper">
            <span className="verify-input-icon">🔎</span>
            <input
              id="input-cert-id"
              className="verify-input"
              type="text"
              placeholder="Enter Certificate ID (e.g. CERT-ABC123)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary btn-lg ${loading ? "btn-loading" : ""}`}
            disabled={loading}
            id="btn-verify"
          >
            {loading ? <span className="spinner" /> : "Verify"}
          </button>
        </form>

        {/* Results */}
        {searched && data && (
          <div className={`verify-result ${isVerified ? "verify-result-success" : "verify-result-fail"}`} id="verify-result">
            {isVerified ? (
              <>
                <div className="verify-result-icon verify-result-icon-success">
                  <span>✓</span>
                </div>
                <h2 className="verify-result-title result-success">Certificate Verified</h2>
                <p className="verify-result-subtitle">
                  This certificate is authentic and was issued by Magizh Technologies.
                </p>

                <div className="verify-details-card">
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Status</span>
                    <span className="badge badge-success">✓ Verified</span>
                  </div>
                  <div className="divider" />
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Holder Name</span>
                    <span className="verify-detail-value">{data.name}</span>
                  </div>
                  <div className="divider" />
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Issuing Company</span>
                    <span className="verify-detail-value">{data.company}</span>
                  </div>
                  <div className="divider" />
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Certificate ID</span>
                    <span className="verify-detail-value text-mono">{id}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="verify-result-icon verify-result-icon-fail">
                  <span>✕</span>
                </div>
                <h2 className="verify-result-title result-fail">Certificate Not Found</h2>
                <p className="verify-result-subtitle">
                  No certificate with ID "<span className="text-mono">{id}</span>" exists in our system.
                  Please double-check the ID and try again.
                </p>
              </>
            )}
          </div>
        )}

        {/* Info Section */}
        {!searched && (
          <div className="verify-info" id="verify-info">
            <div className="verify-info-card">
              <span className="verify-info-icon">📋</span>
              <h4>Where to find Certificate ID?</h4>
              <p>The Certificate ID is printed on the certificate document and embedded in the QR code.</p>
            </div>
            <div className="verify-info-card">
              <span className="verify-info-icon">📱</span>
              <h4>Scan QR Code</h4>
              <p>Each certificate contains a QR code that links directly to this verification page.</p>
            </div>
            <div className="verify-info-card">
              <span className="verify-info-icon">🛡️</span>
              <h4>Tamper-Proof</h4>
              <p>All certificates are stored securely and cannot be forged or modified.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;