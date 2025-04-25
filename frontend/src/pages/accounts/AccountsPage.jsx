import React, { useState } from 'react';
import Header from '../../components/common/Header';
import AccountTable from '../../components/tables/AccountTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCog, faUsers, faUserShield, faBoxOpen 
} from '@fortawesome/free-solid-svg-icons';
import './AccountsPage.css';

const AccountsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="accounts-page">
      <Header 
        title="Quản lý tài khoản" 
        actions={[]}  // Đã xóa các nút hành động ở header
        showActions={false}  // Tắt hiển thị phần hành động ở header
      />

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
  );
};

export default AccountsPage;