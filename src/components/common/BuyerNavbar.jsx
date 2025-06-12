import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown } from "react-bootstrap";

const menuItems = [
  { name: "Products", path: "/products", icon: "bi-box-seam" },
  { name: "Wishlist", path: "/wishlist", icon: "bi-heart" },
  { name: "Cart", path: "/cart", icon: "bi-cart" },
  { name: "Orders", path: "/orders", icon: "bi-receipt" },
];

const BuyerNavbar = () => {
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const token = localStorage.getItem("token") || getCookie("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top modern-navbar px-3">
      <NavLink
        className="navbar-brand d-flex align-items-center fw-bold fs-4 me-4"
        to="/DashboardBuyer"
      >
        <i className="bi bi-bag-check-fill text-primary me-2"></i>
        Vendoor
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#buyerNavbarNav"
        aria-controls="buyerNavbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="buyerNavbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {menuItems.map((item, idx) => (
            <li className="nav-item" key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center px-3${
                    isActive ? " active fw-bold text-primary" : ""
                  }`
                }
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="d-flex align-items-center ms-auto">
          {isLoggedIn ? (
            <Dropdown align="end" className="ms-2">
              <Dropdown.Toggle
                as="button"
                className="btn btn-link p-0 text-primary"
                style={{
                  textDecoration: "none",
                  fontSize: "1.5rem",
                }}
                aria-label="Profile menu"
              >
                <i className="bi bi-person-circle"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  minWidth: "150px",
                  border: "none",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Dropdown.Item
                  as={NavLink}
                  to="/edit_profile"
                  className="d-flex align-items-center py-2"
                  style={{ color: "#333", fontWeight: "500" }}
                >
                  <i className="bi bi-person-gear me-2"></i>
                  Edit Profile
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center py-2"
                  style={{ color: "#dc3545", fontWeight: "500" }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <NavLink
              to="/login"
              className="btn btn-primary ms-2"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BuyerNavbar;