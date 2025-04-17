import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faTag,
  faPercent,
  faCalendar,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import "./PromotionForm.css";

const PromotionForm = ({ promotion, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name || "",
        discount: promotion.discount || "",
        startDate: promotion.startDate || "",
        endDate: promotion.endDate || "",
        description: promotion.description || "",
        status: promotion.status || "active",
      });
    }
  }, [promotion]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên khuyến mãi";
    if (!formData.discount) newErrors.discount = "Vui lòng nhập phần trăm giảm giá";
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";

    // Validate discount (between 0 and 100)
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = "Phần trăm giảm giá phải từ 0 đến 100";
    }

    // Validate dates
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (formData.startDate && startDate < today) {
      newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại";
    }

    if (formData.endDate && endDate < startDate) {
      newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
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
      <div className="form-modal-content promotion-form-modal">
        <div className="form-modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faTag} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </h3>
          <button className="form-close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal-body">
          <div className="form-group">
            <label htmlFor="name">
              <FontAwesomeIcon icon={faTag} />
              Tên khuyến mãi
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Nhập tên khuyến mãi"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="discount">
              <FontAwesomeIcon icon={faPercent} />
              Phần trăm giảm giá
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className={errors.discount ? "error" : ""}
              placeholder="Nhập phần trăm giảm giá"
              min="0"
              max="100"
              step="1"
            />
            {errors.discount && <span className="error-message">{errors.discount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">
              <FontAwesomeIcon icon={faCalendar} />
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "error" : ""}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              <FontAwesomeIcon icon={faCalendar} />
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? "error" : ""}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
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
              placeholder="Nhập mô tả khuyến mãi"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">
              <FontAwesomeIcon icon={faTag} />
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <div className="form-help-text">
              Trạng thái xác định xem khuyến mãi có đang được áp dụng hay không
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

export default PromotionForm;