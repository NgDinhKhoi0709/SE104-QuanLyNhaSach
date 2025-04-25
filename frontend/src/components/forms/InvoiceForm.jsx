import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, faFileInvoiceDollar, faUser, faCalendar, faDollarSign, 
  faPhone, faEnvelope, faMapMarkerAlt, faBook, faPlus 
} from "@fortawesome/free-solid-svg-icons";
// Chỉ sử dụng Modals.css để tránh xung đột CSS
import "../modals/Modals.css";
import { openModal, closeModal } from "../../utils/modalUtils";

const InvoiceForm = ({ invoice, onSubmit, onClose, books }) => {
  const [formData, setFormData] = useState({
    invoiceCode: "",
    customerName: "",
    phone: "",
    address: "",
    email: "",
    date: "",
    bookDetails: [],
    total: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceCode: invoice.invoiceCode || "",
        customerName: invoice.customerName || "",
        phone: invoice.phone || "",
        address: invoice.address || "",
        email: invoice.email || "",
        date: invoice.date || "",
        bookDetails: invoice.bookDetails || [],
        total: invoice.total || "",
      });
    }
  }, [invoice]);

  useEffect(() => {
    // Khi form được mở, thêm class 'modal-open' vào body
    openModal();
    
    // Cleanup effect - khi component bị unmount
    return () => {
      closeModal();
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.invoiceCode.trim()) newErrors.invoiceCode = "Vui lòng nhập mã hóa đơn";
    if (!formData.customerName.trim()) newErrors.customerName = "Vui lòng nhập tên khách hàng";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!formData.date) newErrors.date = "Vui lòng chọn ngày hóa đơn";
    if (formData.bookDetails.length === 0) newErrors.bookDetails = "Vui lòng thêm ít nhất một sách";
    if (!formData.total) newErrors.total = "Vui lòng nhập tổng tiền";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate phone number format (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Validate total amount (positive number)
    if (formData.total && (isNaN(formData.total) || formData.total <= 0)) {
      newErrors.total = "Tổng tiền phải là số dương";
    }

    // Validate invoice date (not in the future)
    const today = new Date();
    const invoiceDate = new Date(formData.date);
    if (formData.date && invoiceDate > today) {
      newErrors.date = "Ngày hóa đơn không được lớn hơn ngày hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddBook = () => {
    setFormData(prev => ({
      ...prev,
      bookDetails: [...prev.bookDetails, { bookId: "", quantity: 1, price: "" }]
    }));
  };

  const handleRemoveBook = (index) => {
    setFormData(prev => ({
      ...prev,
      bookDetails: prev.bookDetails.filter((_, i) => i !== index)
    }));
  };

  const handleBookDetailChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bookDetails: prev.bookDetails.map((detail, i) => {
        if (i === index) {
          return { ...detail, [field]: value };
        }
        return detail;
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const modalContent = (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faFileInvoiceDollar} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {invoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="invoiceCode">
                <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mã hóa đơn
              </label>
              <input
                type="text"
                id="invoiceCode"
                name="invoiceCode"
                value={formData.invoiceCode}
                onChange={handleChange}
                className={errors.invoiceCode ? "error" : ""}
                placeholder="Nhập mã hóa đơn"
              />
              {errors.invoiceCode && <div className="error-message">{errors.invoiceCode}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="customerName">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tên khách hàng
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={errors.customerName ? "error" : ""}
                placeholder="Nhập tên khách hàng"
              />
              {errors.customerName && <div className="error-message">{errors.customerName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', opacity: 0.7 }} />
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "error" : ""}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', opacity: 0.7 }} />
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
                placeholder="Nhập địa chỉ"
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', opacity: 0.7 }} />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Nhập địa chỉ email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="date">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
                Ngày hóa đơn
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "error" : ""}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px', opacity: 0.7 }} />
                Danh sách sách
              </label>
              {formData.bookDetails.map((detail, index) => (
                <div key={index} className="book-detail-row">
                  <select
                    value={detail.bookId}
                    onChange={(e) => handleBookDetailChange(index, 'bookId', e.target.value)}
                    className={errors.bookDetails ? "error" : ""}
                  >
                    <option value="">Chọn sách</option>
                    {books && books.map(book => (
                      <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={detail.quantity}
                    onChange={(e) => handleBookDetailChange(index, 'quantity', e.target.value)}
                    placeholder="Số lượng"
                    min="1"
                  />
                  <input
                    type="number"
                    value={detail.price}
                    onChange={(e) => handleBookDetailChange(index, 'price', e.target.value)}
                    placeholder="Giá bán"
                    min="0"
                  />
                  <button type="button" onClick={() => handleRemoveBook(index)} className="btn btn-danger">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddBook} className="btn btn-secondary">
                <FontAwesomeIcon icon={faPlus} /> Thêm sách
              </button>
              {errors.bookDetails && <div className="error-message">{errors.bookDetails}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="total">
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tổng tiền
              </label>
              <input
                type="number"
                id="total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className={errors.total ? "error" : ""}
                placeholder="Nhập tổng tiền"
                min="0"
                step="1000"
              />
              {errors.total && <div className="error-message">{errors.total}</div>}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="save-button"
              >
                {invoice ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default InvoiceForm;