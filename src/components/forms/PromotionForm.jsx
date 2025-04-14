import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./BookForm.css";

const PromotionForm = ({ promotion, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discount: '',
    startDate: '',
    endDate: '',
    condition: '',
    status: 'upcoming'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name || '',
        code: promotion.code || '',
        discount: promotion.discount || '',
        startDate: promotion.startDate || '',
        endDate: promotion.endDate || '',
        condition: promotion.condition || '',
        status: promotion.status || 'upcoming'
      });
    }
  }, [promotion]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên chương trình";
    if (!formData.code.trim()) newErrors.code = "Vui lòng nhập mã khuyến mãi";
    if (!formData.discount || formData.discount < 0 || formData.discount > 100)
      newErrors.discount = "Vui lòng nhập mức giảm giá hợp lệ (0-100%)";
    if (!formData.startDate.trim()) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate.trim()) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (!formData.condition.trim()) newErrors.condition = "Vui lòng nhập điều kiện áp dụng";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
    <div className="form-container">
      <h2>{promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên chương trình *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="code">Mã khuyến mãi *</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={errors.code ? "error" : ""}
          />
          {errors.code && <span className="error-message">{errors.code}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="discount">Mức giảm giá (%) *</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            className={errors.discount ? "error" : ""}
          />
          {errors.discount && <span className="error-message">{errors.discount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Ngày bắt đầu *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? "error" : ""}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Ngày kết thúc *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? "error" : ""}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="condition">Điều kiện áp dụng *</label>
          <input
            type="text"
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className={errors.condition ? "error" : ""}
          />
          {errors.condition && <span className="error-message">{errors.condition}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="upcoming">Sắp diễn ra</option>
            <option value="active">Đang diễn ra</option>
            <option value="expired">Đã kết thúc</option>
          </select>
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

export default PromotionForm; 