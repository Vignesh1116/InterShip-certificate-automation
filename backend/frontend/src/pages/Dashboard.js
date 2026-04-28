import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [token, navigate]);

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
          <div className="dash-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>📜</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">1</span>
            <span className="dash-stat-label">Certificates</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>✅</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">Active</span>
            <span className="dash-stat-label">Internship Status</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>⭐</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">Good</span>
            <span className="dash-stat-label">Performance</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>🎯</div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">75%</span>
            <span className="dash-stat-label">Progress</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid">
        {/* Internship Details Card */}
        <div className="dash-card" id="card-internship">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Internship Details</h3>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="dash-card-body">
            <div className="detail-row">
              <span className="detail-label">Company</span>
              <span className="detail-value">Magizh Technologies</span>
            </div>
            <div className="divider" />
            <div className="detail-row">
              <span className="detail-label">Role</span>
              <span className="detail-value">Full Stack Developer</span>
            </div>
            <div className="divider" />
            <div className="detail-row">
              <span className="detail-label">Duration</span>
              <span className="detail-value">3 Months</span>
            </div>
            <div className="divider" />
            <div className="detail-row">
              <span className="detail-label">Mentor</span>
              <span className="detail-value">Gokulakrishnan (CEO)</span>
            </div>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="dash-card" id="card-certificate">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Your Certificate</h3>
            <span className="badge badge-primary">Ready</span>
          </div>
          <div className="dash-card-body">
            <div className="cert-preview">
              <div className="cert-preview-inner">
                <div className="cert-preview-logo">M</div>
                <p className="cert-preview-title">Certificate of Internship</p>
                <p className="cert-preview-company">Magizh Technologies</p>
                <div className="cert-preview-line" />
                <p className="cert-preview-id">CERT-XXXXXX</p>
              </div>
            </div>
            <p className="text-secondary" style={{ textAlign: "center", marginTop: "16px" }}>
              Your certificate will appear here once generated by the admin.
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
      </div>
    </div>
  );
}

export default Dashboard;