import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * A modern sidebar using Bootstrap 5 Offcanvas and Nav components.
 * Collapses on mobile, shows icons and labels, highlights the active route.
 * @param {Object} props
 * @param {"admin"|"buyer"|"vendor"} props.role
 */
const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const menuItems = {
    admin: [
      { name: 'Dashboard', path: '/DashboardAdmin', icon: 'bi-speedometer2' },
      { name: 'Manage Clients', path: '/manage_clients', icon: 'bi-people' },
      { name: 'Manage Vendors', path: '/manage_vendors', icon: 'bi-shop' },
      { name: 'Logout', path: '/', icon: 'bi-box-arrow-right' },
    ],
    buyer: [
      { name: 'Products', path: '/products', icon: 'bi-box-seam' },
      { name: 'Wishlist', path: '/wishlist', icon: 'bi-heart' },
      { name: 'Cart', path: '/cart', icon: 'bi-cart' },
      { name: 'Logout', path: '/', icon: 'bi-box-arrow-right' },
    ],
    vendor: [
      { name: 'Dashboard', path: '/DashboardVendor', icon: 'bi-speedometer2' },
      { name: 'Add Product', path: '/addproduct', icon: 'bi-plus-circle' },
      { name: 'List Products', path: '/listproduct', icon: 'bi-list' },
      { name: 'Manage Ads', path: '/manage_ads', icon: 'bi-megaphone' },
      { name: 'Logout', path: '/', icon: 'bi-box-arrow-right' },
    ],
  };

  // Map each role to its dashboard path
  const dashboardPath = {
    admin: '/DashboardAdmin',
    buyer: '/DashboardBuyer',
    vendor: '/DashboardVendor',
  };

  return (
    <nav className="d-flex flex-column flex-shrink-0 bg-dark text-white vh-100 position-sticky top-0 shadow" style={{width: '240px', minHeight: '100vh'}}>
      <div className="p-3">
        <span
          className="fs-4 d-flex align-items-center mb-4 fw-bold"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(dashboardPath[role] || '/')}
        >
          <i className="bi bi-bag-check-fill me-2 text-primary"></i>
          E-Commerce
        </span>
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems[role]?.map((item, idx) => (
            <li className="nav-item" key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link text-white d-flex align-items-center rounded mb-1 px-3 py-2${isActive ? ' active bg-primary' : ' bg-dark'}`
                }
                style={({ isActive }) =>
                  isActive
                    ? { fontWeight: 'bold', background: '#0d6efd', color: 'white' }
                    : { color: '#adb5bd' }
                }
              >
                <i className={`bi ${item.icon} me-3 fs-5`}></i>
                <span className="sidebar-label">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto p-3 small text-secondary text-center">
        <span>&copy; {new Date().getFullYear()} E-Commerce</span>
      </div>
    </nav>
  );
};

export default Sidebar;