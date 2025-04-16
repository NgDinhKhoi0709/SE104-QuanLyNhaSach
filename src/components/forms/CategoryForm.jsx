import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSave, 
  faTimes, 
  faBookOpen,
  faInfoCircle 
} from "@fortawesome/free-solid-svg-icons";
import "./CategoryForm.css";

const CategoryForm = ({ category, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "active",
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên thể loại";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";

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

  return (
    <div className="form-modal-backdrop">
      <div className="form-modal-content">
        <div className="form-modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faBookOpen} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {category ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
          </h3>
          <button className="form-close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal-body">
          <div className="form-group">
            <label htmlFor="name">
              <FontAwesomeIcon icon={faBookOpen} />
              Tên thể loại
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Nhập tên thể loại"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
              placeholder="Nhập mô tả thể loại"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">
              <FontAwesomeIcon icon={faBookOpen} />
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <div className="form-help-text">
              Trạng thái xác định xem thể loại có được hiển thị và sử dụng hay không
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
};

export default CategoryForm; 