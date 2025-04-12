import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho nhà cung cấp
const sampleSuppliers = [
  {
    id: 1,
    name: "Công ty Phát hành Fahasa",
    address: "60-62 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "028 3822 5796",
    email: "info@fahasa.com",
  },
  {
    id: 2,
    name: "Nhà sách Phương Nam",
    address: "940 Đường 3/2, Phường 15, Quận 11, TP.HCM",
    phone: "028 3962 3386",
    email: "online@phuongnam.vn",
  },
  {
    id: 3,
    name: "Thái Hà Books",
    address: "23 Ngõ 80 Trung Kính, Yên Hòa, Cầu Giấy, Hà Nội",
    phone: "024 3793 0480",
    email: "book@thaihabooks.com",
  },
  {
    id: 4,
    name: "Alpha Books",
    address: "67 Lương Văn Can, Hàng Bông, Hoàn Kiếm, Hà Nội",
    phone: "024 3938 8631",
    email: "info@alphabooks.vn",
  },
  {
    id: 5,
    name: "First News - Trí Việt",
    address: "11H Nguyễn Thị Minh Khai, Bến Nghé, Quận 1, TP.HCM",
    phone: "028 3822 7979",
    email: "triviet@firstnews.com.vn",
  },
];

const SupplierTable = ({ onEdit, onDelete, onView }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sampleSuppliers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sampleSuppliers.length / recordsPerPage);

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

  const handleSelectAll = () => {
    if (selectedRows.length === currentRecords.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentRecords.map((record) => record.id));
    }
  };

  return (
    <>
      <div className="table-container">
        <table className="data-table supplier-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentRecords.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Tên nhà cung cấp</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((supplier) => (
              <tr key={supplier.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(supplier.id)}
                    onChange={() => toggleRowSelection(supplier.id)}
                  />
                </td>
                <td>{supplier.name}</td>
                <td>{supplier.address}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td className="actions">
                  <button
                    className="action-button edit-button"
                    title="Sửa"
                    onClick={() => onEdit && onEdit(supplier)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Xóa"
                    onClick={() => onDelete && onDelete(supplier.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="action-button view-button"
                    title="Xem chi tiết"
                    onClick={() => onView && onView(supplier)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
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
          {Math.min(indexOfLastRecord, sampleSuppliers.length)} của{" "}
          {sampleSuppliers.length} mục
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

export default SupplierTable;