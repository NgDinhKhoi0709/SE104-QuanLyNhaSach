import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPencilAlt, faTrash, faUserPlus, 
  faKey, faLock, faLockOpen, faSearch,
  faExclamationCircle, faCheckCircle, faEye, faUser
} from "@fortawesome/free-solid-svg-icons";
import accountService from "../../services/accountService";
import AccountForm from "../modals/AccountForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "../../pages/accounts/AccountsPage.css";

const AccountTable = ({ initialFilterRole = 'all' }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', id: null });
  const [resetPasswordResult, setResetPasswordResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState(initialFilterRole);
  
  // Cập nhật filterRole khi có thay đổi từ tab trên đầu trang
  useEffect(() => {
    setFilterRole(initialFilterRole);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
  }, [initialFilterRole]);
  
  // Phân trang
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  
  // Lọc tài khoản theo vai trò và từ khóa tìm kiếm
  const filteredAccounts = accounts.filter(account => {
    const matchesRole = filterRole === 'all' ? true : account.role === filterRole;
    const matchesSearch = searchTerm === '' ? true : 
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.phone.includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  const currentAccounts = filteredAccounts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAccounts.length / recordsPerPage);

  // Lấy danh sách tài khoản khi component được mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Lấy danh sách tài khoản từ service
  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Không thể tải danh sách tài khoản');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all items across all pages are selected
  const areAllItemsSelected = filteredAccounts.length > 0 && 
    filteredAccounts.every(account => selectedRows.includes(account.id));

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredAccounts.map(account => account.id));
    }
  };

  // Xử lý chọn/bỏ chọn một hàng
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => {
      return prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id];
    });
  };

  // Xử lý phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý mở form thêm tài khoản mới
  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsAccountFormOpen(true);
  };

  // Xử lý mở form chỉnh sửa tài khoản
  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setIsAccountFormOpen(true);
  };

  // Xử lý hiển thị modal xác nhận xóa tài khoản
  const handleDeleteAccount = (id) => {
    setConfirmAction({ type: 'delete', id });
    setIsConfirmModalOpen(true);
  };

  // Xử lý hiển thị modal xác nhận đặt lại mật khẩu
  const handleResetPassword = (id) => {
    setConfirmAction({ type: 'resetPassword', id });
    setIsConfirmModalOpen(true);
  };

  // Xử lý hiển thị modal xác nhận thay đổi trạng thái tài khoản
  const handleToggleStatus = (id, currentStatus) => {
    setConfirmAction({ 
      type: 'toggleStatus', 
      id,
      additionalInfo: currentStatus === 'active' ? 'inactive' : 'active'
    });
    setIsConfirmModalOpen(true);
  };

  // Xử lý xác nhận hành động
  const handleConfirmAction = async () => {
    setIsConfirmModalOpen(false);
    
    switch (confirmAction.type) {
      case 'delete':
        try {
          await accountService.deleteAccount(confirmAction.id);
          setAccounts(accounts.filter(acc => acc.id !== confirmAction.id));
          setSelectedRows(selectedRows.filter(id => id !== confirmAction.id));
        } catch (error) {
          setError('Không thể xóa tài khoản');
        }
        break;
        
      case 'resetPassword':
        try {
          const result = await accountService.resetPassword(confirmAction.id);
          setResetPasswordResult(result);
          // Hiển thị kết quả reset password trong một thời gian ngắn
          setTimeout(() => {
            setResetPasswordResult(null);
          }, 10000); // Hiển thị trong 10 giây
        } catch (error) {
          setError('Không thể đặt lại mật khẩu');
        }
        break;
        
      case 'toggleStatus':
        try {
          const updatedAccount = await accountService.toggleAccountStatus(confirmAction.id);
          setAccounts(accounts.map(acc => 
            acc.id === confirmAction.id ? updatedAccount : acc
          ));
        } catch (error) {
          setError('Không thể thay đổi trạng thái tài khoản');
        }
        break;
        
      default:
        break;
    }
  };

  // Xử lý sự kiện lưu form tài khoản
  const handleAccountFormSave = async (account) => {
    try {
      let result;
      
      if (selectedAccount) {
        // Cập nhật tài khoản hiện có
        result = await accountService.updateAccount(selectedAccount.id, account);
        setAccounts(accounts.map(acc => 
          acc.id === selectedAccount.id ? result : acc
        ));
      } else {
        // Thêm tài khoản mới
        result = await accountService.createAccount(account);
        setAccounts([...accounts, result]);
      }
      
      setIsAccountFormOpen(false);
    } catch (error) {
      setError('Không thể lưu thông tin tài khoản');
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    try {
      if (searchTerm.trim()) {
        const results = await accountService.searchAccounts(searchTerm);
        setAccounts(results);
      } else {
        fetchAccounts();
      }
    } catch (error) {
      setError('Không thể tìm kiếm tài khoản');
    }
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Lấy tên hiển thị của vai trò
  const getRoleName = (role) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'sales': return 'Nhân viên bán hàng';
      case 'warehouse': return 'Nhân viên thủ kho';
      default: return role;
    }
  };

  // Lấy icon cho vai trò
  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return faUser;
      case 'sales': return faUser;
      case 'warehouse': return faUser;
      default: return faUser;
    }
  };

  return (
    <>
      {error && (
        <div className="message-container error-message">
          <FontAwesomeIcon icon={faExclamationCircle} className="message-icon" />
          <div className="message-content">
            <div className="message-title">Lỗi</div>
            <div className="message-text">{error}</div>
          </div>
        </div>
      )}
      
      {resetPasswordResult && (
        <div className="message-container success-message">
          <FontAwesomeIcon icon={faCheckCircle} className="message-icon" />
          <div className="message-content">
            <div className="message-title">Đặt lại mật khẩu thành công</div>
            <div className="message-text">
              <strong>Mật khẩu mặc định:</strong> {resetPasswordResult.defaultPassword}
            </div>
            <div className="message-note">Thông tin này sẽ tự động ẩn sau 10 giây</div>
          </div>
        </div>
      )}
      
      {/* Thanh công cụ */}
      <div className="data-tools">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          
          {/* Đã loại bỏ filter vai trò vì đã có tab lọc ở trên đầu trang */}
        </div>
        
        <button onClick={handleAddAccount} className="add-button">
          <FontAwesomeIcon icon={faUserPlus} />
          Thêm tài khoản
        </button>
      </div>

      {/* Bảng danh sách tài khoản */}
      <div className="table-container">
        <table className="data-table account-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={areAllItemsSelected}
                  onChange={handleSelectAllToggle}
                  title={areAllItemsSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                />
                {areAllItemsSelected && filteredAccounts.length > currentAccounts.length && (
                  <span className="select-all-indicator" title="Đã chọn tất cả các trang">
                    (tất cả)
                  </span>
                )}
              </th>
              <th>Tên đăng nhập</th>
              <th>Họ và tên</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Đăng nhập gần nhất</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  <div className="loading-spinner"></div>
                  <p>Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : currentAccounts.length > 0 ? (
              currentAccounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(account.id)}
                      onChange={() => toggleRowSelection(account.id)}
                    />
                  </td>
                  <td>{account.username}</td>
                  <td>{account.fullName}</td>
                  <td>
                    <div>{account.email}</div>
                    <div style={{ color: "#666", fontSize: "13px" }}>{account.phone}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FontAwesomeIcon 
                        icon={getRoleIcon(account.role)} 
                        style={{ 
                          color: account.role === 'admin' ? "#095e5a" : 
                                 account.role === 'sales' ? "#fd7e14" : "#0d6efd" 
                        }} 
                      />
                      <span>{getRoleName(account.role)}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${account.status}`}
                    >
                      {account.status === "active" ? "Kích hoạt" : "Khóa"}
                    </span>
                  </td>
                  <td>{account.createdAt}</td>
                  <td>{account.lastLogin}</td>
                  <td className="actions">
                    <button
                      className="action-button edit-button"
                      title="Sửa thông tin"
                      onClick={() => handleEditAccount(account)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    
                    <button
                      className="action-button reset-password-button"
                      title="Đặt lại mật khẩu"
                      onClick={() => handleResetPassword(account.id)}
                    >
                      <FontAwesomeIcon icon={faKey} />
                    </button>
                    
                    <button
                      className={`action-button ${account.status === 'active' ? 'lock-button' : 'unlock-button'}`}
                      title={account.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      onClick={() => handleToggleStatus(account.id, account.status)}
                    >
                      <FontAwesomeIcon icon={account.status === 'active' ? faLock : faLockOpen} />
                    </button>
                    
                    <button
                      className="action-button delete-button"
                      title="Xóa"
                      onClick={() => handleDeleteAccount(account.id)}
                      disabled={account.role === 'admin' && accounts.filter(acc => acc.role === 'admin').length === 1}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {!isLoading && filteredAccounts.length > 0 && (
        <div className="pagination">
          {areAllItemsSelected && filteredAccounts.length > currentAccounts.length && (
            <div className="all-pages-selected-info">
              Đã chọn tất cả {filteredAccounts.length} mục trên {totalPages} trang
            </div>
          )}
          <div className="pagination-info">
            Hiển thị {indexOfFirstRecord + 1} đến{" "}
            {Math.min(indexOfLastRecord, filteredAccounts.length)} của{" "}
            {filteredAccounts.length} mục
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`pagination-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Form thêm/sửa tài khoản */}
      {isAccountFormOpen && (
        <AccountForm
          account={selectedAccount}
          onSave={handleAccountFormSave}
          onCancel={() => setIsAccountFormOpen(false)}
        />
      )}

      {/* Modal xác nhận */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmAction}
          title={
            confirmAction.type === 'delete'
              ? 'Xác nhận xóa tài khoản'
              : confirmAction.type === 'resetPassword'
              ? 'Xác nhận đặt lại mật khẩu'
              : 'Xác nhận thay đổi trạng thái'
          }
          message={
            confirmAction.type === 'delete'
              ? 'Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.'
              : confirmAction.type === 'resetPassword'
              ? 'Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này? Người dùng sẽ nhận được mật khẩu mới.'
              : confirmAction.additionalInfo === 'active'
              ? 'Bạn có chắc chắn muốn kích hoạt tài khoản này?'
              : 'Bạn có chắc chắn muốn khóa tài khoản này?'
          }
        />
      )}
    </>
  );
};

export default AccountTable;