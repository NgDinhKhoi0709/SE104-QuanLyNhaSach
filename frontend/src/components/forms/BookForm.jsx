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
  faCalendarAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../modals/Modals.css";
import "./BookForm.css";
import { openModal, closeModal } from "../../utils/modalUtils";

const BookForm = ({ book, onSubmit, onClose }) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 1900; y <= currentYear; y++) {
    years.push(y);
  }

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher_id: "",
    category_id: "",
    description: "",
    publicationYear: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        publisher_id: book.publisher_id || "",
        category_id: book.category_id || "",
        description: book.description || "",
        publicationYear: book.publicationYear || "",
        price: book.price || "",
      });
    }
  }, [book]);

  useEffect(() => {
    openModal();
    return () => {
      closeModal();
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/publishers");
        if (response.ok) {
          const data = await response.json();
          setPublishers(data);
        }
      } catch (error) {
        console.error("Error fetching publishers:", error);
      }
    };
    fetchPublishers();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sách";
    if (!formData.author.trim()) newErrors.author = "Vui lòng nhập tên tác giả";
    if (!formData.publisher_id) newErrors.publisher_id = "Vui lòng chọn nhà xuất bản";
    if (!formData.category_id) newErrors.category_id = "Vui lòng chọn thể loại";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
    if (!formData.price) newErrors.price = "Vui lòng nhập giá";

    // Validate price (positive number)
    const numericPrice = parseFloat(formData.price.replace(/,/g, ''));
    if (formData.price && (isNaN(numericPrice) || numericPrice < 0)) {
      newErrors.price = "Giá không được âm";
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
      // Map frontend keys to backend expected keys:
      const submissionData = {
        title: formData.title,
        author: formData.author,
        publisher_id: formData.publisher_id,     // already numeric from select
        category_id: formData.category_id,         // already numeric from select
        description: formData.description,
        publication_year: formData.publicationYear, // map to column name for publication year
        price: formData.price.replace(/,/g, ''),
        quantity_in_stock: book ? book.stock : 0 // Default to 0 if adding new
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
              className="book-icon"
            />
            {book ? "Chỉnh sửa đầu sách" : "Thêm đầu sách mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-columns">
              {/* Cột bên trái */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="title">
                    <FontAwesomeIcon icon={faBook} className="icon" />
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
                    <FontAwesomeIcon icon={faUser} className="icon" />
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
                  <label htmlFor="category_id">
                    <FontAwesomeIcon icon={faTags} className="icon" />
                    Thể loại
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={errors.category_id ? "error" : ""}
                  >
                    <option value="">Chọn thể loại</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <div className="error-message">{errors.category_id}</div>}
                </div>
              </div>

              {/* Cột bên phải */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="publisher_id">
                    <FontAwesomeIcon icon={faBuilding} className="icon" />
                    Nhà xuất bản
                  </label>
                  <select
                    id="publisher_id"
                    name="publisher_id"
                    value={formData.publisher_id}
                    onChange={handleChange}
                    className={errors.publisher_id ? "error" : ""}
                  >
                    <option value="">Chọn nhà xuất bản</option>
                    {publishers.map((pub) => (
                      <option key={pub.id} value={pub.id}>{pub.name}</option>
                    ))}
                  </select>
                  {errors.publisher_id && <div className="error-message">{errors.publisher_id}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="publicationYear">
                    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                    Năm xuất bản
                  </label>
                  <select
                    id="publicationYear"
                    name="publicationYear"
                    value={formData.publicationYear}
                    onChange={handleChange}
                    className={errors.publicationYear ? "error" : ""}
                  >
                    <option value="">Chọn năm xuất bản</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.publicationYear && <div className="error-message">{errors.publicationYear}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="price">
                    <FontAwesomeIcon icon={faDollarSign} className="icon" />
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
              </div>
            </div>

            {/* Mô tả - trải dài 2 bên */}
            <div className="form-group">
              <label htmlFor="description">
                <FontAwesomeIcon icon={faInfoCircle} className="icon" />
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