import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faEye, faPrint } from "@fortawesome/free-solid-svg-icons";
import InvoiceDetailsModal from "../modals/InvoiceDetailsModal";

// Dữ liệu mẫu cho hóa đơn
const sampleInvoices = [
  {
    id: 1,
    invoiceCode: "HD001",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    email: "nguyenvana@email.com",
    date: "15/03/2024",
    bookDetails: [
      {
        book: "Tuổi trẻ đáng giá bao nhiêu",
        quantity: 1,
        price: "70.000 đ",
        total: "70.000 đ"
      },
      {
        book: "Điều kỳ diệu của tiệm tạp hóa Namiya",
        quantity: 1,
        price: "105.000 đ",
        total: "105.000 đ"
      }
    ],
    total: "175.000 đ"
  },
  {
    id: 2,
    invoiceCode: "HD002",
    customerName: "Trần Thị B",
    phone: "0909876543",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    email: "tranthib@email.com",
    date: "16/03/2024",
    bookDetails: [
      {
        book: "Cách Nghĩ Để Thành Công",
        quantity: 2,
        price: "90.000 đ",
        total: "180.000 đ"
      }
    ],
    total: "180.000 đ"
  },
  {
    id: 3,
    invoiceCode: "HD003",
    customerName: "Lê Văn C",
    phone: "0905555666",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    email: "levanc@email.com",
    date: "16/03/2024",
    bookDetails: [
      {
        book: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        quantity: 1,
        price: "150.000 đ",
        total: "150.000 đ"
      },
      {
        book: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ",
        quantity: 1,
        price: "200.000 đ",
        total: "200.000 đ"
      }
    ],
    total: "350.000 đ"
  },
  {
    id: 4,
    invoiceCode: "HD004",
    customerName: "Phạm Thị D",
    phone: "0903333444",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    email: "phamthid@email.com",
    date: "17/03/2024",
    bookDetails: [
      {
        book: "Người Giàu Có Nhất Thành Babylon",
        quantity: 1,
        price: "150.000 đ",
        total: "150.000 đ"
      }
    ],
    total: "150.000 đ"
  },
  {
    id: 5,
    invoiceCode: "HD005",
    customerName: "Hoàng Văn E",
    phone: "0907777888",
    address: "147 Đường JKL, Quận 5, TP.HCM",
    email: "hoangvane@email.com",
    date: "17/03/2024",
    bookDetails: [
      {
        book: "Đọc Vị Bất Kỳ Ai",
        quantity: 1,
        price: "130.000 đ",
        total: "130.000 đ"
      },
      {
        book: "Nghệ Thuật Giao Tiếp",
        quantity: 1,
        price: "150.000 đ",
        total: "150.000 đ"
      }
    ],
    total: "280.000 đ"
  },
  {
    id: 6,
    invoiceCode: "HD006",
    customerName: "Vũ Thị F",
    phone: "0904444555",
    address: "258 Đường MNO, Quận 6, TP.HCM",
    email: "vuthif@email.com",
    date: "18/03/2024",
    bookDetails: [
      {
        book: "Tư Duy Phản Biện",
        quantity: 1,
        price: "120.000 đ",
        total: "120.000 đ"
      }
    ],
    total: "120.000 đ"
  },
  {
    id: 7,
    invoiceCode: "HD007",
    customerName: "Đặng Văn G",
    phone: "0908888999",
    address: "369 Đường PQR, Quận 7, TP.HCM",
    email: "dangvang@email.com",
    date: "18/03/2024",
    bookDetails: [
      {
        book: "Atomic Habits",
        quantity: 1,
        price: "250.000 đ",
        total: "250.000 đ"
      },
      {
        book: "Deep Work",
        quantity: 1,
        price: "200.000 đ",
        total: "200.000 đ"
      }
    ],
    total: "450.000 đ"
  },
  {
    id: 8,
    invoiceCode: "HD008",
    customerName: "Mai Thị H",
    phone: "0902222333",
    address: "741 Đường STU, Quận 8, TP.HCM",
    email: "maithih@email.com",
    date: "19/03/2024",
    bookDetails: [
      {
        book: "Tâm Lý Học Đám Đông",
        quantity: 1,
        price: "160.000 đ",
        total: "160.000 đ"
      }
    ],
    total: "160.000 đ"
  },
  {
    id: 9,
    invoiceCode: "HD009",
    customerName: "Trương Văn I",
    phone: "0906666777",
    address: "852 Đường VWX, Quận 9, TP.HCM",
    email: "truongvani@email.com",
    date: "19/03/2024",
    bookDetails: [
      {
        book: "Nhà Lãnh Đạo Không Chức Danh",
        quantity: 1,
        price: "190.000 đ",
        total: "190.000 đ"
      }
    ],
    total: "190.000 đ"
  },
  {
    id: 10,
    invoiceCode: "HD010",
    customerName: "Lý Thị K",
    phone: "0901111222",
    address: "963 Đường YZ, Quận 10, TP.HCM",
    email: "lythik@email.com",
    date: "20/03/2024",
    bookDetails: [
      {
        book: "Đời Ngắn Đừng Ngủ Dài",
        quantity: 1,
        price: "140.000 đ",
        total: "140.000 đ"
      }
    ],
    total: "140.000 đ"
  },
  {
    id: 11,
    invoiceCode: "HD011",
    customerName: "Ngô Văn L",
    phone: "0905555999",
    address: "159 Đường AA, Quận 11, TP.HCM",
    email: "ngovanl@email.com",
    date: "20/03/2024",
    books: "Thói Quen Thành Công, Người Thành Công Có 1% Khác Biệt",
    total: "320.000₫"
  },
  {
    id: 12,
    invoiceCode: "HD012",
    customerName: "Đinh Thị M",
    phone: "0903333777",
    address: "357 Đường BB, Quận 12, TP.HCM",
    email: "dinhthim@email.com",
    date: "21/03/2024",
    books: "Đắc Nhân Tâm (Bản Đặc Biệt)",
    total: "250.000₫"
  },
  {
    id: 13,
    invoiceCode: "HD013",
    customerName: "Bùi Văn N",
    phone: "0907777333",
    address: "951 Đường CC, Quận Bình Thạnh, TP.HCM",
    email: "buivann@email.com",
    date: "21/03/2024",
    books: "Sách Giáo Khoa Lớp 10 (Trọn Bộ)",
    total: "850.000₫"
  },
  {
    id: 14,
    invoiceCode: "HD014",
    customerName: "Dương Thị P",
    phone: "0904444888",
    address: "753 Đường DD, Quận Tân Bình, TP.HCM",
    email: "duongthip@email.com",
    date: "22/03/2024",
    books: "Sách Tham Khảo Lớp 12 (Bộ 4 Môn)",
    total: "560.000₫"
  },
  {
    id: 15,
    invoiceCode: "HD015",
    customerName: "Hồ Văn Q",
    phone: "0908888444",
    address: "159 Đường EE, Quận Phú Nhuận, TP.HCM",
    email: "hovanq@email.com",
    date: "22/03/2024",
    books: "Bộ Sách Kỹ Năng Sống (5 Cuốn)",
    total: "750.000₫"
  }
];

const InvoiceTable = ({ onEdit, onDelete, onView, onPrint }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Xử lý khi click vào nút xem chi tiết
  const handleViewClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <div className="data-table-container">
        <table className="data-table invoice-table">
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
              <th>Mã hóa đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Ngày</th>
              <th>Sách</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
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
                <td>{invoice.invoiceCode}</td>
                <td>{invoice.customerName}</td>
                <td>{invoice.phone}</td>
                <td>{invoice.address}</td>
                <td>{invoice.email}</td>
                <td>{invoice.date}</td>
                <td>{invoice.bookDetails.map(bd => bd.book).join(", ")}</td>
                <td style={{ textAlign: 'right' }}>{invoice.total}</td>
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
                    onClick={() => handleViewClick(invoice)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="action-button print-button"
                    title="In hóa đơn"
                    onClick={() => onPrint && onPrint(invoice)}
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

      <InvoiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoice={selectedInvoice}
      />
    </>
  );
};

export default InvoiceTable;