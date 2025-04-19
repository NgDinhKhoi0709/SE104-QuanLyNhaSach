import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faEye,
  faPrint,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import InvoiceForm from "../forms/InvoiceForm";
import InvoiceDetailsModal from "../modals/InvoiceDetailsModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import "../../styles/SearchBar.css";
import "./InvoiceTable.css";

// Sample data
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
    phone: "0912345678",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    email: "levanc@email.com",
    date: "17/03/2024",
    bookDetails: [
      {
        book: "Đắc Nhân Tâm",
        quantity: 1,
        price: "85.000 đ",
        total: "85.000 đ"
      },
      {
        book: "Nhà Giả Kim",
        quantity: 1,
        price: "95.000 đ",
        total: "95.000 đ"
      }
    ],
    total: "180.000 đ"
  },
  {
    id: 4,
    invoiceCode: "HD004",
    customerName: "Phạm Thị D",
    phone: "0923456789",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    email: "phamthid@email.com",
    date: "17/03/2024",
    bookDetails: [
      {
        book: "Harry Potter và Hòn Đá Phù Thủy",
        quantity: 1,
        price: "120.000 đ",
        total: "120.000 đ"
      }
    ],
    total: "120.000 đ"
  },
  {
    id: 5,
    invoiceCode: "HD005",
    customerName: "Hoàng Văn E",
    phone: "0934567890",
    address: "654 Đường JKL, Quận 5, TP.HCM",
    email: "hoangvane@email.com",
    date: "18/03/2024",
    bookDetails: [
      {
        book: "Sherlock Holmes - Toàn Tập",
        quantity: 1,
        price: "250.000 đ",
        total: "250.000 đ"
      }
    ],
    total: "250.000 đ"
  },
  {
    id: 6,
    invoiceCode: "HD006",
    customerName: "Vũ Thị F",
    phone: "0945678901",
    address: "987 Đường MNO, Quận 6, TP.HCM",
    email: "vuthif@email.com",
    date: "18/03/2024",
    bookDetails: [
      {
        book: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        quantity: 2,
        price: "80.000 đ",
        total: "160.000 đ"
      }
    ],
    total: "160.000 đ"
  },
  {
    id: 7,
    invoiceCode: "HD007",
    customerName: "Đặng Văn G",
    phone: "0956789012",
    address: "147 Đường PQR, Quận 7, TP.HCM",
    email: "dangvang@email.com",
    date: "19/03/2024",
    bookDetails: [
      {
        book: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
        quantity: 1,
        price: "75.000 đ",
        total: "75.000 đ"
      },
      {
        book: "Mắt Biếc",
        quantity: 1,
        price: "85.000 đ",
        total: "85.000 đ"
      }
    ],
    total: "160.000 đ"
  },
  {
    id: 8,
    invoiceCode: "HD008",
    customerName: "Mai Thị H",
    phone: "0967890123",
    address: "258 Đường STU, Quận 8, TP.HCM",
    email: "maithih@email.com",
    date: "19/03/2024",
    bookDetails: [
      {
        book: "Dế Mèn Phiêu Lưu Ký",
        quantity: 3,
        price: "45.000 đ",
        total: "135.000 đ"
      }
    ],
    total: "135.000 đ"
  },
  {
    id: 9,
    invoiceCode: "HD009",
    customerName: "Trương Văn I",
    phone: "0978901234",
    address: "369 Đường VWX, Quận 9, TP.HCM",
    email: "truongvani@email.com",
    date: "20/03/2024",
    bookDetails: [
      {
        book: "Số Đỏ",
        quantity: 1,
        price: "65.000 đ",
        total: "65.000 đ"
      },
      {
        book: "Chí Phèo",
        quantity: 1,
        price: "55.000 đ",
        total: "55.000 đ"
      }
    ],
    total: "120.000 đ"
  },
  {
    id: 10,
    invoiceCode: "HD010",
    customerName: "Lý Thị K",
    phone: "0989012345",
    address: "741 Đường YZ, Quận 10, TP.HCM",
    email: "lythik@email.com",
    date: "20/03/2024",
    bookDetails: [
      {
        book: "Lập Trình C++ Cơ Bản",
        quantity: 1,
        price: "150.000 đ",
        total: "150.000 đ"
      }
    ],
    total: "150.000 đ"
  },
  {
    id: 11,
    invoiceCode: "HD011",
    customerName: "Ngô Văn L",
    phone: "0990123456",
    address: "852 Đường AAA, Quận 11, TP.HCM",
    email: "ngovanl@email.com",
    date: "21/03/2024",
    bookDetails: [
      {
        book: "Python cho người mới bắt đầu",
        quantity: 1,
        price: "180.000 đ",
        total: "180.000 đ"
      },
      {
        book: "JavaScript Cơ Bản",
        quantity: 1,
        price: "160.000 đ",
        total: "160.000 đ"
      }
    ],
    total: "340.000 đ"
  },
  {
    id: 12,
    invoiceCode: "HD012",
    customerName: "Đinh Thị M",
    phone: "0901234567",
    address: "963 Đường BBB, Quận 12, TP.HCM",
    email: "dinhthim@email.com",
    date: "21/03/2024",
    bookDetails: [
      {
        book: "Toán Cao Cấp Tập 1",
        quantity: 1,
        price: "95.000 đ",
        total: "95.000 đ"
      },
      {
        book: "Vật Lý Đại Cương",
        quantity: 1,
        price: "85.000 đ",
        total: "85.000 đ"
      }
    ],
    total: "180.000 đ"
  },
  {
    id: 13,
    invoiceCode: "HD013",
    customerName: "Bùi Văn N",
    phone: "0912345678",
    address: "159 Đường CCC, Thủ Đức, TP.HCM",
    email: "buivann@email.com",
    date: "22/03/2024",
    bookDetails: [
      {
        book: "Marketing Căn Bản",
        quantity: 1,
        price: "120.000 đ",
        total: "120.000 đ"
      }
    ],
    total: "120.000 đ"
  },
  {
    id: 14,
    invoiceCode: "HD014",
    customerName: "Cao Thị O",
    phone: "0923456789",
    address: "357 Đường DDD, Bình Thạnh, TP.HCM",
    email: "caothio@email.com",
    date: "22/03/2024",
    bookDetails: [
      {
        book: "Kinh Tế Vĩ Mô",
        quantity: 1,
        price: "140.000 đ",
        total: "140.000 đ"
      },
      {
        book: "Kinh Tế Vi Mô",
        quantity: 1,
        price: "140.000 đ",
        total: "140.000 đ"
      }
    ],
    total: "280.000 đ"
  },
  {
    id: 15,
    invoiceCode: "HD015",
    customerName: "Đỗ Văn P",
    phone: "0934567890",
    address: "753 Đường EEE, Gò Vấp, TP.HCM",
    email: "dovanp@email.com",
    date: "23/03/2024",
    bookDetails: [
      {
        book: "Tiếng Anh Giao Tiếp",
        quantity: 1,
        price: "95.000 đ",
        total: "95.000 đ"
      },
      {
        book: "TOEIC 900+",
        quantity: 1,
        price: "185.000 đ",
        total: "185.000 đ"
      }
    ],
    total: "280.000 đ"
  },
  {
    id: 16,
    invoiceCode: "HD016",
    customerName: "Hồ Thị Q",
    phone: "0945678901",
    address: "951 Đường FFF, Tân Bình, TP.HCM",
    email: "hothiq@email.com",
    date: "23/03/2024",
    bookDetails: [
      {
        book: "Quản Trị Học",
        quantity: 2,
        price: "110.000 đ",
        total: "220.000 đ"
      }
    ],
    total: "220.000 đ"
  },
  {
    id: 17,
    invoiceCode: "HD017",
    customerName: "Phan Văn R",
    phone: "0956789012",
    address: "357 Đường GGG, Tân Phú, TP.HCM",
    email: "phanvanr@email.com",
    date: "24/03/2024",
    bookDetails: [
      {
        book: "Nghệ Thuật Giao Tiếp",
        quantity: 1,
        price: "85.000 đ",
        total: "85.000 đ"
      },
      {
        book: "Đọc Vị Bất Kỳ Ai",
        quantity: 1,
        price: "95.000 đ",
        total: "95.000 đ"
      }
    ],
    total: "180.000 đ"
  },
  {
    id: 18,
    invoiceCode: "HD018",
    customerName: "Trịnh Văn S",
    phone: "0967890123",
    address: "248 Đường HHH, Phú Nhuận, TP.HCM",
    email: "trinhvans@email.com",
    date: "24/03/2024",
    bookDetails: [
      {
        book: "Giáo Trình Tiếng Anh Toeic",
        quantity: 30,
        price: "150.000 đ",
        total: "4.500.000 đ"
      }
    ],
    total: "4.500.000 đ"
  },
  {
    id: 19,
    invoiceCode: "HD019",
    customerName: "Lương Thị T",
    phone: "0978901234",
    address: "135 Đường III, Bình Tân, TP.HCM",
    email: "luongthit@email.com",
    date: "24/03/2024",
    bookDetails: [
      {
        book: "Đắc Nhân Tâm",
        quantity: 1,
        price: "85.000 đ",
        total: "85.000 đ"
      },
      {
        book: "Nhà Giả Kim",
        quantity: 1,
        price: "95.000 đ",
        total: "95.000 đ"
      },
      {
        book: "Cách Nghĩ Để Thành Công",
        quantity: 1,
        price: "90.000 đ",
        total: "90.000 đ"
      },
      {
        book: "Đọc Vị Bất Kỳ Ai",
        quantity: 1,
        price: "95.000 đ",
        total: "95.000 đ"
      },
      {
        book: "Nghệ Thuật Giao Tiếp",
        quantity: 1,
        price: "85.000 đ",
        total: "85.000 đ"
      },
      {
        book: "Tư Duy Phản Biện",
        quantity: 1,
        price: "120.000 đ",
        total: "120.000 đ"
      },
      {
        book: "Thói Quen Thành Công",
        quantity: 1,
        price: "110.000 đ",
        total: "110.000 đ"
      },
      {
        book: "Người Giàu Có Nhất Thành Babylon",
        quantity: 1,
        price: "150.000 đ",
        total: "150.000 đ"
      },
      {
        book: "Khởi Nghiệp Thông Minh",
        quantity: 1,
        price: "130.000 đ",
        total: "130.000 đ"
      },
      {
        book: "7 Thói Quen Hiệu Quả",
        quantity: 1,
        price: "140.000 đ",
        total: "140.000 đ"
      }
    ],
    total: "1.100.000 đ"
  }
];

