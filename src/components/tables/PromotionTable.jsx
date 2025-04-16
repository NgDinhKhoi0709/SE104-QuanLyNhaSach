import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import PromotionForm from "../forms/PromotionForm";
import "./PromotionTable.css";
import "../../styles/SearchBar.css";

// Sample data
const samplePromotions = [
  {
    id: 1,
    name: "Mừng năm học mới",
    code: "BACK2SCHOOL2024",
    discount: 15,
    startDate: "2024-08-15",
    endDate: "2024-09-15",
    condition: "Đơn hàng từ 300.000đ",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Khuyến mãi mùa hè",
    code: "SUMMER2024",
    discount: 20,
    startDate: "2024-06-01",
    endDate: "2024-07-31",
    condition: "Đơn hàng từ 200.000đ",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Tết Nguyên Đán 2024",
    code: "TET2024",
    discount: 25,
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    condition: "Đơn hàng từ 500.000đ",
    status: "expired",
  },
  {
    id: 4,
    name: "Mừng Quốc Khánh",
    code: "NATIONAL2024",
    discount: 10,
    startDate: "2024-09-01",
    endDate: "2024-09-03",
    condition: "Đơn hàng từ 150.000đ",
    status: "upcoming",
  },
  {
    id: 5,
    name: "Black Friday",
    code: "BLACK2024",
    discount: 30,
    startDate: "2024-11-24",
    endDate: "2024-11-26",
    condition: "Đơn hàng từ 1.000.000đ",
    status: "upcoming",
  },
  {
    id: 6,
    name: "Khuyến mãi tháng 4",
    code: "APRIL2024",
    discount: 12,
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    condition: "Đơn hàng từ 250.000đ",
    status: "active",
  },
  {
    id: 7,
    name: "Mừng Ngày Phụ Nữ",
    code: "WOMEN2024",
    discount: 15,
    startDate: "2024-03-08",
    endDate: "2024-03-10",
    condition: "Đơn hàng từ 200.000đ",
    status: "expired",
  },
  {
    id: 8,
    name: "Khuyến mãi cuối năm",
    code: "YEAREND2024",
    discount: 25,
    startDate: "2024-12-20",
    endDate: "2024-12-31",
    condition: "Đơn hàng từ 400.000đ",
    status: "upcoming",
  },
  {
    id: 9,
    name: "Mừng Trung Thu",
    code: "MOON2024",
    discount: 18,
    startDate: "2024-09-20",
    endDate: "2024-09-29",
    condition: "Đơn hàng từ 300.000đ",
    status: "upcoming",
  },
  {
    id: 10,
    name: "Valentine's Day",
    code: "LOVE2024",
    discount: 14,
    startDate: "2024-02-14",
    endDate: "2024-02-15",
    condition: "Đơn hàng từ 200.000đ",
    status: "expired",
  },
  {
    id: 11,
    name: "Mừng Ngày Thiếu Nhi",
    code: "KIDS2024",
    discount: 20,
    startDate: "2024-06-01",
    endDate: "2024-06-02",
    condition: "Đơn hàng từ 250.000đ",
    status: "upcoming",
  },
  {
    id: 12,
    name: "Khuyến mãi mùa xuân",
    code: "SPRING2024",
    discount: 15,
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    condition: "Đơn hàng từ 200.000đ",
    status: "expired",
  },
  {
    id: 13,
    name: "Mừng Ngày Nhà Giáo",
    code: "TEACHER2024",
    discount: 20,
    startDate: "2024-11-20",
    endDate: "2024-11-22",
    condition: "Đơn hàng từ 300.000đ",
    status: "upcoming",
  },
  {
    id: 14,
    name: "Flash Sale Tháng 5",
    code: "FLASH0524",
    discount: 35,
    startDate: "2024-05-05",
    endDate: "2024-05-05",
    condition: "Đơn hàng từ 500.000đ",
    status: "upcoming",
  },
  {
    id: 15,
    name: "Khuyến mãi sinh nhật",
    code: "BDAY2024",
    discount: 10,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    condition: "Đơn hàng từ 100.000đ",
    status: "active",
  },
];

const PromotionTable = () => {
  const [promotions, setPromotions] = useState(samplePromotions);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const recordsPerPage = 10;

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

  const handleAddPromotion = () => {
    setSelectedPromotion(null);
    setShowForm(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setShowForm(true);
  };

  const handleDeletePromotions = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các khuyến mãi đã chọn?")) {
      setPromotions(
        promotions.filter((promotion) => !selectedRows.includes(promotion.id))
      );
      setSelectedRows([]);
    }
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
            <button onClick={() => {}} className="search-button">
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
                  checked={
                    selectedRows.length === currentRecords.length &&
                    currentRecords.length > 0
                  }
                  onChange={() => {
                    if (selectedRows.length === currentRecords.length) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(currentRecords.map((promotion) => promotion.id));
                    }
                  }}
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
            <PromotionForm
              promotion={selectedPromotion}
              onSubmit={handlePromotionSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionTable;