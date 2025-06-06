import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ menuItems, onCollapse }) => {
  const { hasPermission } = useAuthorization();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (onCollapse) onCollapse(collapsed);
  }, [collapsed, onCollapse]);

  // Determine the base path based on the current URL
  const basePath = location.pathname.startsWith('/admin')
    ? '/admin'
    : location.pathname.startsWith('/sales')
      ? '/sales'
      : location.pathname.startsWith('/inventory')
        ? '/inventory'
        : '';

  // Toggle sidebar collapse
  const handleToggle = () => setCollapsed((prev) => !prev);

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img src={logo} alt="Nhà Sách Cánh Diều" />
        <button
          className="sidebar-toggle-btn"
          onClick={handleToggle}
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>
      <nav>
        <ul className="sidebar-menu" style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={`${basePath}/${item.path}`} className="menu-item">
                <span className="menu-icon">{item.icon}</span>
                {!collapsed && <span className="menu-text">{item.label}</span>}
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
