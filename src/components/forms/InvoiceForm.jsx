import React, { useState, useEffect } from "react";
import Form from "./Form";

const InvoiceForm = ({ invoice, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    code: "",
    date: "",
    customer: "",
    total: "",
    discount: "",
    payment: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        code: invoice.code || "",
        date: invoice.date || "",
        customer: invoice.customer || "",
        total: invoice.total || "",
        discount: invoice.discount || "",
        payment: invoice.payment || "",
        status: invoice.status || "pending",
      });
    }
  }, [invoice]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = "Vui lòng nhập mã hóa đơn";
    if (!formData.date) newErrors.date = "Vui lòng chọn ngày lập";
    if (!formData.customer) newErrors.customer = "Vui lòng nhập tên khách hàng";
    if (!formData.total || formData.total <= 0)
      newErrors.total = "Vui lòng nhập tổng tiền hợp lệ";
    if (formData.discount < 0)
      newErrors.discount = "Giảm giá không được âm";
    if (!formData.payment) newErrors.payment = "Vui lòng chọn phương thức thanh toán";

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
      onSubmit({
        ...formData,
        total: parseFloat(formData.total),
        discount: parseFloat(formData.discount) || 0,
      });
    }
  };

  return (
    <Form
      title={invoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn mới"}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div className="form-group">
        <label htmlFor="code">Mã hóa đơn *</label>
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
        <label htmlFor="date">Ngày lập *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={errors.date ? "error" : ""}
        />
        {errors.date && <span className="error-message">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="customer">Khách hàng *</label>
        <input
          type="text"
          id="customer"
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          className={errors.customer ? "error" : ""}
        />
        {errors.customer && (
          <span className="error-message">{errors.customer}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="total">Tổng tiền (VNĐ) *</label>
        <input
          type="number"
          id="total"
          name="total"
          value={formData.total}
          onChange={handleChange}
          min="0"
          step="1000"
          className={errors.total ? "error" : ""}
        />
        {errors.total && <span className="error-message">{errors.total}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="discount">Giảm giá (VNĐ)</label>
        <input
          type="number"
          id="discount"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          min="0"
          step="1000"
          className={errors.discount ? "error" : ""}
        />
        {errors.discount && (
          <span className="error-message">{errors.discount}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="payment">Phương thức thanh toán *</label>
        <select
          id="payment"
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          className={errors.payment ? "error" : ""}
        >
          <option value="">Chọn phương thức thanh toán</option>
          <option value="Tiền mặt">Tiền mặt</option>
          <option value="Chuyển khoản">Chuyển khoản</option>
          <option value="Thẻ tín dụng">Thẻ tín dụng</option>
        </select>
        {errors.payment && (
          <span className="error-message">{errors.payment}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="status">Trạng thái</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Chờ thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
    </Form>
  );
};

export default InvoiceForm; 