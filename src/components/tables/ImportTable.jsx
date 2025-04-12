import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho nhập sách
const sampleImports = [
  {
    id: 1,
    date: "10/04/2025",
    supplier: "Công ty Phát hành Fahasa",
    book: "Đắc nhân tâm",
    category: "Kỹ năng sống",
    author: "Dale Carnegie",
    publisher: "NXB Tổng hợp",
    quantity: 15,
    price: "65.000 ₫",
  },
  {
    id: 2,
    date: "08/04/2025",
    supplier: "Nhà sách Phương Nam",
    book: "Nhà giả kim",
    category: "Tiểu thuyết",
    author: "Paulo Coelho",
    publisher: "NXB Văn học",
    quantity: 10,
    price: "50.000 ₫",
  },
  {
    id: 3,
    date: "05/04/2025",
    supplier: "Thái Hà Books",
    book: "Tuổi trẻ đáng giá bao nhiêu",
    category: "Kỹ năng sống",
    author: "Rosie Nguyễn",
    publisher: "NXB Hội Nhà văn",
    quantity: 12,
    price: "55.000 ₫",
  },
  {
    id: 4,
    date: "03/04/2025",
    supplier: "Alpha Books",
    book: "Cây cam ngọt của tôi",
    category: "Tiểu thuyết",
    author: "José Mauro de Vasconcelos",
    publisher: "NXB Hội Nhà văn",
    quantity: 8,
    price: "85.000 ₫",
  },
  {
    id: 5,
    date: "01/04/2025",
    supplier: "First News - Trí Việt",
    book: "Tôi thấy hoa vàng trên cỏ xanh",
    category: "Tiểu thuyết",
    author: "Nguyễn Nhật Ánh",
    publisher: "NXB Trẻ",
    quantity: 20,
    price: "60.000 ₫",
  },
  {
    id: 6,
    date: "29/03/2025",
    supplier: "Đông A Book",
    book: "Đời ngắn đừng ngủ dài",
    category: "Kỹ năng sống",
    author: "Robin Sharma",
    publisher: "NXB Trẻ",
    quantity: 15,
    price: "45.000 ₫",
  },
  {
    id: 7,
    date: "25/03/2025",
    supplier: "Nhà sách Tiền Phong",
    book: "Sapiens: Lược sử loài người",
    category: "Lịch sử",
    author: "Yuval Noah Harari",
    publisher: "NXB Dân Trí",
    quantity: 10,
    price: "150.000 ₫",
  },
  {
    id: 8,
    date: "20/03/2025",
    supplier: "Công ty Sách và Thiết bị Giáo dục miền Nam",
    book: "Tư duy nhanh và chậm",
    category: "Tâm lý học",
    author: "Daniel Kahneman",
    publisher: "NXB Thế Giới",
    quantity: 8,
    price: "135.000 ₫",
  },
];

const ImportTable = ({ onEdit, onDelete, onView }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sampleImports.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sampleImports.length / recordsPerPage);

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
                      setSelectedRows(
                        currentRecords.map((record) => record.id)
                      );
                    }
                  }}
                />
              </th>
              <th>Ngày nhập</th>
              <th>Nhà cung cấp</th>
              <th>Sách</th>
              <th>Thể loại</th>
              <th>Tác giả</th>
              <th>Nhà xuất bản</th>
              <th>Số lượng</th>
              <th>Đơn giá nhập</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((importItem) => (
              <tr key={importItem.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(importItem.id)}
                    onChange={() => toggleRowSelection(importItem.id)}
                  />
                </td>
                <td>{importItem.date}</td>
                <td>{importItem.supplier}</td>
                <td>{importItem.book}</td>
                <td>{importItem.category}</td>
                <td>{importItem.author}</td>
                <td>{importItem.publisher}</td>
                <td>{importItem.quantity}</td>
                <td>{importItem.price}</td>
                <td className="actions">
                  <button
                    className="action-button edit-button"
                    title="Sửa"
                    onClick={() => onEdit && onEdit(importItem)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Xóa"
                    onClick={() => onDelete && onDelete(importItem.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="action-button view-button"
                    title="Xem chi tiết"
                    onClick={() => onView && onView(importItem)}
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
                  colSpan="10"
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
          {Math.min(indexOfLastRecord, sampleImports.length)} của{" "}
          {sampleImports.length} mục
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

export default ImportTable;
