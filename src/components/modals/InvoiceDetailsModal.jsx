import React from 'react';
import './InvoiceDetailsModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InvoiceDetailsModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  // Kiểm tra cấu trúc dữ liệu của hóa đơn
  const hasBookDetails = invoice.bookDetails && Array.isArray(invoice.bookDetails);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Chi tiết hóa đơn #{invoice.invoiceCode}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="customer-info">
            <h3>Thông tin khách hàng</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Tên khách hàng:</label>
                <span>{invoice.customerName}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{invoice.phone}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{invoice.email}</span>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <span>{invoice.address}</span>
              </div>
              <div className="info-item">
                <label>Ngày mua:</label>
                <span>{invoice.date}</span>
              </div>
            </div>
          </div>

          <div className="order-details">
            <h3>Chi tiết đơn hàng</h3>
            {hasBookDetails ? (
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
                  {invoice.bookDetails.map((book, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{book.book}</td>
                      <td>{book.quantity}</td>
                      <td>{book.price}</td>
                      <td>{book.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="total-label">Tổng tiền:</td>
                    <td className="total-amount">{invoice.total}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="simple-book-details">
                <div className="info-item">
                  <label>Sách:</label>
                  <span>{invoice.books}</span>
                </div>
                <div className="info-item total-row">
                  <label>Tổng tiền:</label>
                  <span className="total-amount">{invoice.total}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;