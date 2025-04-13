import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./BookForm.css";

const BookForm = ({ book, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    publisher: "",
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
        category: book.category || "",
        publisher: book.publisher || "",
        price: book.price ? book.price.replace(/[^\d]/g, "") : "",
        stock: book.stock || "",
        status: book.status || "active",
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sách";
    if (!formData.author.trim()) newErrors.author = "Vui lòng nhập tác giả";
    if (!formData.category.trim()) newErrors.category = "Vui lòng chọn thể loại";
    if (!formData.publisher.trim()) newErrors.publisher = "Vui lòng chọn nhà xuất bản";
    if (!formData.price) newErrors.price = "Vui lòng nhập giá bán";
    if (formData.stock === "") newErrors.stock = "Vui lòng nhập số lượng tồn kho";
    if (formData.stock < 0) newErrors.stock = "Số lượng tồn kho không được âm";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPrice = (value) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, "");
    
    // Format with thousand separators
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "price") {
      newValue = formatPrice(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
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
      // Format final price with currency symbol
      const finalPrice = formData.price ? `${formData.price} ₫` : "";
      onSubmit({
        ...formData,
        price: finalPrice,
      });
    }
  };

  return (
    <div className="form-container">
      <h2>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tên sách *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Tác giả *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={errors.author ? "error" : ""}
          />
          {errors.author && <span className="error-message">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Thể loại *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "error" : ""}
          >
            <option value="">Chọn thể loại</option>
            <option value="Tiểu thuyết">Tiểu thuyết</option>
            <option value="Kỹ năng sống">Kỹ năng sống</option>
            <option value="Kinh tế">Kinh tế</option>
            <option value="Tâm lý học">Tâm lý học</option>
            <option value="Lịch sử">Lịch sử</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="publisher">Nhà xuất bản *</label>
          <select
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className={errors.publisher ? "error" : ""}
          >
            <option value="">Chọn nhà xuất bản</option>
            <option value="NXB Trẻ">NXB Trẻ</option>
            <option value="NXB Văn Học">NXB Văn Học</option>
            <option value="NXB Tổng hợp">NXB Tổng hợp</option>
            <option value="NXB Lao Động">NXB Lao Động</option>
            <option value="NXB Hội Nhà Văn">NXB Hội Nhà Văn</option>
          </select>
          {errors.publisher && <span className="error-message">{errors.publisher}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá bán *</label>
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
          <label htmlFor="stock">Tồn kho *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={errors.stock ? "error" : ""}
          />
          {errors.stock && <span className="error-message">{errors.stock}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Còn hàng</option>
            <option value="inactive">Hết hàng</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} /> Hủy
          </button>
          <button type="submit" className="btn btn-save">
            <FontAwesomeIcon icon={faSave} /> Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm; 