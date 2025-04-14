import React, { useState, useEffect } from "react";
import Form from "./Form";

const SupplierForm = ({ supplier, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        address: supplier.address || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        status: supplier.status || "active",
      });
    }
  }, [supplier]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập tên nhà cung cấp";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[\s.-]/g, "")))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

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
    <Form
      title={supplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div className="form-group">
        <label htmlFor="name">Tên nhà cung cấp *</label>
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
        <label htmlFor="address">Địa chỉ *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? "error" : ""}
        />
        {errors.address && (
          <span className="error-message">{errors.address}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Số điện thoại *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? "error" : ""}
          placeholder="VD: 0283.931.6289"
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "error" : ""}
          placeholder="VD: example@domain.com"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">Trạng thái</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>
    </Form>
  );
};

export default SupplierForm; 