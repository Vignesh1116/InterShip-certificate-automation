import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import "./Login.css";

function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuth(true);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <img src="/Magizh_Tech_Logo.png" alt="Logo" className="login-logo" />
          </div>
          <h1>Admin Portal</h1>
          <p>Please sign in to access management tools</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary btn-full btn-lg ${loading ? "btn-loading" : ""}`} 
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        {error && (
          <div className="alert alert-error" style={{ marginTop: "20px" }}>
            ✕ {error}
          </div>
        )}

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Magizh Technologies — Security Protocol</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
