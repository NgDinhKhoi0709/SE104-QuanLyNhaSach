import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, parseCurrency } from '../../utils/format';
import "./BookForm.css";

const InvoiceForm = ({ invoice, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    book: "",
    quantity: "",
    price: "",
    total: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        date: invoice.date || "",
        customer: invoice.customer || "",
        book: invoice.book || "",
        quantity: invoice.quantity || "",
        price: invoice.price ? formatCurrency(invoice.price) : "",
        total: invoice.total ? formatCurrency(invoice.total) : "",
      });
    }
  }, [invoice]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date.trim()) newErrors.date = "Vui lòng chọn ngày bán";
    if (!formData.customer.trim()) newErrors.customer = "Vui lòng chọn khách hàng";
    if (!formData.book.trim()) newErrors.book = "Vui lòng chọn sách";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Vui lòng nhập số lượng hợp lệ";
    if (!formData.price || parseCurrency(formData.price) <= 0)
      newErrors.price = "Vui lòng nhập đơn giá hợp lệ";
    if (!formData.total || parseCurrency(formData.total) <= 0)
      newErrors.total = "Vui lòng nhập tổng tiền hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'total') {
      const numericValue = value.replace(/[^\d]/g, '');
      if (numericValue === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        const formattedValue = formatCurrency(numericValue);
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        price: parseCurrency(formData.price),
        total: parseCurrency(formData.total)
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="form-container">
      <h2>{invoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Ngày bán *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? "error" : ""}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="customer">Khách hàng *</label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className={errors.customer ? "error" : ""}
          />
          {errors.customer && <span className="error-message">{errors.customer}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="book">Sách *</label>
          <input
            type="text"
            id="book"
            name="book"
            value={formData.book}
            onChange={handleChange}
            className={errors.book ? "error" : ""}
          />
          {errors.book && <span className="error-message">{errors.book}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Số lượng *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className={errors.quantity ? "error" : ""}
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Đơn giá *</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Nhập số tiền"
            className={errors.price ? "error" : ""}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="total">Tổng tiền *</label>
          <input
            type="text"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Nhập số tiền"
            className={errors.total ? "error" : ""}
          />
          {errors.total && <span className="error-message">{errors.total}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save">
            <FontAwesomeIcon icon={faSave} /> Lưu
          </button>
          <button type="button" className="btn btn-cancel" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} /> Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm; 