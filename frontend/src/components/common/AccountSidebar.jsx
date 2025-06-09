import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faKey,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import "./AccountSidebar.css";

const menu = [
  { key: 'profile', label: 'Thông tin cá nhân', icon: faUserCircle },
  { key: 'changepass', label: 'Đổi mật khẩu', icon: faKey },
  { key: 'logout', label: 'Đăng xuất', icon: faSignOutAlt }
];

const AccountSidebar = ({ activeKey, onMenuClick }) => (
  <div className="account-sidebar">
    <div className="account-sidebar-logo">
      Tài khoản
    </div>
    <div className="account-sidebar-menu">
      {menu.map(item => (
        <div
          key={item.key}
          className={
            "account-sidebar-menu-item" +
            (activeKey === item.key ? " active" : "")
          }
          onClick={() => onMenuClick?.(item.key)}
        >
          <span className="icon"><FontAwesomeIcon icon={item.icon} /></span>
          {item.label}
        </div>
      ))}
    </div>
    <div className="account-sidebar-footer">
      &copy; 2024 Nhà Sách Nhóm 7
    </div>
  </div>
);

export default AccountSidebar;
