import React from 'react';
import './InvoiceDetailsModal.css'; // Sử dụng style chung với invoice modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ImportDetailsModal = ({ isOpen, onClose, importData }) => {
  if (!isOpen || !importData) return null;

  const formatCurrency = (value) => {
    // Format giá trị tiền tệ
    return value.toLocaleString() + " VNĐ";
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Chi tiết phiếu nhập #{importData.importCode}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="customer-info">
            <h3>Thông tin phiếu nhập</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Mã phiếu nhập:</label>
                <span>{importData.importCode}</span>
              </div>
              <div className="info-item">
                <label>Ngày nhập:</label>
                <span>{importData.date}</span>
              </div>
              <div className="info-item">
                <label>Nhà cung cấp:</label>
                <span>{importData.supplier}</span>
              </div>
              <div className="info-item">
                <label>Người nhập:</label>
                <span>{importData.employee || "Admin"}</span>
              </div>
            </div>
          </div>

          <div className="order-details">
            <h3>Chi tiết sách nhập</h3>
            <table className="details-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {importData.bookDetails.map((book, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{book.book}</td>
                    <td>{book.quantity}</td>
                    <td>{formatCurrency(book.price)}</td>
                    <td>{formatCurrency(book.price * book.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="total-label">Tổng tiền:</td>
                  <td className="total-amount">{formatCurrency(importData.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDetailsModal;