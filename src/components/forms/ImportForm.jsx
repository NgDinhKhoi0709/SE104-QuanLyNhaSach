import React, { useState, useEffect } from "react";
import Form from "./Form";

const ImportForm = ({ importItem, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    supplier: "",
    book: "",
    quantity: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (importItem) {
      setFormData({
        date: importItem.date || "",
        supplier: importItem.supplier || "",
        book: importItem.book || "",
        quantity: importItem.quantity || "",
        price: importItem.price || "",
      });
    }
  }, [importItem]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Vui lòng chọn ngày nhập";
    if (!formData.supplier) newErrors.supplier = "Vui lòng chọn nhà cung cấp";
    if (!formData.book) newErrors.book = "Vui lòng chọn sách";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Vui lòng nhập số lượng hợp lệ";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Vui lòng nhập đơn giá hợp lệ";

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
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
      });
    }
  };

  return (
    <Form
      title={importItem ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div className="form-group">
        <label htmlFor="date">Ngày nhập *</label>
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
        <label htmlFor="supplier">Nhà cung cấp *</label>
        <select
          id="supplier"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          className={errors.supplier ? "error" : ""}
        >
          <option value="">Chọn nhà cung cấp</option>
          <option value="NXB Kim Đồng">NXB Kim Đồng</option>
          <option value="NXB Trẻ">NXB Trẻ</option>
          <option value="NXB Văn Học">NXB Văn Học</option>
        </select>
        {errors.supplier && (
          <span className="error-message">{errors.supplier}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="book">Sách *</label>
        <select
          id="book"
          name="book"
          value={formData.book}
          onChange={handleChange}
          className={errors.book ? "error" : ""}
        >
          <option value="">Chọn sách</option>
          <option value="Doraemon tập 1">Doraemon tập 1</option>
          <option value="Conan tập 1">Conan tập 1</option>
          <option value="Shin tập 1">Shin tập 1</option>
        </select>
        {errors.book && <span className="error-message">{errors.book}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Số lượng *</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          className={errors.quantity ? "error" : ""}
        />
        {errors.quantity && (
          <span className="error-message">{errors.quantity}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="price">Đơn giá (VNĐ) *</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="1000"
          className={errors.price ? "error" : ""}
        />
        {errors.price && <span className="error-message">{errors.price}</span>}
      </div>
    </Form>
  );
};

export default ImportForm; 