import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api";
import "./Login.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await API.post("/login", null, {
        params: { email, password },
      });
      localStorage.setItem("token", res.data.token);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Invalid email or password.",
      });
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await API.post("/register", null, {
        params: { name, email, password, role },
      });
      setMessage({
        type: "success",
        text: "Account created! You can now sign in.",
      });
      setTimeout(() => setIsRegister(false), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Registration failed. Try again.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel — Branding */}
        <div className="auth-branding" id="auth-branding-panel">
          <div className="auth-brand-content">
            <div className="auth-logo-icon">M</div>
            <h2 className="auth-brand-title">Magizh Technologies</h2>
            <p className="auth-brand-desc">
              Secure platform for managing internship certificates.
              Generate, verify, and track certificates with confidence.
            </p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature">
                <span className="auth-feature-icon">🔒</span>
                <span>Secure JWT Authentication</span>
              </div>
              <div className="auth-brand-feature">
                <span className="auth-feature-icon">📜</span>
                <span>Professional PDF Certificates</span>
              </div>
              <div className="auth-brand-feature">
                <span className="auth-feature-icon">📱</span>
                <span>QR Code Verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="auth-form-panel" id="auth-form-panel">
          <div className="auth-form-content">
            {/* Toggle Tabs */}
            <div className="auth-tabs" id="auth-tabs">
              <button
                className={`auth-tab ${!isRegister ? "auth-tab-active" : ""}`}
                onClick={() => { setIsRegister(false); setMessage(null); }}
                id="tab-login"
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${isRegister ? "auth-tab-active" : ""}`}
                onClick={() => { setIsRegister(true); setMessage(null); }}
                id="tab-register"
              >
                Sign Up
              </button>
            </div>

            <h2 className="auth-title">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p className="auth-subtitle">
              {isRegister
                ? "Fill in your details to get started."
                : "Enter your credentials to access the platform."}
            </p>

            {/* Alert Message */}
            {message && (
              <div className={`alert alert-${message.type}`} id="auth-alert">
                {message.type === "success" ? "✓" : "✕"} {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={isRegister ? handleRegister : handleLogin} id="auth-form">
              {isRegister && (
                <div className="form-group">
                  <label className="form-label" htmlFor="input-name">Full Name</label>
                  <input
                    id="input-name"
                    className="form-input"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="input-email">Email Address</label>
                <input
                  id="input-email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-password">Password</label>
                <input
                  id="input-password"
                  className="form-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isRegister && (
                <div className="form-group">
                  <label className="form-label" htmlFor="input-role">Role / Position</label>
                  <input
                    id="input-role"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary btn-full btn-lg ${loading ? "btn-loading" : ""}`}
                disabled={loading}
                id="btn-auth-submit"
              >
                {loading ? (
                  <span className="spinner" />
                ) : isRegister ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/" className="auth-back-link" id="link-back-home">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;