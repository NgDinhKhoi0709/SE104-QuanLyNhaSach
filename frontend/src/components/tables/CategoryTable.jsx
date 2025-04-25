import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import CategoryForm from "../forms/CategoryForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./CategoryTable.css";
import "../../styles/SearchBar.css";

// Dữ liệu mẫu cho thể loại sách
const sampleCategories = [
  {
    id: 1,
    name: "Tiểu thuyết",
    description: "Những câu chuyện hư cấu dài với cốt truyện và nhân vật phát triển sâu.",
    status: "active",
  },
  {
    id: 2,
    name: "Kỹ năng sống",
    description: "Sách dạy các kỹ năng để phát triển bản thân và đối phó với các thách thức của cuộc sống.",
    status: "active",
  },
  {
    id: 3,
    name: "Khoa học",
    description: "Sách về các chủ đề khoa học tự nhiên, công nghệ, và các khám phá khoa học.",
    status: "active",
  },
  {
    id: 4,
    name: "Tâm lý học",
    description: "Sách về hành vi con người, tâm lý, và phát triển tinh thần.",
    status: "active",
  },
  {
    id: 5,
    name: "Lịch sử",
    description: "Sách về các sự kiện lịch sử, nhân vật, và các nền văn minh.",
    status: "active",
  },
  {
    id: 6,
    name: "Kinh tế",
    description: "Sách về kinh tế học, tài chính, đầu tư, và kinh doanh.",
    status: "active",
  },
  {
    id: 7,
    name: "Trinh thám",
    description: "Những câu chuyện về tội phạm, điều tra và giải quyết các vụ án.",
    status: "active",
  },
  {
    id: 8,
    name: "Hồi ký",
    description: "Những câu chuyện có thật về cuộc đời của một người, được viết bởi chính họ.",
    status: "active",
  },
  {
    id: 9,
    name: "Thiếu nhi",
    description: "Sách dành cho trẻ em với nội dung phù hợp với độ tuổi và mục đích giáo dục.",
    status: "active",
  },
  {
    id: 10,
    name: "Du ký",
    description: "Sách về các chuyến đi, khám phá và trải nghiệm văn hóa khác nhau.",
    status: "active",
  },
  {
    id: 11,
    name: "Tản văn",
    description: "Văn xuôi ngắn, thường phản ánh suy nghĩ, cảm xúc cá nhân về cuộc sống.",
    status: "active",
  },
  {
    id: 12,
    name: "Truyện ngắn",
    description: "Những câu chuyện hư cấu ngắn, thường tập trung vào một sự kiện hoặc một số nhân vật.",
    status: "active",
  }
];

const CategoryTable = () => {
  const [categories, setCategories] = useState(sampleCategories);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  const confirmDelete = () => {
    setCategories(categories.filter((category) => !selectedRows.includes(category.id)));
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };

  const handleCategorySubmit = (formData) => {
    if (selectedCategory) {
      // Edit existing category
      setCategories(
        categories.map((category) =>
          category.id === selectedCategory.id
            ? { ...category, ...formData }
            : category
        )
      );
    } else {
      // Add new category
      const newCategory = {
        id: categories.length + 1,
        ...formData,
      };
      setCategories([...categories, newCategory]);
    }
    setShowForm(false);
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
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thể loại, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={() => {}} className="search-button">
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
                alert("Vui lòng chọn một thể loại để sửa");
              }
            }}
            disabled={selectedRows.length !== 1}
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
              className={`pagination-button ${
                currentPage === index + 1 ? "active" : ""
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