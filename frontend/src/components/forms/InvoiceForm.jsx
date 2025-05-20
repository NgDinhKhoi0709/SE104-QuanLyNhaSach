import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, faFileInvoiceDollar, faUser, faCalendar, faDollarSign, 
  faPhone, faEnvelope, faMapMarkerAlt, faBook, faPlus, faTrash 
} from "@fortawesome/free-solid-svg-icons";
// Chỉ sử dụng Modals.css để tránh xung đột CSS
import "../modals/Modals.css";
import "./InvoiceForm.css";
import { openModal, closeModal } from "../../utils/modalUtils";
import { getAllBooks } from "../../services/bookService";

const InvoiceForm = ({ invoice, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    total_amount: "",
    discount_amount: "0",
    final_amount: "",
    promotion_code: "",
    created_by: "",
    created_at: "",
    bookDetails: [],
  });
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer_name: invoice.customer_name || "",
        customer_phone: invoice.customer_phone || "",
        total_amount: invoice.total_amount || "",
        discount_amount: invoice.discount_amount || "0",
        final_amount: invoice.final_amount || "",
        promotion_code: invoice.promotion_code || "",
        created_by: invoice.created_by || "",
        created_at: invoice.created_at || "",
        bookDetails: invoice.bookDetails || [],
      });
    } else {
      // Nếu thêm mới, set ngày lập hóa đơn mặc định là hôm nay và người lập là user đang đăng nhập
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('user'));
      } catch (e) {
        user = null;
      }
      setFormData(prev => ({
        ...prev,
        created_at: new Date().toISOString().slice(0, 10),
        created_by: user?.full_name || user?.username || user?.name || ""
      }));
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

  useEffect(() => {
    getAllBooks().then(setBooks);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = "Vui lòng nhập tên khách hàng";
    if (!formData.customer_phone.trim()) newErrors.customer_phone = "Vui lòng nhập số điện thoại";
    if (!formData.total_amount) newErrors.total_amount = "Vui lòng nhập tổng tiền";
    if (!formData.final_amount) newErrors.final_amount = "Vui lòng nhập thành tiền";

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
    if (formData.total_amount && (isNaN(formData.total_amount) || formData.total_amount <= 0)) {
      newErrors.total_amount = "Tổng tiền phải là số dương";
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
      bookDetails: [...prev.bookDetails, { book_id: "", quantity: 1, unit_price: 0 }]
    }));
  };

  const handleRemoveBook = (index) => {
    setFormData(prev => ({
      ...prev,
      bookDetails: prev.bookDetails.filter((_, i) => i !== index)
    }));
  };

  const handleBookDetailChange = (index, field, value) => {
    setFormData(prev => {
      const newDetails = prev.bookDetails.map((detail, i) => {
        if (i === index) {
          let updated = { ...detail, [field]: value };
          if (field === "book_id") {
            const book = books.find(b => b.id === parseInt(value));
            updated.unit_price = book ? book.price : 0;
          }
          return updated;
        }
        return detail;
      });
      return { ...prev, bookDetails: newDetails };
    });
  };

  // Auto tính tổng tiền
  useEffect(() => {
    const total = formData.bookDetails.reduce((sum, d) => sum + (d.quantity * d.unit_price), 0);
    // Set final_amount equal to total_amount since we're not allowing discounts
    setFormData(prev => ({ ...prev, total_amount: total, discount_amount: "0", final_amount: total }));
  }, [formData.bookDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const modalContent = (
    <div className="modal-backdrop">
      <div className="modal-content invoiceform-modal-content">
        <div className="modal-header">
          <h3 className="invoiceform-header-title">
            <FontAwesomeIcon 
              icon={faFileInvoiceDollar} 
              className="invoiceform-header-icon" 
            />
            {invoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="invoiceform-flex-row">
              <div className="invoiceform-flex-col invoiceform-flex-column">
                <div className="form-group">
                  <label htmlFor="customer_name">
                    <FontAwesomeIcon icon={faUser} className="invoiceform-icon" />
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className={errors.customer_name ? "error" : ""}
                    placeholder="Nhập tên khách hàng"
                  />
                  {errors.customer_name && <div className="error-message">{errors.customer_name}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="customer_phone">
                    <FontAwesomeIcon icon={faPhone} className="invoiceform-icon" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className={errors.customer_phone ? "error" : ""}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.customer_phone && <div className="error-message">{errors.customer_phone}</div>}
                </div>
              </div>
              <div className="invoiceform-flex-col invoiceform-flex-column">
                <div className="form-group">
                  <label htmlFor="created_by">
                    <FontAwesomeIcon icon={faUser} className="invoiceform-icon" />
                    Người lập
                  </label>
                  <input
                    type="text"
                    id="created_by"
                    name="created_by"
                    value={formData.created_by}
                    readOnly
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="created_at">
                    <FontAwesomeIcon icon={faCalendar} className="invoiceform-icon" />
                    Ngày lập hóa đơn
                  </label>
                  <input
                    type="date"
                    id="created_at"
                    name="created_at"
                    value={formData.created_at ? formData.created_at.slice(0, 10) : ''}
                    onChange={handleChange}
                    className={errors.created_at ? "error" : ""}
                    max={new Date().toISOString().split('T')[0]}
                    readOnly
                    disabled
                  />
                  {errors.created_at && <div className="error-message">{errors.created_at}</div>}
                </div>
              </div>
            </div>
            <div className="form-group invoiceform-group-margin-top">
              <div className="invoiceform-label-row">
                <label className="invoiceform-section-label">
                  <FontAwesomeIcon icon={faBook} className="invoiceform-icon" />
                  Danh sách sách
                </label>
                <button type="button" onClick={handleAddBook} className="save-button invoiceform-add-btn">
                  <FontAwesomeIcon icon={faPlus} /> Thêm sách
                </button>
              </div>
              <table className="invoiceform-table">
                <thead>
                  <tr className="invoiceform-table-header-row">
                    <th className="invoiceform-th-book">Tên sách</th>
                    <th className="invoiceform-th-qty">Số lượng</th>
                    <th className="invoiceform-th-price">Đơn giá</th>
                    <th className="invoiceform-th-total">Thành tiền</th>
                    <th className="invoiceform-th-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.bookDetails.map((detail, index) => {
                    const book = books.find(b => b.id === parseInt(detail.book_id));
                    const thanhTien = detail.quantity * detail.unit_price;
                    return (
                      <tr key={index}>
                        <td className="invoiceform-td-book">
                          <select
                            value={detail.book_id}
                            onChange={e => handleBookDetailChange(index, 'book_id', e.target.value)}
                            className="invoiceform-select"
                          >
                            <option value="">Chọn sách</option>
                            {books.map(book => (
                              <option key={book.id} value={book.id}>{book.title}</option>
                            ))}
                          </select>
                        </td>
                        <td className="invoiceform-td-qty">
                          <input
                            type="number"
                            value={detail.quantity}
                            min="1"
                            onChange={e => handleBookDetailChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="invoiceform-full-width"
                          />
                        </td>
                        <td className="invoiceform-td-price">
                          <input
                            type="number"
                            value={detail.unit_price}
                            min="0"
                            onChange={e => handleBookDetailChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            className="invoiceform-full-width"
                            readOnly
                          />
                        </td>
                        <td className="invoiceform-thanh-tien invoiceform-td-total">
                          {thanhTien.toLocaleString('vi-VN')} VNĐ
                        </td>
                        <td className="invoiceform-td-action">
                          <button type="button" onClick={() => handleRemoveBook(index)} className="invoiceform-remove-btn">
                            <FontAwesomeIcon icon={faTrash} className="fa-trash" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="invoiceform-summary">
              <div className="invoiceform-summary-box">
                <div className="invoiceform-summary-row">
                  <span>Tổng tiền:</span>
                  <span style={{ fontWeight: 600 }}>{Number(formData.total_amount).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="invoiceform-summary-row">
                  <span>Giảm giá:</span>
                  <span>{Number(formData.discount_amount).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="invoiceform-summary-final">
                  <span>Thành tiền:</span>
                  <span>{Number(formData.final_amount).toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            </div>
            <div className="form-actions invoiceform-actions-margin-top">
              <button
                type="button"
                className="cancel-button invoiceform-button"
                onClick={onClose}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="save-button invoiceform-button"
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