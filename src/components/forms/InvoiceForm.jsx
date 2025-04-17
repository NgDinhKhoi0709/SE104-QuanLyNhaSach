import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faReceipt,
  faUser,
  faCalendar,
  faDollarSign,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import "./InvoiceForm.css";

const InvoiceForm = ({ invoice, onSubmit, onClose, customers }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceDate: "",
    totalAmount: "",
    description: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId || "",
        invoiceDate: invoice.invoiceDate || "",
        totalAmount: invoice.totalAmount || "",
        description: invoice.description || "",
        status: invoice.status || "pending",
      });
    }
  }, [invoice]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerId) newErrors.customerId = "Vui lòng chọn khách hàng";
    if (!formData.invoiceDate) newErrors.invoiceDate = "Vui lòng chọn ngày hóa đơn";
    if (!formData.totalAmount) newErrors.totalAmount = "Vui lòng nhập tổng tiền";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";

    // Validate total amount (positive number)
    if (formData.totalAmount && (isNaN(formData.totalAmount) || formData.totalAmount <= 0)) {
      newErrors.totalAmount = "Tổng tiền phải là số dương";
    }

    // Validate invoice date (not in the future)
    const today = new Date();
    const invoiceDate = new Date(formData.invoiceDate);
    if (formData.invoiceDate && invoiceDate > today) {
      newErrors.invoiceDate = "Ngày hóa đơn không được lớn hơn ngày hiện tại";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const modalContent = (
    <div className="form-modal-backdrop">
      <div className="form-modal-content invoice-form-modal">
        <div className="form-modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faReceipt} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {invoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn mới"}
          </h3>
          <button className="form-close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal-body">
          <div className="form-group">
            <label htmlFor="customerId">
              <FontAwesomeIcon icon={faUser} />
              Khách hàng
            </label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className={errors.customerId ? "error" : ""}
            >
              <option value="">Chọn khách hàng</option>
              {customers && customers.length > 0 ? (
                customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Không có khách hàng nào</option>
              )}
            </select>
            {errors.customerId && <span className="error-message">{errors.customerId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="invoiceDate">
              <FontAwesomeIcon icon={faCalendar} />
              Ngày hóa đơn
            </label>
            <input
              type="date"
              id="invoiceDate"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className={errors.invoiceDate ? "error" : ""}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.invoiceDate && <span className="error-message">{errors.invoiceDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="totalAmount">
              <FontAwesomeIcon icon={faDollarSign} />
              Tổng tiền
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className={errors.totalAmount ? "error" : ""}
              placeholder="Nhập tổng tiền"
              min="0"
              step="1000"
            />
            {errors.totalAmount && <span className="error-message">{errors.totalAmount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <FontAwesomeIcon icon={faInfoCircle} />
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              rows="4"
              placeholder="Nhập mô tả hóa đơn"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">
              <FontAwesomeIcon icon={faReceipt} />
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Đang chờ</option>
              <option value="paid">Đã thanh toán</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <div className="form-help-text">
              Trạng thái xác định tình trạng thanh toán của hóa đơn
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="form-button form-button-cancel" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
              Hủy
            </button>
            <button type="submit" className="form-button form-button-save">
              <FontAwesomeIcon icon={faSave} />
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default InvoiceForm;