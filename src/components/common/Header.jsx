import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = ({ title, actions }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        <div className="search-container">
          <span className="search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input type="text" placeholder="Tìm kiếm..." className="search-bar" />
        </div>
        
        <div className="header-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`header-action ${action.className}`}
              onClick={action.onClick}
            >
              <span className="action-icon">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
        
        <div className="user-logout">
          <span className="username">{user?.displayName || user?.username || 'Admin'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">⏏</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.node,
    })
  ).isRequired,
};

export default Header;