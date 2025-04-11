import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faEye, faPrint } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho hóa đơn
const sampleInvoices = [
  {
    id: "HD001",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    email: "nguyenvana@email.com",
    date: "10/04/2025",
    items: [
      { book: "Đắc nhân tâm", quantity: 1, price: "85.000 ₫" },
      { book: "Nhà giả kim", quantity: 1, price: "65.000 ₫" }
    ],
    total: "150.000 ₫",
    status: "Đã thanh toán"
  },
  {
    id: "HD002",
    customerName: "Trần Thị B",
    phone: "0909876543",
    address: "456 Lê Văn Việt, Quận 9, TP.HCM",
    email: "tranthib@email.com",
    date: "09/04/2025",
    items: [
      { book: "Cây cam ngọt của tôi", quantity: 1, price: "108.000 ₫" }
    ],
    total: "108.000 ₫",
    status: "Đã thanh toán"
  },
  {
    id: "HD003",
    customerName: "Lê Văn C",
    phone: "0978123456",
    address: "789 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    email: "levanc@email.com",
    date: "08/04/2025",
    items: [
      { book: "Tuổi trẻ đáng giá bao nhiêu", quantity: 1, price: "70.000 ₫" },
      { book: "Điều kỳ diệu của tiệm tạp hóa Namiya", quantity: 1, price: "105.000 ₫" },
      { book: "Tư duy nhanh và chậm", quantity: 1, price: "169.000 ₫" }
    ],
    total: "344.000 ₫",
    status: "Đã thanh toán"
  },
  {
    id: "HD004",
    customerName: "Phạm Thị D",
    phone: "0912345678",
    address: "101 Võ Văn Tần, Quận 3, TP.HCM",
    email: "phamthid@email.com",
    date: "07/04/2025",
    items: [
      { book: "Sapiens: Lược sử loài người", quantity: 1, price: "189.000 ₫" }
    ],
    total: "189.000 ₫",
    status: "Đã thanh toán"
  },
  {
    id: "HD005",
    customerName: "Hoàng Văn E",
    phone: "0956781234",
    address: "202 Nguyễn Xí, Bình Thạnh, TP.HCM",
    email: "hoangvane@email.com",
    date: "06/04/2025",
    items: [
      { book: "Tôi thấy hoa vàng trên cỏ xanh", quantity: 1, price: "83.000 ₫" },
      { book: "Mắt biếc", quantity: 1, price: "78.000 ₫" }
    ],
    total: "161.000 ₫",
    status: "Đã thanh toán"
  },
  {
    id: "HD006",
    customerName: "Đỗ Thị F",
    phone: "0932123456",
    address: "303 Cách Mạng Tháng Tám, Quận 10, TP.HCM",
    email: "dothif@email.com",
    date: "05/04/2025",
    items: [
      { book: "Đời ngắn đừng ngủ dài", quantity: 1, price: "60.000 ₫" },
      { book: "Nhà lãnh đạo không chức danh", quantity: 1, price: "89.000 ₫" },
      { book: "Đi tìm lẽ sống", quantity: 1, price: "110.000 ₫" }
    ],
    total: "259.000 ₫",
    status: "Đã thanh toán"
  }
];

const InvoiceTable = ({ onEdit, onDelete, onView, onPrint }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sampleInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sampleInvoices.length / recordsPerPage);

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

  // Function hiển thị sách trong hóa đơn
  const displayBooks = (items) => {
    if (items.length === 1) {
      return items[0].book;
    }
    return `${items[0].book} và ${items.length - 1} sách khác`;
  };

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
              <th>Mã hóa đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Ngày</th>
              <th>Sách</th>
              <th>Tổng tiền</th>
              <th style={{ width: "150px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(invoice.id)}
                    onChange={() => toggleRowSelection(invoice.id)}
                  />
                </td>
                <td>{invoice.id}</td>
                <td>{invoice.customerName}</td>
                <td>{invoice.phone}</td>
                <td>{invoice.address}</td>
                <td>{invoice.email || "—"}</td>
                <td>{invoice.date}</td>
                <td>{displayBooks(invoice.items)}</td>
                <td>{invoice.total}</td>
                <td className="actions">
                  <button
                    className="action-button edit-button"
                    title="Sửa"
                    onClick={() => onEdit && onEdit(invoice)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Xóa"
                    onClick={() => onDelete && onDelete(invoice.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="action-button view-button"
                    title="Xem chi tiết"
                    onClick={() => onView && onView(invoice)}
                    style={{ color: "#2196F3" }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="action-button print-button"
                    title="In hóa đơn"
                    onClick={() => onPrint && onPrint(invoice)}
                    style={{ color: "#4CAF50" }}
                  >
                    <FontAwesomeIcon icon={faPrint} />
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
          {Math.min(indexOfLastRecord, sampleInvoices.length)} của{" "}
          {sampleInvoices.length} mục
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

export default InvoiceTable;