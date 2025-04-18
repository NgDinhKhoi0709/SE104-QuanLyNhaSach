import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserShield, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import './Header.css';

const Header = ({ title, actions, showActions = true }) => {
  const { user, logout } = useAuth();
  const { getRoleLabel } = useAuthorization();
  
  const handleLogout = () => {
    logout();
  };

  // Lấy icon phù hợp với vai trò
  const getRoleIcon = () => {
    if (!user || !user.role) return <FontAwesomeIcon icon={faUser} />;
    
    switch(user.role) {
      case 'ADMIN':
        return <FontAwesomeIcon icon={faUserShield} />;
      default:
        return <FontAwesomeIcon icon={faUser} />;
    }
  };

  // Hàm tạo kiểu cho tiêu đề đẹp mắt hơn
  const renderStyledTitle = () => {
    // List các route cần hiển thị title với style đẹp
    const managementRoutes = [
      "Quản lý đầu sách", 
      "Quản lý thể loại sách", 
      "Quản lý nhà xuất bản",
      "Quản lý nhập sách",
      "Quản lý nhà cung cấp",
      "Quản lý hóa đơn",
      "Quản lý khuyến mãi"
    ];

    // Nếu tiêu đề là một trong những route quản lý, áp dụng style đẹp
    if (managementRoutes.includes(title)) {
      const mainText = title.replace("Quản lý ", "");
      return (
        <div className="styled-title">
          <span className="title-prefix">Quản lý</span>
          
          <span className="title-main">{mainText.toUpperCase()}</span> 
        </div>
      );
    }
    
    // Với các route khác (Báo cáo, Thay đổi quy định, Tài khoản), áp dụng style khác
    return (
      <div className="styled-title">
        <span className="title-main special">{title}</span>
      </div>
    );
  };

  return (
    <header className="header">
      <div className="header-left">
        {renderStyledTitle()}
      </div>
      <div className="header-right">
        {showActions && (
          <div className="header-actions">
            {actions && actions.map((action, index) => (
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
        )}
        
        <div className="user-logout">
          <div className="user-info">
            <span className="username">{user?.displayName || user?.username || 'Admin'}</span>
            <div className="user-role">
              <span className="role-icon">{getRoleIcon()}</span>
              <span className="role-label">{getRoleLabel()}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
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
  ),
  showActions: PropTypes.bool
};

Header.defaultProps = {
  actions: [],
  showActions: true
};

export default Header;