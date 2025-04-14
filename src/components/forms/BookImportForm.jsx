import React, { useState, useEffect } from "react";
import Form from "./Form";

const BookImportForm = ({ bookImport, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    importDate: "",
    supplier: "",
    totalAmount: "",
    status: "pending",
    paymentStatus: "unpaid",
    note: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bookImport) {
      setFormData({
        importDate: bookImport.importDate || "",
        supplier: bookImport.supplier || "",
        totalAmount: bookImport.totalAmount || "",
        status: bookImport.status || "pending",
        paymentStatus: bookImport.paymentStatus || "unpaid",
        note: bookImport.note || "",
      });
    }
  }, [bookImport]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.importDate) newErrors.importDate = "Vui lòng chọn ngày nhập";
    if (!formData.supplier) newErrors.supplier = "Vui lòng chọn nhà cung cấp";
    if (!formData.totalAmount) newErrors.totalAmount = "Vui lòng nhập tổng tiền";
    else if (isNaN(formData.totalAmount) || formData.totalAmount <= 0)
      newErrors.totalAmount = "Tổng tiền phải là số dương";

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
        totalAmount: parseFloat(formData.totalAmount),
      });
    }
  };

  return (
    <Form
      title={bookImport ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div className="form-group">
        <label htmlFor="importDate">Ngày nhập *</label>
        <input
          type="date"
          id="importDate"
          name="importDate"
          value={formData.importDate}
          onChange={handleChange}
          className={errors.importDate ? "error" : ""}
        />
        {errors.importDate && (
          <span className="error-message">{errors.importDate}</span>
        )}
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
          <option value="NXB Giáo Dục">NXB Giáo Dục</option>
          <option value="First News">First News</option>
          <option value="Alpha Books">Alpha Books</option>
          <option value="Thái Hà Books">Thái Hà Books</option>
          <option value="Nhã Nam">Nhã Nam</option>
        </select>
        {errors.supplier && (
          <span className="error-message">{errors.supplier}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="totalAmount">Tổng tiền *</label>
        <input
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          className={errors.totalAmount ? "error" : ""}
          min="0"
          step="1000"
        />
        {errors.totalAmount && (
          <span className="error-message">{errors.totalAmount}</span>
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
          <option value="pending">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="paymentStatus">Trạng thái thanh toán</label>
        <select
          id="paymentStatus"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
        >
          <option value="unpaid">Chưa thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="refunded">Đã hoàn tiền</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="note">Ghi chú</label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          placeholder="Nhập ghi chú (nếu có)"
        />
      </div>
    </Form>
  );
};

export default BookImportForm; 