import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faBoxes,
  faBuilding,
  faCalendar,
  faDollarSign,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import "./ImportForm.css";

const ImportForm = ({ importData, onSubmit, onClose, suppliers }) => {
  const [formData, setFormData] = useState({
    supplierId: "",
    importDate: "",
    totalAmount: "",
    description: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (importData) {
      setFormData({
        supplierId: importData.supplierId || "",
        importDate: importData.importDate || "",
        totalAmount: importData.totalAmount || "",
        description: importData.description || "",
        status: importData.status || "pending",
      });
    }
  }, [importData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierId) newErrors.supplierId = "Vui lòng chọn nhà cung cấp";
    if (!formData.importDate) newErrors.importDate = "Vui lòng chọn ngày nhập";
    if (!formData.totalAmount) newErrors.totalAmount = "Vui lòng nhập tổng tiền";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";

    // Validate total amount (positive number)
    if (formData.totalAmount && (isNaN(formData.totalAmount) || formData.totalAmount <= 0)) {
      newErrors.totalAmount = "Tổng tiền phải là số dương";
    }

    // Validate import date (not in the future)
    const today = new Date();
    const importDate = new Date(formData.importDate);
    if (formData.importDate && importDate > today) {
      newErrors.importDate = "Ngày nhập không được lớn hơn ngày hiện tại";
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
      <div className="form-modal-content">
        <div className="form-modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faBoxes} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {importData ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}
          </h3>
          <button className="form-close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal-body">
          <div className="form-group">
            <label htmlFor="supplierId">
              <FontAwesomeIcon icon={faBuilding} />
              Nhà cung cấp
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className={errors.supplierId ? "error" : ""}
            >
              <option value="">Chọn nhà cung cấp</option>
              {suppliers && suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Không có nhà cung cấp nào</option>
              )}
            </select>
            {errors.supplierId && <span className="error-message">{errors.supplierId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="importDate">
              <FontAwesomeIcon icon={faCalendar} />
              Ngày nhập
            </label>
            <input
              type="date"
              id="importDate"
              name="importDate"
              value={formData.importDate}
              onChange={handleChange}
              className={errors.importDate ? "error" : ""}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.importDate && <span className="error-message">{errors.importDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="totalAmount">
              <FontAwesomeIcon icon={faDollarSign} />
              Tổng tiền
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className={errors.totalAmount ? "error" : ""}
              placeholder="Nhập tổng tiền"
              min="0"
              step="1000"
            />
            {errors.totalAmount && <span className="error-message">{errors.totalAmount}</span>}
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
              placeholder="Nhập mô tả phiếu nhập"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">
              <FontAwesomeIcon icon={faBoxes} />
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Đang chờ</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <div className="form-help-text">
              Trạng thái xác định tình trạng của phiếu nhập
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

export default ImportForm;