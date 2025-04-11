import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho khuyến mãi
const samplePromotions = [
  {
    id: 1,
    name: "Khuyến mãi mùa hè",
    code: "SUMMER2025",
    discount: "10%",
    startDate: "01/06/2025",
    endDate: "31/08/2025",
    condition: "Áp dụng cho đơn hàng từ 200.000₫",
    status: "active"
  },
  {
    id: 2,
    name: "Mừng năm học mới",
    code: "SCHOOL2025",
    discount: "15%",
    startDate: "15/08/2025",
    endDate: "15/09/2025",
    condition: "Áp dụng cho sách giáo khoa và tham khảo",
    status: "inactive"
  },
  {
    id: 3,
    name: "Sách văn học giảm giá",
    code: "NOVEL25",
    discount: "20%",
    startDate: "01/05/2025",
    endDate: "31/05/2025",
    condition: "Áp dụng cho sách văn học",
    status: "active"
  },
  {
    id: 4,
    name: "Khuyến mãi sách kỹ năng sống",
    code: "SKILL2025",
    discount: "12%",
    startDate: "01/07/2025",
    endDate: "31/07/2025",
    condition: "Áp dụng cho sách thuộc thể loại kỹ năng sống",
    status: "inactive"
  },
  {
    id: 5,
    name: "Khuyến mãi ngày sách Việt Nam",
    code: "BOOKDAY25",
    discount: "25%",
    startDate: "15/04/2025",
    endDate: "25/04/2025",
    condition: "Áp dụng cho tất cả sách của tác giả Việt Nam",
    status: "active"
  },
  {
    id: 6,
    name: "Mừng sinh nhật nhà sách",
    code: "BDAY2025",
    discount: "30%",
    startDate: "10/07/2025",
    endDate: "20/07/2025",
    condition: "Áp dụng cho đơn hàng từ 500.000₫",
    status: "inactive"
  }
];

const PromotionTable = ({ onEdit, onDelete, onView }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = samplePromotions.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(samplePromotions.length / recordsPerPage);

  // Xử lý chọn/bỏ chọn row
  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
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
                      setSelectedRows(
                        currentRecords.map((record) => record.id)
                      );
                    }
                  }}
                />
              </th>
              <th>Tên chương trình</th>
              <th>Mã khuyến mãi</th>
              <th>Mức giảm giá</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Điều kiện áp dụng</th>
              <th>Trạng thái</th>
              <th style={{ width: "120px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((promotion) => (
              <tr key={promotion.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(promotion.id)}
                    onChange={() => toggleRowSelection(promotion.id)}
                  />
                </td>
                <td>{promotion.name}</td>
                <td>{promotion.code}</td>
                <td>{promotion.discount}</td>
                <td>{promotion.startDate}</td>
                <td>{promotion.endDate}</td>
                <td>{promotion.condition}</td>
                <td>
                  <span className={`status-badge status-${promotion.status}`}>
                    {promotion.status === "active" ? "Kích hoạt" : "Không kích hoạt"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="action-button edit-button"
                    title="Sửa"
                    onClick={() => onEdit && onEdit(promotion)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Xóa"
                    onClick={() => onDelete && onDelete(promotion.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="action-button view-button"
                    title="Xem chi tiết"
                    onClick={() => onView && onView(promotion)}
                    style={{ color: "#2196F3" }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
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
          {Math.min(indexOfLastRecord, samplePromotions.length)} của{" "}
          {samplePromotions.length} mục
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
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
            onClick={() => paginate(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default PromotionTable;