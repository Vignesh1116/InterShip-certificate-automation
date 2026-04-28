import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [time, setTime] = useState(new Date());
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="home">
      <div className="home-main">
        {/* Left — Hero */}
        <div className="home-hero">
          <p className="home-greeting">{greeting()}</p>
          <h1 className="home-title">
            Intern Certificate<br />Management System
          </h1>
          <p className="home-desc">
            Issue and verify internship completion certificates
            for Magizh Technologies interns. Built with FastAPI, React, and SQLite.
          </p>

          <div className="home-cta">
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg" id="btn-go-dashboard">
                Go to Dashboard →
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg" id="btn-sign-in">
                Sign in to continue →
              </Link>
            )}
            <Link to="/verify" className="home-link-verify" id="btn-verify-link">
              or verify a certificate
            </Link>
          </div>
        </div>

        {/* Right — Quick Actions */}
        <div className="home-panel">
          <div className="home-card" id="card-quick-actions">
            <h3 className="home-card-label">Quick Actions</h3>
            <div className="home-actions">
              <Link to="/verify" className="action-item" id="action-verify">
                <div className="action-icon action-icon-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                <div>
                  <span className="action-title">Verify Certificate</span>
                  <span className="action-desc">Check authenticity by ID</span>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link to="/admin" className="action-item" id="action-generate">
                <div className="action-icon action-icon-green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/>
                  </svg>
                </div>
                <div>
                  <span className="action-title">Generate Certificate</span>
                  <span className="action-desc">Admin — create a new cert</span>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link to="/dashboard" className="action-item" id="action-dashboard">
                <div className="action-icon action-icon-purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                  </svg>
                </div>
                <div>
                  <span className="action-title">Student Dashboard</span>
                  <span className="action-desc">View internship status</span>
                </div>
                <span className="action-arrow">→</span>
              </Link>
            </div>
          </div>

          {/* System Info */}
          <div className="home-card home-card-subtle" id="card-system-info">
            <h3 className="home-card-label">System</h3>
            <div className="sys-rows">
              <div className="sys-row">
                <span className="sys-key">API</span>
                <span className="sys-val">
                  <span className="sys-dot sys-dot-live" />
                  localhost:8000
                </span>
              </div>
              <div className="sys-row">
                <span className="sys-key">Database</span>
                <span className="sys-val">SQLite (test.db)</span>
              </div>
              <div className="sys-row">
                <span className="sys-key">Auth</span>
                <span className="sys-val">JWT + bcrypt</span>
              </div>
              <div className="sys-row">
                <span className="sys-key">Certs</span>
                <span className="sys-val">PDF + QR Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <span className="home-footer-left">
          Magizh Technologies © {new Date().getFullYear()}
        </span>
        <span className="home-footer-right">
          v1.0.0 · Internship Certificate System
        </span>
      </footer>
    </div>
  );
}

export default Home;
