import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setIsAuthenticated(false);
    navigate("/login");
  };

  const navLinks = [
    { 
      to: "/", 
      label: "Dashboard", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
        </svg>
      )
    },
    { 
      to: "/admin", 
      label: "Issue Cert", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
        </svg>
      )
    },
    { 
      to: "/certificates", 
      label: "Certificates", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
        </svg>
      )
    },
    { 
      to: "/verify", 
      label: "Verify", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      )
    },
  ];

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} id="main-navbar">
      <div className="navbar-inner">
        {/* Brand Section */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-container">
            <img src="/Magizh_Tech_Logo.png" alt="Magizh Technologies" className="brand-logo-img" />
          </div>
          <div className="brand-text-container">
            <span className="brand-primary-text">Magizh Technologies</span>
            <span className="brand-secondary-text">ENTERPRISE PORTAL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${mobileOpen ? "navbar-links-mobile-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-item ${location.pathname === link.to ? "nav-link-item-active" : ""}`}
            >
              <span className="nav-link-icon-box">{link.icon}</span>
              <span className="nav-link-text">{link.label}</span>
              {location.pathname === link.to && <span className="nav-link-active-bar" />}
            </Link>
          ))}
          
          <button onClick={handleLogout} className="nav-link-item logout-action">
            <span className="nav-link-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span className="nav-link-text">Sign Out</span>
          </button>
        </div>

        {/* Right Info Section */}
        <div className="navbar-right-meta">
          <div className="session-status">
            <span className="session-indicator pulse-green" />
            <span className="session-label">Admin Session</span>
          </div>
          
          {/* Mobile Hamburger */}
          <button 
            className={`mobile-nav-toggle ${mobileOpen ? "toggle-active" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;