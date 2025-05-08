import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css';


const Sidebar = ({ role }) => {
  const menuItems = {
    admin: [
      { name: 'Dashboard', path: '/DashboardAdmin', icon: 'bi-speedometer2' },
      { name: 'Manage Clients', path: '/manage_clients', icon: 'bi-people' },
      { name: 'Manage Vendors', path: '/manage_vendors', icon: 'bi-shop' },
      { name: 'Logout', path: '/', icon: 'bi-box-arrow-right' },
    ],
    buyer: [
      { name: 'Products', path: '/products', icon: 'bi-box-seam' },
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

  return (
    <div className="sidebar bg-dark text-white h-100">
      <ul className="nav flex-column">
        {menuItems[role]?.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;