import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
      <nav>
        <ul className="sidebar-menu" style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={`${basePath}/${item.path}`} className="menu-item">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
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
