import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBook,
  faUser,
  faBuilding,
  faTags,
  faDollarSign,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import "../modals/Modals.css";
import { openModal, closeModal } from "../../utils/modalUtils";

const BookForm = ({ book, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        publisher: book.publisher || "",
        category: book.category || "",
        price: book.price || "",
        stock: book.stock || "",
        status: book.status || "active",
      });
    }
  }, [book]);

  useEffect(() => {
    openModal();
    return () => {
      closeModal();
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sách";
    if (!formData.author.trim()) newErrors.author = "Vui lòng nhập tên tác giả";
    if (!formData.publisher.trim()) newErrors.publisher = "Vui lòng nhập nhà xuất bản";
    if (!formData.category.trim()) newErrors.category = "Vui lòng nhập thể loại";
    if (!formData.price) newErrors.price = "Vui lòng nhập giá";
    if (!formData.stock) newErrors.stock = "Vui lòng nhập số lượng tồn kho";

    // Validate price (positive number)
    const numericPrice = parseFloat(formData.price.replace(/,/g, ''));
    if (formData.price && (isNaN(numericPrice) || numericPrice < 0)) {
      newErrors.price = "Giá không được âm";
    }

    // Validate stock (positive integer)
    const numericStock = parseInt(formData.stock);
    if (formData.stock && (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock))) {
      newErrors.stock = "Số lượng tồn kho phải là số nguyên không âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Remove existing commas and format with new ones
      const numericValue = value.replace(/,/g, '');
      if ((!isNaN(numericValue) && parseFloat(numericValue) >= 0) || numericValue === '') {
        const formattedValue = numericValue === '' ? '' : 
          Number(numericValue).toLocaleString('en-US', {
            maximumFractionDigits: 0,
            useGrouping: true
          });
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      }
    } else if (name === 'stock') {
      // Only allow non-negative integers for stock
      if ((!isNaN(value) && parseInt(value) >= 0) || value === '') {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Remove commas from price and ensure all fields are properly formatted
      const submissionData = {
        ...formData,
        price: formData.price.replace(/,/g, ''),
        status: formData.status || 'active' // Ensure status is always set
      };
      onSubmit(submissionData);
    }
  };

  const modalContent = (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faBook} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {book ? "Chỉnh sửa sách" : "Thêm sách mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="title">
                <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tên sách
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "error" : ""}
                placeholder="Nhập tên sách"
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="author">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tác giả
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? "error" : ""}
                placeholder="Nhập tên tác giả"
              />
              {errors.author && <div className="error-message">{errors.author}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                <FontAwesomeIcon icon={faTags} style={{ marginRight: '8px', opacity: 0.7 }} />
                Thể loại
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "error" : ""}
                placeholder="Nhập thể loại"
              />
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="publisher">
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', opacity: 0.7 }} />
                Nhà xuất bản
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className={errors.publisher ? "error" : ""}
                placeholder="Nhập tên nhà xuất bản"
              />
              {errors.publisher && <div className="error-message">{errors.publisher}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="price">
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px', opacity: 0.7 }} />
                Giá bán
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "error" : ""}
                placeholder="Nhập giá bán"
                min="0"
              />
              {errors.price && <div className="error-message">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                <FontAwesomeIcon icon={faHashtag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Số lượng tồn kho
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? "error" : ""}
                placeholder="Nhập số lượng tồn kho"
                min="0"
              />
              {errors.stock && <div className="error-message">{errors.stock}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="status">
                <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px', opacity: 0.7 }} />
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="status-select"
              >
                <option value="active">Còn hàng</option>
                <option value="inactive">Hết hàng</option>
              </select>
              <div style={{ 
                fontSize: '13px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                {formData.status === 'active' 
                  ? 'Sách đang được bán và hiển thị trong hệ thống' 
                  : 'Sách tạm ngừng bán và không hiển thị trong hệ thống'}
              </div>
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
                {book ? "Cập nhật" : "Thêm sách"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default BookForm;