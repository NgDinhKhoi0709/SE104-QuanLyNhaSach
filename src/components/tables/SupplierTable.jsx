import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho nhà cung cấp
const sampleSuppliers = [
  {
    id: 1,
    name: "Công ty Phát hành Fahasa",
    address: "60-62 Lê Lợi, Quận 1, TP.HCM",
    phone: "028 3829 1937",
    email: "info@fahasa.com"
  },
  {
    id: 2,
    name: "Nhà sách Phương Nam",
    address: "940 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    phone: "028 3930 6728",
    email: "cskh@phuongnambook.com"
  },
  {
    id: 3,
    name: "Thái Hà Books",
    address: "19 Láng Hạ, Đống Đa, Hà Nội",
    phone: "024 3514 8545",
    email: "info@thaihabooks.com"
  },
  {
    id: 4,
    name: "Alpha Books",
    address: "36 Xuân Thủy, Cầu Giấy, Hà Nội",
    phone: "024 3782 0739",
    email: "contact@alphabooks.vn"
  },
  {
    id: 5,
    name: "First News - Trí Việt",
    address: "11H Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    phone: "028 3822 0796",
    email: "triviet@firstnews.com.vn"
  },
  {
    id: 6,
    name: "Đông A Book",
    address: "113 Đông Các, Đống Đa, Hà Nội",
    phone: "024 3856 9381",
    email: "info@dongabooks.vn"
  },
  {
    id: 7,
    name: "Nhà sách Tiền Phong",
    address: "15 Hai Bà Trưng, Hoàn Kiếm, Hà Nội",
    phone: "024 3936 5724",
    email: "nstienphong@gmail.com"
  },
  {
    id: 8,
    name: "Công ty Sách và Thiết bị Giáo dục miền Nam",
    address: "240 Trần Bình Trọng, Quận 5, TP.HCM",
    phone: "028 3835 2371",
    email: "info@sachmn.vn"
  }
];

const SupplierTable = ({ onEdit, onDelete }) => {
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
              <th>Tên nhà cung cấp</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th style={{ width: "100px" }}>Thao tác</th>
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
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td
                  colSpan="6"
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