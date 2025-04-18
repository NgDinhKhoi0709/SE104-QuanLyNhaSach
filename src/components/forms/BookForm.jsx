import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBook,
  faBarcode,
  faUser,
  faBuilding,
  faTags,
  faDollarSign,
  faHashtag,
  faCalendar,
  faImage,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
// Chỉ import file Modals.css để tránh xung đột
import "../modals/Modals.css";
import { openModal, closeModal } from "../../utils/modalUtils";

const BookForm = ({ book, onSubmit, onClose, categories, authors, publishers }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    authorId: "",
    publisherId: "",
    categoryId: "",
    price: "",
    quantity: "",
    publicationYear: "",
    image: "",
    description: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        isbn: book.isbn || "",
        authorId: book.authorId || "",
        publisherId: book.publisherId || "",
        categoryId: book.categoryId || "",
        price: book.price || "",
        quantity: book.quantity || "",
        publicationYear: book.publicationYear || "",
        image: book.image || "",
        description: book.description || "",
        status: book.status || "active",
      });
    }
  }, [book]);

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
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sách";
    if (!formData.isbn.trim()) newErrors.isbn = "Vui lòng nhập ISBN";
    if (!formData.authorId) newErrors.authorId = "Vui lòng chọn tác giả";
    if (!formData.publisherId) newErrors.publisherId = "Vui lòng chọn nhà xuất bản";
    if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn thể loại";
    if (!formData.price) newErrors.price = "Vui lòng nhập giá";
    if (!formData.quantity) newErrors.quantity = "Vui lòng nhập số lượng";
    if (!formData.publicationYear) newErrors.publicationYear = "Vui lòng nhập năm xuất bản";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";

    // Validate ISBN format (13 digits)
    const isbnRegex = /^\d{13}$/;
    if (formData.isbn && !isbnRegex.test(formData.isbn)) {
      newErrors.isbn = "ISBN phải có 13 chữ số";
    }

    // Validate price (positive number)
    if (formData.price && (isNaN(formData.price) || formData.price <= 0)) {
      newErrors.price = "Giá phải là số dương";
    }

    // Validate quantity (positive integer)
    if (formData.quantity && (isNaN(formData.quantity) || formData.quantity <= 0 || !Number.isInteger(Number(formData.quantity)))) {
      newErrors.quantity = "Số lượng phải là số nguyên dương";
    }

    // Validate publication year (between 1900 and current year)
    const currentYear = new Date().getFullYear();
    if (formData.publicationYear && (isNaN(formData.publicationYear) || formData.publicationYear < 1900 || formData.publicationYear > currentYear)) {
      newErrors.publicationYear = `Năm xuất bản phải từ 1900 đến ${currentYear}`;
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
              <label htmlFor="isbn">
                <FontAwesomeIcon icon={faBarcode} style={{ marginRight: '8px', opacity: 0.7 }} />
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={errors.isbn ? "error" : ""}
                placeholder="Nhập mã ISBN (13 chữ số)"
              />
              {errors.isbn && <div className="error-message">{errors.isbn}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="authorId">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tác giả
              </label>
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className={errors.authorId ? "error" : ""}
              >
                <option value="">Chọn tác giả</option>
                {authors && authors.length > 0 ? (
                  authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Không có tác giả nào</option>
                )}
              </select>
              {errors.authorId && <div className="error-message">{errors.authorId}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="publisherId">
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', opacity: 0.7 }} />
                Nhà xuất bản
              </label>
              <select
                id="publisherId"
                name="publisherId"
                value={formData.publisherId}
                onChange={handleChange}
                className={errors.publisherId ? "error" : ""}
              >
                <option value="">Chọn nhà xuất bản</option>
                {publishers && publishers.length > 0 ? (
                  publishers.map((publisher) => (
                    <option key={publisher.id} value={publisher.id}>
                      {publisher.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Không có nhà xuất bản nào</option>
                )}
              </select>
              {errors.publisherId && <div className="error-message">{errors.publisherId}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">
                <FontAwesomeIcon icon={faTags} style={{ marginRight: '8px', opacity: 0.7 }} />
                Thể loại
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={errors.categoryId ? "error" : ""}
              >
                <option value="">Chọn thể loại</option>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Không có thể loại nào</option>
                )}
              </select>
              {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="price">
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px', opacity: 0.7 }} />
                Giá
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "error" : ""}
                placeholder="Nhập giá sách"
                min="0"
                step="1000"
              />
              {errors.price && <div className="error-message">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                <FontAwesomeIcon icon={faHashtag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Số lượng
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={errors.quantity ? "error" : ""}
                placeholder="Nhập số lượng"
                min="0"
              />
              {errors.quantity && <div className="error-message">{errors.quantity}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="publicationYear">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
                Năm xuất bản
              </label>
              <input
                type="number"
                id="publicationYear"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className={errors.publicationYear ? "error" : ""}
                placeholder="Nhập năm xuất bản"
                min="1900"
                max={new Date().getFullYear()}
              />
              {errors.publicationYear && <div className="error-message">{errors.publicationYear}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="image">
                <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px', opacity: 0.7 }} />
                Hình ảnh
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Nhập URL hình ảnh"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "error" : ""}
                rows="4"
                placeholder="Nhập mô tả sách"
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
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
              >
                <option value="active">Có sẵn</option>
                <option value="inactive">Hết hàng</option>
              </select>
              <div style={{ 
                fontSize: '13px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                {formData.status === 'active' 
                  ? 'Sách có sẵn để bán trong cửa hàng' 
                  : 'Sách không có sẵn để bán, đã hết hàng'}
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

  // Sử dụng React Portal để render ngoài DOM thông thường
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default BookForm;