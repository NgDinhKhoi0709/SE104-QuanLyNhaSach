import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTag, faCalendar, faPercent, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
// Chỉ sử dụng Modals.css để tránh xung đột CSS
import "../modals/Modals.css";
import { openModal, closeModal } from "../../utils/modalUtils";

const PromotionForm = ({ promotion, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    promotionCode: "",
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
    conditions: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promotion) {
      setFormData({
        promotionCode: promotion.promotionCode || "",
        name: promotion.name || "",
        discount: promotion.discount || "",
        startDate: promotion.startDate || "",
        endDate: promotion.endDate || "",
        conditions: promotion.conditions || "",
        status: promotion.status || "active",
      });
    }
  }, [promotion]);

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
    if (!formData.promotionCode.trim()) newErrors.promotionCode = "Vui lòng nhập mã khuyến mãi";
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên chương trình";
    if (!formData.discount) newErrors.discount = "Vui lòng nhập mức giảm giá";
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (!formData.conditions.trim()) newErrors.conditions = "Vui lòng nhập điều kiện áp dụng";

    // Validate discount (between 0 and 100)
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = "Mức giảm giá phải từ 0 đến 100";
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
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
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
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="promotionCode">
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mã khuyến mãi
              </label>
              <input
                type="text"
                id="promotionCode"
                name="promotionCode"
                value={formData.promotionCode}
                onChange={handleChange}
                className={errors.promotionCode ? "error" : ""}
                placeholder="Nhập mã khuyến mãi"
              />
              {errors.promotionCode && <div className="error-message">{errors.promotionCode}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="name">
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tên chương trình
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                placeholder="Nhập tên chương trình"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="discount">
                <FontAwesomeIcon icon={faPercent} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mức giảm giá (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={errors.discount ? "error" : ""}
                placeholder="Nhập mức giảm giá"
                min="0"
                max="100"
                step="1"
              />
              {errors.discount && <div className="error-message">{errors.discount}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="conditions">
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', opacity: 0.7 }} />
                Điều kiện áp dụng
              </label>
              <textarea
                id="conditions"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                className={errors.conditions ? "error" : ""}
                rows="3"
                placeholder="Nhập điều kiện áp dụng khuyến mãi"
              />
              {errors.conditions && <div className="error-message">{errors.conditions}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="status">
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="status-select"
              >
                <option value="active">Đang diễn ra</option>
                <option value="inactive">Đã dừng</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="expired">Đã kết thúc</option>
              </select>
              <div style={{ 
                fontSize: '13px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic',
              }}>
                {formData.status === 'active' 
                  ? 'Khuyến mãi đang được áp dụng và có thể sử dụng' 
                  : formData.status === 'inactive'
                  ? 'Khuyến mãi đã bị dừng và không thể sử dụng'
                  : formData.status === 'upcoming'
                  ? 'Khuyến mãi sẽ được áp dụng trong tương lai'
                  : 'Khuyến mãi đã hết hạn và không thể sử dụng'}
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
                {promotion ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default PromotionForm;