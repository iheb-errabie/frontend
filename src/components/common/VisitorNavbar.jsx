import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const VisitorNavbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Advanced animation & color palette
  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top visitor-navbar px-3" style={{
      background: "linear-gradient(90deg, #f8fafc 70%, #dbeafe 100%)",
      borderBottom: "1.5px solid #e0e7ef",
      minHeight: 70,
      zIndex: 1050,
      transition: "background 0.5s"
    }}>
      <NavLink
        className="navbar-brand d-flex align-items-center fw-bold fs-4 me-4 visitor-navbar-brand"
        to="/"
        style={{ letterSpacing: ".03em", color: "#2563eb", transition: "color 0.2s" }}
      >
        <i className="bi bi-bag-check-fill text-primary me-2 fs-3"></i>
        E-Commerce
        <span className="badge rounded-pill bg-gradient ms-3 px-3 py-1 visitor-badge">Visitor Mode</span>
      </NavLink>
      <button
        className={`navbar-toggler ${expanded ? "" : "collapsed"}`}
        type="button"
        aria-controls="visitorNavbarNav"
        aria-expanded={expanded}
        aria-label="Toggle navigation"
        onClick={() => setExpanded(!expanded)}
        style={{ border: "none", outline: "none" }}
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div
        className={`collapse navbar-collapse${expanded ? " show" : ""}`}
        id="visitorNavbarNav"
      >
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink
              to="/visitor_products"
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 visitor-link${isActive ? " active fw-bold text-primary" : ""}`
              }
              style={{
                fontSize: "1.08rem",
                letterSpacing: ".01em",
                transition: "color 0.2s"
              }}
              onClick={() => setExpanded(false)}
            >
              <i className="bi bi-box-seam me-2"></i>
              Products
            </NavLink>
          </li>
        </ul>
        <div className="d-flex gap-2 align-items-center visitor-actions">
          <button
            className="btn btn-outline-primary d-flex align-items-center px-3 visitor-login-btn"
            style={{
              borderRadius: 20,
              borderWidth: 2,
              fontWeight: 500,
              boxShadow: "0 0.5rem 1rem -0.6rem #2563eb33",
              transition: "background .2s,box-shadow .2s"
            }}
            onClick={() => {
              setExpanded(false);
              navigate("/login");
            }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </button>
          <button
            className="btn btn-gradient visitor-register-btn d-flex align-items-center px-3"
            style={{
              background: "linear-gradient(90deg,#2563eb 60%,#60a5fa 100%)",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: 20,
              boxShadow: "0 0.5rem 1rem -0.6rem #60a5fa55",
              transition: "background .2s,box-shadow .2s"
            }}
            onClick={() => {
              setExpanded(false);
              navigate("/register");
            }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Register
          </button>
        </div>
      </div>
      <style>
        {`
          .visitor-navbar .navbar-toggler:focus { box-shadow: none; }
          .visitor-navbar-brand:hover { color: #1e40af !important; }
          .visitor-badge {
            background: linear-gradient(90deg, #c7d2fe 30%, #facc15 100%);
            color: #374151;
            font-size: .95rem;
            font-weight: 600;
            box-shadow: 0 2px 12px 0 #facc1528;
            letter-spacing: .025em;
            border: none;
          }
          .visitor-link.active {
            background: #dbeafe;
            border-radius: 0.6rem;
            color: #2563eb !important;
          }
          .visitor-actions .btn-gradient:hover {
            background: linear-gradient(90deg,#1e40af 60%,#2563eb 100%) !important;
            color: #fff !important;
          }
          .visitor-login-btn:hover {
            background: #2563eb !important;
            color: #fff !important;
            border-color: #2563eb !important;
            box-shadow: 0 0.7rem 1.2rem -0.7rem #2563eb44;
          }
        `}
      </style>
    </nav>
  );
};

export default VisitorNavbar;