import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBoxOpen, faBuilding, faDollarSign, faBook, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../modals/Modals.css";

const ImportForm = ({ importData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    supplierId: "",
    bookDetails: [],
    total: "",
  });

  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [books, setBooks] = useState([]);

  // Lấy thông tin người dùng đăng nhập từ localStorage
  const currentUser = (() => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        console.log("No user data found in localStorage.");
        return null;
      }
      const userObj = JSON.parse(userStr);

      // Support both {id, username, ...} and {user: {id, username, ...}, token: ...}
      const user = userObj.user ? userObj.user : userObj;

      // If id is missing but role_id exists, use role_id as a fallback for id
      if (!user.id && user.role_id) {
        user.id = user.role_id; // Fallback assignment
      }

      if (!user.id || !user.username) {
        console.error("User object in localStorage is missing required fields:", user);
        return null;
      }

      console.log("Current user from localStorage:", user);
      return user;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  })();

  // Load suppliers from database
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  // Load books from database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const computedTotal = formData.bookDetails.reduce((sum, detail) => {
    const quantity = parseInt(detail.quantity) || 0;
    const price = parseInt(detail.price) || 0;
    return sum + quantity * price;
  }, 0);

  useEffect(() => {
    if (importData) {
      setFormData({
        supplierId: importData.supplierId || "",
        bookDetails: importData.bookDetails || [],
        total: importData.total || "",
      });
    }
  }, [importData]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total: computedTotal
    }));
    // eslint-disable-next-line
  }, [formData.bookDetails]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierId) newErrors.supplierId = "Vui lòng chọn nhà cung cấp";
    if (formData.bookDetails.length === 0) newErrors.bookDetails = "Vui lòng thêm ít nhất một sách";
    if (computedTotal <= 0) newErrors.total = "Tổng tiền phải là số dương";
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
      const importedBy = currentUser?.id; // Use the id field from currentUser

      if (!importedBy) {
        alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      console.log("Form data to be submitted:", {
        ...formData,
        total: computedTotal,
        importedBy // Pass the id as importedBy
      });

      onSubmit({
        ...formData,
        total: computedTotal,
        importedBy // Ensure importedBy is included in the payload
      });
    }
  };

  const modalContent = (
    <div className="modal-backdrop">
      <div className="modal-content import-form-modal" style={{ maxWidth: 900, width: "90%" }}>
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
            {/* Người nhập */}
            <div className="form-group">
              <label htmlFor="importer">
                Người nhập
              </label>
              <input
                type="text"
                id="importer"
                name="importer"
                value={currentUser?.username || ""} // Display the username of the logged-in user
                readOnly
                tabIndex={-1}
                style={{
                  background: "#f8f9fa",
                  color: "#333"
                }}
              />
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
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                gap: 12
              }}>
                <label style={{ marginBottom: 0, display: "flex", alignItems: "center" }}>
                  <FontAwesomeIcon icon={faBook} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Danh sách sách nhập
                </label>
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="btn btn-add"
                  style={{
                    background: "#198754",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 16px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Thêm sách
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="import-books-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: 260, textAlign: "left", padding: "6px 4px" }}>Tên sách</th>
                      <th style={{ minWidth: 70, maxWidth: 90, textAlign: "left", padding: "6px 16px 6px 28px" }}>Số lượng</th>
                      <th style={{ minWidth: 90, maxWidth: 110, textAlign: "left", padding: "6px 4px" }}>Giá nhập</th>
                      <th style={{ minWidth: 110, textAlign: "left", padding: "6px 4px" }}>Thành tiền</th>
                      <th style={{ minWidth: 60, padding: "6px 4px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.bookDetails.map((detail, index) => {
                      const quantity = parseInt(detail.quantity) || 0;
                      const price = parseInt(detail.price) || 0;
                      const total = quantity * price;
                      return (
                        <tr key={index}>
                          <td style={{ padding: "4px 2px" }}>
                            <select
                              value={detail.bookId}
                              onChange={(e) => handleBookDetailChange(index, 'bookId', e.target.value)}
                              className={errors.bookDetails ? "error" : ""}
                              style={{
                                width: "100%",
                                minWidth: 220,
                                maxWidth: 350,
                                padding: "6px 8px",
                                margin: 0,
                                borderRadius: 4,
                                border: "1px solid #ccc"
                              }}
                            >
                              <option value="">Chọn sách</option>
                              {books && books.length > 0 ? (
                                books.map(book => (
                                  <option key={book.id} value={book.id}>{book.title}</option>
                                ))
                              ) : (
                                <option value="" disabled>Không có sách nào</option>
                              )}
                            </select>
                          </td>
                          <td style={{ padding: "4px 32px 4px 28px" }}>
                            <input
                              type="number"
                              value={detail.quantity}
                              onChange={(e) => handleBookDetailChange(index, 'quantity', e.target.value)}
                              placeholder="Số lượng"
                              min="1"
                              style={{
                                width: "70px",
                                minWidth: 50,
                                maxWidth: 90,
                                padding: "6px 8px",
                                marginLeft: 8,
                                borderRadius: 4,
                                border: "1px solid #ccc"
                              }}
                            />
                          </td>
                          <td style={{ padding: "4px 2px" }}>
                            <input
                              type="number"
                              value={detail.price}
                              onChange={(e) => handleBookDetailChange(index, 'price', e.target.value)}
                              placeholder="Giá nhập"
                              min="0"
                              style={{
                                width: "90px",
                                minWidth: 70,
                                maxWidth: 110,
                                padding: "6px 8px",
                                margin: 0,
                                borderRadius: 4,
                                border: "1px solid #ccc"
                              }}
                            />
                          </td>
                          <td style={{ padding: "4px 2px" }}>
                            <input
                              type="text"
                              value={total > 0 ? total.toLocaleString() : ""}
                              readOnly
                              tabIndex={-1}
                              style={{
                                width: "110px",
                                minWidth: 90,
                                maxWidth: 130,
                                padding: "6px 8px",
                                margin: 0,
                                borderRadius: 4,
                                border: "1px solid #eee",
                                background: "#f8f9fa",
                                color: "#333"
                              }}
                            />
                          </td>
                          <td style={{ padding: "4px 2px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveBook(index)}
                              className="btn btn-danger"
                              title="Xóa sách"
                              style={{
                                padding: "6px 10px",
                                borderRadius: 4,
                                border: "none"
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {errors.bookDetails && <div className="error-message">{errors.bookDetails}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="total">
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tổng tiền
              </label>
              <input
                type="text"
                id="total"
                name="total"
                value={computedTotal > 0 ? computedTotal.toLocaleString() : ""}
                readOnly
                tabIndex={-1}
                className={errors.total ? "error" : ""}
                placeholder="Tổng tiền sẽ tự động tính"
                style={{
                  background: "#f8f9fa",
                  color: "#333"
                }}
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