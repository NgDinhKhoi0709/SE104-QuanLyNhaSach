import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import './Sidebar.css';

const Sidebar = ({ menuItems }) => {
  const { hasPermission } = useAuthorization();

  // Lọc các menu item dựa trên quyền truy cập
  const filteredMenuItems = menuItems.filter(item => hasPermission(item.path));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Nhà Sách Cánh Diều" />
      </div>
      <nav className="sidebar-menu">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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