import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const token = localStorage.getItem("token");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Fetch Global Stats
    const fetchStats = async () => {
      try {
        const res = await API.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();

    return () => clearInterval(timer);
  }, []);

  const [stats, setStats] = useState({
    total_students: 0,
    doing_internships: 0,
    completed_internships: 0,
    roles: []
  });

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title" id="dashboard-title">
            🎓 Student Dashboard
          </h1>
          <p className="dashboard-subtitle">{formatDate(currentTime)}</p>
        </div>
        <div className="dashboard-time" id="dashboard-clock">
          <span className="time-icon">🕐</span>
          <span className="time-value">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-stats" id="dashboard-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>👥</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.total_students}</span>
            <span className="dash-stat-label">Total Interns</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>⏳</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.doing_internships}</span>
            <span className="dash-stat-label">Doing Internship</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>✅</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.completed_internships}</span>
            <span className="dash-stat-label">Completed</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>🎯</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.roles.length}</span>
            <span className="dash-stat-label">Active Roles</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid">
        {/* Internship Details Card */}
        <div className="dash-card" id="card-internship">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Company Details</h3>
            <span className="badge badge-success">Verified</span>
          </div>
          <div className="dash-card-body">
            <div className="detail-row">
              <span className="detail-label">Company</span>
              <span className="detail-value">Magizh Technologies</span>
            </div>
            <div className="divider" />
            <div className="detail-row">
              <span className="detail-label">Address</span>
              <span className="detail-value" style={{textAlign: "right"}}>Indian Oil opposite, Sathyamangalam,<br/>Tamil Nadu, India</span>
            </div>
            <div className="divider" />
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">+91-9342209140</span>
            </div>
            <div className="divider" />
            <div className="detail-row">
              <span className="detail-label">Website</span>
              <span className="detail-value">
                <a href="https://magizhtechnologies.com/" target="_blank" rel="noreferrer" style={{color: "var(--primary-light)", textDecoration: "none"}}>
                  magizhtechnologies.com
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="dash-card" id="card-certificate">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Your Certificate</h3>
            <span className="badge badge-primary">Preview</span>
          </div>
          <div className="dash-card-body">
            <div className="cert-preview premium-cert-sample">
              <div className="cert-corner top-right"></div>
              <div className="cert-corner bottom-left"></div>
              <div className="premium-cert-inner">
                <div className="premium-cert-header">
                  <div className="navbar-logo-img-wrapper" style={{ width: '40px', height: '40px' }}>
                    <img src="/company_logo.png" alt="Logo" className="navbar-logo-img" />
                  </div>
                  <div className="navbar-brand-text">
                    <span className="brand-name" style={{ fontSize: '1rem', color: '#00153B' }}>Magizh Technologies</span>
                    <span className="brand-tagline" style={{ fontSize: '0.6rem' }}>Certificate Platform</span>
                  </div>
                </div>
                <div className="premium-cert-body">
                  <h2 className="premium-cert-title-1">CERTIFICATE</h2>
                  <h3 className="premium-cert-title-2">OF INTERNSHIP</h3>
                  <div className="premium-cert-divider"></div>
                  <p className="premium-cert-text">This is to certify that</p>
                  <p className="premium-cert-name">Student Name</p>
                  <p className="premium-cert-role">has successfully completed the Internship Program</p>
                </div>
                <div className="premium-cert-footer">
                  <div className="premium-cert-id">
                    <small>CERTIFICATE ID</small>
                    <br />
                    <span>CERT-XXXXXX</span>
                  </div>
                  <div className="premium-cert-seal"></div>
                </div>
              </div>
            </div>
            <p className="text-secondary" style={{ textAlign: "center", marginTop: "16px" }}>
              This is a sample format. Your official certificate will be generated by the admin.
            </p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="dash-card dash-card-full" id="card-activity">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Recent Activity</h3>
          </div>
          <div className="dash-card-body">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot timeline-dot-success" />
                <div className="timeline-content">
                  <p className="timeline-title">Account Created</p>
                  <p className="timeline-time">Registration completed successfully</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-dot-primary" />
                <div className="timeline-content">
                  <p className="timeline-title">Internship Started</p>
                  <p className="timeline-time">Assigned to development team</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot timeline-dot-warning" />
                <div className="timeline-content">
                  <p className="timeline-title">Certificate Pending</p>
                  <p className="timeline-time">Awaiting admin approval and generation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Roles Card */}
        <div className="dash-card dash-card-full" id="card-global-roles">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Global Internship Roles</h3>
            <span className="badge badge-primary">Network</span>
          </div>
          <div className="dash-card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {stats.roles.map((r, i) => (
                <div key={i} className="role-tag" style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: '700' }}>{r.role}</span>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;