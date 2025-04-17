import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faBuilding,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import "./PublisherForm.css";

const PublisherForm = ({ publisher, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (publisher) {
      setFormData({
        name: publisher.name || "",
        phone: publisher.phone || "",
        email: publisher.email || "",
        address: publisher.address || "",
        description: publisher.description || "",
        status: publisher.status || "active",
      });
    }
  }, [publisher]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên nhà xuất bản";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";

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
      <div className="form-modal-content publisher-form-modal">
        <div className="form-modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faBuilding} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {publisher ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản mới"}
          </h3>
          <button className="form-close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal-body">
          <div className="form-group">
            <label htmlFor="name">
              <FontAwesomeIcon icon={faBuilding} />
              Tên nhà xuất bản
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Nhập tên nhà xuất bản"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FontAwesomeIcon icon={faPhone} />
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
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} />
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
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
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
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
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
              placeholder="Nhập mô tả về nhà xuất bản"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">
              <FontAwesomeIcon icon={faBuilding} />
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
              Trạng thái xác định xem nhà xuất bản có đang hoạt động hay không
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

export default PublisherForm;