import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPencilAlt, faSearch, faCheck, faTrashAlt, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import CategoryForm from "../forms/CategoryForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./CategoryTable.css";
import "../../styles/SearchBar.css";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Fetch categories from the database via your API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched categories data:", data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on search query (only by name)
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCategories.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);

  // Kiểm tra xem tất cả các mục trên tất cả các trang đã được chọn chưa
  const areAllItemsSelected = filteredCategories.length > 0 &&
    filteredCategories.every(category => selectedRows.includes(category.id));

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategories = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      // Loop over selectedRows and call DELETE for each id
      for (const id of selectedRows) {
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete category ${id}: ${response.status} ${errorText}`);
        }
      }
      // Remove deleted categories from state after successful deletion
      setCategories(categories.filter(category => !selectedRows.includes(category.id)));
      setSelectedRows([]);
      setShowDeleteConfirmation(false);
      // Optionally set a notification for deletion success
      setNotification({ message: "Xóa thể loại thành công.", type: "delete" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };

  const handleCategorySubmit = async (formData) => {
    if (selectedCategory) {
      // Edit existing category (update functionality)
      try {
        const response = await fetch(`http://localhost:5000/api/categories/${selectedCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error("Failed to update category");
        const updatedCategory = await response.json();
        setCategories(
          categories.map((category) =>
            category.id === selectedCategory.id ? updatedCategory : category
          )
        );
        setShowForm(false);
        setNotification({ message: "Sửa thể loại thành công.", type: "update" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      // Add new category to the database
      try {
        const response = await fetch("http://localhost:5000/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to add category");
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setShowForm(false);
        setNotification({ message: "Thêm thể loại thành công.", type: "add" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  // Xử lý khi chọn/bỏ chọn một hàng
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredCategories.map(category => category.id));
    }
  };

  return (
    <>
      {notification.message && (
        <div className={`notification ${notification.type === "error" ? "error" : ""}`}>
          {notification.type === "add" && (
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "8px" }} />
          )}
          {notification.type === "delete" && (
            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "8px" }} />
          )}
          {notification.type === "update" && (
            <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: "8px" }} />
          )}
          {notification.type === "error" && (
            <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "8px" }} />
          )}
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification({ message: "", type: "" })}
            aria-label="Đóng thông báo"
          >
            &times;
          </button>
          <div className="progress-bar"></div>
        </div>
      )}
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thể loại"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={() => { }} className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn btn-add" onClick={handleAddCategory}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeleteCategories}
            disabled={selectedRows.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
          <button
            className="btn btn-edit"
            onClick={() => {
              if (selectedRows.length === 1) {
                const category = categories.find((c) => c.id === selectedRows[0]);
                handleEditCategory(category);
              } else {
                setNotification({ message: "Chỉ chọn 1 thể loại để sửa", type: "error" });
                setTimeout(() => setNotification({ message: "", type: "" }), 5000);
              }
            }}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Sửa
          </button>
        </div>
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={areAllItemsSelected}
                  onChange={handleSelectAllToggle}
                  title={areAllItemsSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                />
              </th>
              <th>Tên thể loại</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((category) => (
              <tr
                key={category.id}
                className={selectedRows.includes(category.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(category.id)}
                    onChange={() => toggleRowSelection(category.id)}
                  />
                </td>
                <td>{category.name}</td>
                <td>{category.description}</td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {areAllItemsSelected && filteredCategories.length > currentRecords.length && (
          <div className="all-pages-selected-info">
            Đã chọn tất cả {filteredCategories.length} mục trên {totalPages} trang
          </div>
        )}
        <div className="pagination-info">
          Hiển thị {indexOfFirstRecord + 1} đến{" "}
          {Math.min(indexOfLastRecord, filteredCategories.length)} của{" "}
          {filteredCategories.length} mục
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`pagination-button ${currentPage === index + 1 ? "active" : ""
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <CategoryForm
              category={selectedCategory}
              onSubmit={handleCategorySubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa thể loại"
        message={`Bạn có chắc chắn muốn xóa ${selectedRows.length} thể loại đã chọn? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default CategoryTable;