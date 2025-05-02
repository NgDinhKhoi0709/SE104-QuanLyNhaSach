import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import './Sidebar.css';

const Sidebar = ({ menuItems }) => {
  const { hasPermission } = useAuthorization();
  const location = useLocation();

  // Determine the base path based on the current URL
  const basePath = location.pathname.startsWith('/admin')
    ? '/admin'
    : location.pathname.startsWith('/sales')
      ? '/sales'
      : location.pathname.startsWith('/inventory')
        ? '/inventory'
        : '';

  console.log("Sidebar rendering with base path:", basePath);
  console.log("Menu items:", menuItems);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Nhà Sách Cánh Diều" />
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={`${basePath}${item.path}`}
            className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
};

export default Sidebar;
