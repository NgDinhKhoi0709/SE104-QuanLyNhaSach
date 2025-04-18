import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBoxOpen, faBuilding, faDollarSign, faBook, faTrash, faPlus, faCalendar } from "@fortawesome/free-solid-svg-icons";
// Chỉ sử dụng Modals.css để tránh xung đột CSS
import "../modals/Modals.css";

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
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faBoxOpen} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {importData ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="supplierId">
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.supplierId && <div className="error-message">{errors.supplierId}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="importDate">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.importDate && <div className="error-message">{errors.importDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="totalAmount">
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.totalAmount && <div className="error-message">{errors.totalAmount}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="status">
                <FontAwesomeIcon icon={faBoxOpen} style={{ marginRight: '8px', opacity: 0.7 }} />
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
              <div style={{ 
                fontSize: '13px', 
                color: '#666', 
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                {formData.status === 'pending' 
                  ? 'Phiếu nhập đang được xử lý' 
                  : formData.status === 'completed'
                  ? 'Phiếu nhập đã được hoàn thành và sách đã được nhập vào kho' 
                  : 'Phiếu nhập đã bị hủy'}
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
                {importData ? "Cập nhật" : "Thêm mới"}
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

export default ImportForm;