import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBuilding } from "@fortawesome/free-solid-svg-icons";
import "../modals/Modals.css";

const PublisherForm = ({ publisher, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (publisher) {
      setFormData({
        name: publisher.name || ""
      });
    }
  }, [publisher]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên nhà xuất bản";
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
              icon={faBuilding}
              style={{ color: '#095e5a', marginRight: '10px' }}
            />
            {publisher ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="name">
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Hủy bỏ
              </button>
              <button type="submit" className="save-button">
                {publisher ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default PublisherForm;