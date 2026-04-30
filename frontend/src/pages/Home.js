import { useState, useEffect } from "react";
import { API } from "../api";
import "./Home.css";

function Home() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total_students: 0, doing_internships: 0, completed_internships: 0 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    try {
      const [studentsRes, statsRes] = await Promise.all([
        API.get("/students"),
        API.get("/stats")
      ]);
      setStudents(studentsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);
    try {
      await API.post("/interns", {
        name,
        email,
        role,
        start_date: start,
        end_date: end
      });
      setMessage({ type: "success", text: "Student added successfully!" });
      setName(""); setEmail(""); setRole(""); setStart(""); setEnd("");
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.detail 
        ? (typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail))
        : (err.message || "Failed to add student.");
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGenerate = async (internshipId) => {
    try {
      const res = await API.post(`/generate/intern/${internshipId}`);
      window.open(`${API.defaults.baseURL}/preview/${res.data.cert_id}`, "_blank");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to generate certificate.");
    }
  };

  return (
    <div className="home-page" id="home-page">
      <div className="home-container">
        {/* Header Section */}
        <div className="home-header-section">
          <div>
            <h1 className="home-main-title">Magizh Technologies</h1>
            <p className="home-subtitle">Internship Management Dashboard</p>
          </div>
          <div className="stats-badges">
            <div className="stat-badge">
              <span className="stat-badge-label">Total Students</span>
              <span className="stat-badge-value">{stats.total_students}</span>
            </div>
            <div className="stat-badge badge-blue">
              <span className="stat-badge-label">Doing Internship</span>
              <span className="stat-badge-value">{stats.doing_internships}</span>
            </div>
            <div className="stat-badge badge-green">
              <span className="stat-badge-label">Completed</span>
              <span className="stat-badge-value">{stats.completed_internships}</span>
            </div>
          </div>
        </div>

        <div className="home-grid">
          {/* Left: Add Student Form */}
          <div className="home-form-section">
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-icon">➕</div>
                <div>
                  <h3 className="admin-card-title">Add New Student</h3>
                  <p className="text-muted">Register intern details</p>
                </div>
              </div>

              <form onSubmit={handleAddStudent} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" type="text" value={role} onChange={e=>setRole(e.target.value)} required placeholder="e.g. Web Developer" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="date" value={start} onChange={e=>setStart(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" type="date" value={end} onChange={e=>setEnd(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className={`btn btn-primary btn-full btn-lg ${formLoading ? "btn-loading" : ""}`} disabled={formLoading}>
                  {formLoading ? <span className="spinner" /> : "Register Intern"}
                </button>
              </form>
              {message && (
                <div className={`alert alert-${message.type}`} style={{ marginTop: "16px" }}>
                  {message.type === "success" ? "✓" : "✕"} {message.text}
                </div>
              )}
            </div>
          </div>

          {/* Right: Student List */}
          <div className="home-list-section">
            <div className="admin-card" style={{ height: "100%" }}>
              <div className="admin-card-header">
                <div className="admin-card-icon">📋</div>
                <div>
                  <h3 className="admin-card-title">Student Directory</h3>
                  <p className="text-muted">Manage statuses and certificates</p>
                </div>
              </div>

              {loading ? (
                <div className="loading-state">Loading students...</div>
              ) : (
                <div className="student-table-wrapper">
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Intern ID</th>
                        <th>Student</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id}>
                          <td><span className="text-mono" style={{fontSize: "0.85rem", fontWeight: "700"}}>{s.internship_id}</span></td>
                          <td>
                            <div className="student-info">
                              <span className="student-name">{s.name}</span>
                              <span className="student-email">{s.email}</span>
                            </div>
                          </td>
                          <td><span className="role-chip">{s.role}</span></td>
                          <td>
                            <span className={`status-badge ${s.status === 'Completed' ? 'status-completed' : 'status-ongoing'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td>
                            {s.status === 'Completed' ? (
                              <button onClick={() => handleGenerate(s.internship_id)} className="btn btn-primary btn-sm">
                                📜 Generate
                              </button>
                            ) : (
                              <span className="text-muted" style={{fontSize: "0.8rem"}}>Ongoing...</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