const InvoiceTable = ({ onEdit, onDelete, onView, onPrint }) => {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const recordsPerPage = 10;
  
  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.phone.includes(searchQuery)
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredInvoices.length / recordsPerPage);

  // Kiểm tra xem tất cả các mục trên tất cả các trang đã được chọn chưa
  const areAllItemsSelected = filteredInvoices.length > 0 && 
    filteredInvoices.every(invoice => selectedRows.includes(invoice.id));

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowForm(true);
  };

  const handleDeleteInvoices = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setInvoices(invoices.filter((invoice) => !selectedRows.includes(invoice.id)));
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };

  const handleInvoiceSubmit = (formData) => {
    if (selectedInvoice) {
      // Edit existing invoice
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === selectedInvoice.id
            ? { ...invoice, ...formData }
            : invoice
        )
      );
    } else {
      // Add new invoice
      const newInvoice = {
        id: invoices.length + 1,
        ...formData,
      };
      setInvoices([...invoices, newInvoice]);
    }
    setShowForm(false);
  };

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredInvoices.map(invoice => invoice.id));
    }
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handlePrintInvoice = (invoice) => {
    if (onPrint) {
      onPrint(invoice);
    }
  };

  const formatCurrency = (value) => {
    // Remove any existing formatting and 'đ' symbol
    const numericValue = value.replace(/[,.đ\s]/g, '');
    
    // Format with commas and add VNĐ
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VNĐ";
  };

  return (
    <>
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hóa đơn, tên khách hàng, số điện thoại..."
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
          <button className="btn btn-add" onClick={handleAddInvoice}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeleteInvoices}
            disabled={selectedRows.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
          <button
            className="btn btn-edit"
            onClick={() => {
              if (selectedRows.length === 1) {
                const invoice = invoices.find((c) => c.id === selectedRows[0]);
                handleEditInvoice(invoice);
              } else {
                alert("Vui lòng chọn một hóa đơn để sửa");
              }
            }}
            disabled={selectedRows.length !== 1}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Sửa
          </button>
        </div>
      </div>

      <div className="invoice-table-container">
        <table className="invoice-table">
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
              <th>Mã hóa đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Ngày lập</th>
              <th>Sách</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((invoice) => (
              <tr
                key={invoice.id}
                className={selectedRows.includes(invoice.id) ? "selected" : ""}
              >
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
                <td className="books-column">
                  {invoice.bookDetails.map(book => book.book).join(", ").length > 70 
                    ? invoice.bookDetails.map(book => book.book).join(", ").substring(0, 70) + "..."
                    : invoice.bookDetails.map(book => book.book).join(", ")}
                </td>
                <td>{formatCurrency(invoice.total)}</td>
                <td className="actions">
                  <button
                    className="btn btn-view"
                    onClick={() => handleViewDetails(invoice)}
                    title="Xem chi tiết"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="btn btn-print"
                    onClick={() => handlePrintInvoice(invoice)}
                    title="In hóa đơn"
                  >
                    <FontAwesomeIcon icon={faPrint} />
                  </button>
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {areAllItemsSelected && filteredInvoices.length > currentRecords.length && (
          <div className="all-pages-selected-info">
            Đã chọn tất cả {filteredInvoices.length} mục trên {totalPages} trang
          </div>
        )}
        <div className="pagination-info">
          Hiển thị {indexOfFirstRecord + 1} đến{" "}
          {Math.min(indexOfLastRecord, filteredInvoices.length)} của{" "}
          {filteredInvoices.length} mục
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
            <InvoiceForm
              invoice={selectedInvoice}
              onSubmit={handleInvoiceSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDetailsModal && (
        <InvoiceDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          invoice={selectedInvoice}
        />
      )}
      
      {/* Modal xác nhận xóa */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa hóa đơn"
        message={`Bạn có chắc chắn muốn xóa ${selectedRows.length} hóa đơn đã chọn? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default InvoiceTable;