import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Header.css';

const Header = ({ title, userRole, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = (roleId) => {
    switch (roleId) {
      case 1: return 'Quản trị viên';
      case 2: return 'Nhân viên bán hàng';
      case 3: return 'Nhân viên thủ kho';
      default: return 'Người dùng';
    }
  };

  const displayRole = user ? getRoleLabel(user.role_id) : userRole || 'Người dùng';

  return (
    <header className={`header${sidebarCollapsed ? ' collapsed' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <div className="styled-title">
            <span className="title-main">{title}</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-logout">
            <div className="user-info">
              <div className="username">{user?.full_name || 'Người dùng'}</div>
              <div className="user-role">
                <FontAwesomeIcon icon={faIdBadge} className="role-icon" />
                <span className="role-label">{displayRole}</span>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;