import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import PromotionForm from "../forms/PromotionForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./PromotionTable.css";
import "../../styles/SearchBar.css";

const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]); // Xóa dữ liệu mẫu và khởi tạo mảng rỗng
  const [showForm, setShowForm] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/promotions");
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
        } else {
          console.error("Failed to fetch promotions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  // Filter promotions based on search query
  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPromotions.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPromotions.length / recordsPerPage);

  // Kiểm tra xem tất cả các mục trên tất cả các trang đã được chọn chưa
  const areAllItemsSelected = filteredPromotions.length > 0 &&
    filteredPromotions.every(promotion => selectedRows.includes(promotion.id));

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredPromotions.map(promotion => promotion.id));
    }
  };

  const handleAddPromotion = () => {
    setSelectedPromotion(null);
    setShowForm(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setShowForm(true);
  };

  const handleDeletePromotions = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setPromotions(promotions.filter((promotion) => !selectedRows.includes(promotion.id)));
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };

  const handlePromotionSubmit = (formData) => {
    if (selectedPromotion) {
      // Edit existing promotion
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === selectedPromotion.id
            ? { ...promotion, ...formData }
            : promotion
        )
      );
    } else {
      // Add new promotion
      const newPromotion = {
        id: promotions.length + 1,
        ...formData,
      };
      setPromotions([...promotions, newPromotion]);
    }
    setShowForm(false);
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "status-badge status-active";
      case "inactive":
        return "status-badge status-inactive";
      case "upcoming":
        return "status-badge status-upcoming";
      case "expired":
        return "status-badge status-expired";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang diễn ra";
      case "inactive":
        return "Đã dừng";
      case "upcoming":
        return "Sắp diễn ra";
      case "expired":
        return "Đã kết thúc";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên chương trình, mã giảm giá..."
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
          <button className="btn btn-add" onClick={handleAddPromotion}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeletePromotions}
            disabled={selectedRows.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
          <button
            className="btn btn-edit"
            onClick={() => {
              if (selectedRows.length === 1) {
                const promotion = promotions.find((c) => c.id === selectedRows[0]);
                handleEditPromotion(promotion);
              } else {
                alert("Vui lòng chọn một chương trình khuyến mãi để sửa");
              }
            }}
            disabled={selectedRows.length !== 1}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Sửa
          </button>
        </div>
      </div>

      <div className="promotion-table-container">
        <table className="promotion-table">
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
              <th>Tên chương trình</th>
              <th>Mã khuyến mãi</th>
              <th>Mức giảm giá (%)</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Điều kiện áp dụng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((promotion) => (
              <tr
                key={promotion.id}
                className={selectedRows.includes(promotion.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(promotion.id)}
                    onChange={() => toggleRowSelection(promotion.id)}
                  />
                </td>
                <td>{promotion.name}</td>
                <td>{promotion.code}</td>
                <td>{promotion.discount}%</td>
                <td>{promotion.startDate}</td>
                <td>{promotion.endDate}</td>
                <td>{promotion.condition}</td>
                <td>
                  <span className={getStatusBadgeClass(promotion.status)}>
                    {getStatusText(promotion.status)}
                  </span>
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {areAllItemsSelected && filteredPromotions.length > currentRecords.length && (
          <div className="all-pages-selected-info">
            Đã chọn tất cả {filteredPromotions.length} mục trên {totalPages} trang
          </div>
        )}
        <div className="pagination-info">
          Hiển thị {indexOfFirstRecord + 1} đến{" "}
          {Math.min(indexOfLastRecord, filteredPromotions.length)} của{" "}
          {filteredPromotions.length} mục
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
            <PromotionForm
              promotion={selectedPromotion}
              onSubmit={handlePromotionSubmit}
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
        title="Xác nhận xóa khuyến mãi"
        message={`Bạn có chắc chắn muốn xóa ${selectedRows.length} khuyến mãi đã chọn? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default PromotionTable;