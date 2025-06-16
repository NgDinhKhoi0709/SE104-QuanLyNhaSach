import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBuilding, faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../modals/Modals.css";

const SupplierForm = ({ supplier, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
      });
    }
  }, [supplier]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên nhà cung cấp";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

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
    <div className="modal-backdrop">
      <div className="modal-content" style={{ width: '800px', maxWidth: '95vw' }}>
        <div className="modal-header">
          <h3>
            <FontAwesomeIcon
              icon={faBuilding}
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }}
            />
            {supplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {/* Cột bên trái */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label htmlFor="name" style={{ fontSize: '1.25em', fontWeight: '600' }}>
                    <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', opacity: 0.7 }} />
                    Tên nhà cung cấp
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    placeholder="Nhập tên nhà cung cấp"
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label htmlFor="phone" style={{ fontSize: '1.25em', fontWeight: '600' }}>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', opacity: 0.7 }} />
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
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>

              {/* Cột bên phải */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label htmlFor="email" style={{ fontSize: '1.25em', fontWeight: '600' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', opacity: 0.7 }} />
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
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label htmlFor="address" style={{ fontSize: '1.25em', fontWeight: '600' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', opacity: 0.7 }} />
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
                  {errors.address && <div className="error-message">{errors.address}</div>}
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '15px' }}>
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
                {supplier ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default SupplierForm;