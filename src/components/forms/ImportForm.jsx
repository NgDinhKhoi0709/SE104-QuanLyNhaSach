import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBoxOpen, faBuilding, faDollarSign, faBook, faTrash, faPlus, faCalendar } from "@fortawesome/free-solid-svg-icons";
// Chỉ sử dụng Modals.css để tránh xung đột CSS
import "../modals/Modals.css";

const ImportForm = ({ importData, onSubmit, onClose, suppliers, books }) => {
  const [formData, setFormData] = useState({
    importCode: "",
    date: "",
    supplierId: "",
    bookDetails: [],
    total: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (importData) {
      setFormData({
        importCode: importData.importCode || "",
        date: importData.date || "",
        supplierId: importData.supplierId || "",
        bookDetails: importData.bookDetails || [],
        total: importData.total || "",
      });
    }
  }, [importData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.importCode.trim()) newErrors.importCode = "Vui lòng nhập mã phiếu nhập";
    if (!formData.date) newErrors.date = "Vui lòng chọn ngày nhập";
    if (!formData.supplierId) newErrors.supplierId = "Vui lòng chọn nhà cung cấp";
    if (formData.bookDetails.length === 0) newErrors.bookDetails = "Vui lòng thêm ít nhất một sách";
    if (!formData.total) newErrors.total = "Vui lòng nhập tổng tiền";

    // Validate total amount (positive number)
    if (formData.total && (isNaN(formData.total) || formData.total <= 0)) {
      newErrors.total = "Tổng tiền phải là số dương";
    }

    // Validate import date (not in the future)
    const today = new Date();
    const importDate = new Date(formData.date);
    if (formData.date && importDate > today) {
      newErrors.date = "Ngày nhập không được lớn hơn ngày hiện tại";
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

  const handleAddBook = () => {
    setFormData(prev => ({
      ...prev,
      bookDetails: [...prev.bookDetails, { bookId: "", quantity: 1, price: "" }]
    }));
  };

  const handleRemoveBook = (index) => {
    setFormData(prev => ({
      ...prev,
      bookDetails: prev.bookDetails.filter((_, i) => i !== index)
    }));
  };

  const handleBookDetailChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bookDetails: prev.bookDetails.map((detail, i) => {
        if (i === index) {
          return { ...detail, [field]: value };
        }
        return detail;
      })
    }));
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
              <label htmlFor="importCode">
                <FontAwesomeIcon icon={faBoxOpen} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mã phiếu nhập
              </label>
              <input
                type="text"
                id="importCode"
                name="importCode"
                value={formData.importCode}
                onChange={handleChange}
                className={errors.importCode ? "error" : ""}
                placeholder="Nhập mã phiếu nhập"
              />
              {errors.importCode && <div className="error-message">{errors.importCode}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="date">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
                Ngày nhập
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "error" : ""}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>

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
              <label>
                <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px', opacity: 0.7 }} />
                Danh sách sách
              </label>
              {formData.bookDetails.map((detail, index) => (
                <div key={index} className="book-detail-row">
                  <select
                    value={detail.bookId}
                    onChange={(e) => handleBookDetailChange(index, 'bookId', e.target.value)}
                    className={errors.bookDetails ? "error" : ""}
                  >
                    <option value="">Chọn sách</option>
                    {books && books.map(book => (
                      <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={detail.quantity}
                    onChange={(e) => handleBookDetailChange(index, 'quantity', e.target.value)}
                    placeholder="Số lượng"
                    min="1"
                  />
                  <input
                    type="number"
                    value={detail.price}
                    onChange={(e) => handleBookDetailChange(index, 'price', e.target.value)}
                    placeholder="Giá nhập"
                    min="0"
                  />
                  <button type="button" onClick={() => handleRemoveBook(index)} className="btn btn-danger">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddBook} className="btn btn-secondary">
                <FontAwesomeIcon icon={faPlus} /> Thêm sách
              </button>
              {errors.bookDetails && <div className="error-message">{errors.bookDetails}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="total">
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tổng tiền
              </label>
              <input
                type="number"
                id="total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className={errors.total ? "error" : ""}
                placeholder="Nhập tổng tiền"
                min="0"
                step="1000"
              />
              {errors.total && <div className="error-message">{errors.total}</div>}
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

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ImportForm;