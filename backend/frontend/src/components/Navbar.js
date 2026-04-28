import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin", label: "Admin", icon: "⚙️" },
    { to: "/verify", label: "Verify", icon: "🔍" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} id="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand" id="navbar-logo">
          <div className="navbar-logo-icon">M</div>
          <div className="navbar-brand-text">
            <span className="brand-name">Magizh Technologies</span>
            <span className="brand-tagline">Certificate Platform</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className={`navbar-links ${mobileOpen ? "navbar-links-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? "nav-link-active" : ""}`}
              id={`nav-link-${link.label.toLowerCase()}`}
            >
              <span className="nav-link-icon">{link.icon}</span>
              <span className="nav-link-label">{link.label}</span>
              {location.pathname === link.to && <span className="nav-link-indicator" />}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          <div className="navbar-status">
            <span className="status-dot online" />
            <span className="status-text">System Online</span>
          </div>
          {isLoggedIn && (
            <button className="btn-logout" onClick={handleLogout} id="btn-logout">
              Logout
            </button>
          )}
          {/* Mobile Toggle */}
          <button
            className={`navbar-toggle ${mobileOpen ? "navbar-toggle-open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            id="navbar-toggle"
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;