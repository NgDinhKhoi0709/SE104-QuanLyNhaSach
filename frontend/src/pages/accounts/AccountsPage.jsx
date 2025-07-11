import React, { useState } from 'react';
import Header from '../../components/common/Header';
import AccountTable from '../../components/tables/AccountTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCog, faUsers, faUserShield, faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import './AccountsPage.css';

const AccountsPage = ({ sidebarCollapsed = false }) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="accounts-page">
      <Header
        title="Quản lý tài khoản"
        showActions={false}
        userRole="Quản trị viên"
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Thêm wrapper để căn giữa và tránh tràn */}
      <div className="account-content-wrapper">
        <div className="account-content">
          {/* Tab điều hướng phụ */}
          <div className="account-tabs">
            <button
              className={`account-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>Tất cả tài khoản</span>
            </button>
            <button
              className={`account-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <FontAwesomeIcon icon={faUserShield} />
              <span>Quản trị viên</span>
            </button>
            <button
              className={`account-tab ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              <FontAwesomeIcon icon={faUserCog} />
              <span>Nhân viên bán hàng</span>
            </button>
            <button
              className={`account-tab ${activeTab === 'warehouse' ? 'active' : ''}`}
              onClick={() => setActiveTab('warehouse')}
            >
              <FontAwesomeIcon icon={faBoxOpen} />
              <span>Nhân viên thủ kho</span>
            </button>
          </div>

          {/* Bảng dữ liệu */}
          <AccountTable initialFilterRole={activeTab !== 'all' ? activeTab : 'all'} />
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;