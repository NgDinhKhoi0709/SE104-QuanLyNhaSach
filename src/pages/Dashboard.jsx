import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faListUl,
  faBuilding,
  faFileImport,
  faTruck,
  faFileInvoice,
  faTag,
  faChartBar,
  faCog,
  faUser,
  faPlus,
  faTrash,
  faTimes,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import "./Dashboard.css";

// Dữ liệu mẫu cho các sách
const sampleBooks = [
  {
    id: 1,
    title: "Đắc nhân tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    publisher: "NXB Tổng hợp",
    price: "85.000 ₫",
    stock: 25,
    status: "active",
  },
  {
    id: 2,
    title: "Nhà giả kim",
    author: "Paulo Coelho",
    category: "Tiểu thuyết",
    publisher: "NXB Văn học",
    price: "65.000 ₫",
    stock: 18,
    status: "active",
  },
  {
    id: 3,
    title: "Tuổi trẻ đáng giá bao nhiêu",
    author: "Rosie Nguyễn",
    category: "Kỹ năng sống",
    publisher: "NXB Hội Nhà văn",
    price: "70.000 ₫",
    stock: 12,
    status: "active",
  },
  {
    id: 4,
    title: "Cây cam ngọt của tôi",
    author: "José Mauro de Vasconcelos",
    category: "Tiểu thuyết",
    publisher: "NXB Hội Nhà văn",
    price: "108.000 ₫",
    stock: 8,
    status: "active",
  },
  {
    id: 5,
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    author: "Nguyễn Nhật Ánh",
    category: "Tiểu thuyết",
    publisher: "NXB Trẻ",
    price: "83.000 ₫",
    stock: 0,
    status: "inactive",
  },
  {
    id: 6,
    title: "Đời ngắn đừng ngủ dài",
    author: "Robin Sharma",
    category: "Kỹ năng sống",
    publisher: "NXB Trẻ",
    price: "60.000 ₫",
    stock: 15,
    status: "active",
  },
];

// Dữ liệu mẫu cho menu sidebar
const menuItems = [
  {
    path: "/books",
    label: "Quản lý đầu sách",
    icon: <FontAwesomeIcon icon={faBook} />,
  },
  {
    path: "/categories",
    label: "Quản lý thể loại sách",
    icon: <FontAwesomeIcon icon={faListUl} />,
  },
  {
    path: "/publishers",
    label: "Quản lý nhà xuất bản",
    icon: <FontAwesomeIcon icon={faBuilding} />,
  },
  {
    path: "/imports",
    label: "Quản lý nhập sách",
    icon: <FontAwesomeIcon icon={faFileImport} />,
  },
  {
    path: "/suppliers",
    label: "Quản lý nhà cung cấp",
    icon: <FontAwesomeIcon icon={faTruck} />,
  },
  {
    path: "/invoices",
    label: "Quản lý hóa đơn",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
  },
  {
    path: "/promotions",
    label: "Quản lý khuyến mãi",
    icon: <FontAwesomeIcon icon={faTag} />,
  },
  {
    path: "/reports",
    label: "Báo cáo/ Thống kê",
    icon: <FontAwesomeIcon icon={faChartBar} />,
  },
  {
    path: "/rules",
    label: "Thay đổi quy định",
    icon: <FontAwesomeIcon icon={faCog} />,
  },
  {
    path: "/accounts",
    label: "Quản lý tài khoản",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
];

const Dashboard = () => {
  const location = useLocation();
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Xác định trang hiện tại dựa trên URL
  const currentPath = location.pathname;
  const currentRoute = currentPath === "/" ? "/books" : currentPath;
  const currentMenuItem =
    menuItems.find((item) => item.path === currentRoute) || menuItems[0];
  const pageTitle = currentMenuItem.label;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sampleBooks.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sampleBooks.length / recordsPerPage);

  // Xử lý chọn/bỏ chọn row
  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Xử lý bỏ chọn tất cả
  const deselectAll = () => {
    setSelectedRows([]);
  };

  // Header actions
  const headerActions = [
    {
      label: "Thêm mới",
      className: "btn-add",
      onClick: () => alert("Mở form thêm mới"),
      icon: <FontAwesomeIcon icon={faPlus} />,
    },
    {
      label: "Xóa",
      className: "btn-delete",
      onClick: () => {
        if (selectedRows.length > 0) {
          alert(`Xóa các mục: ${selectedRows.join(", ")}`);
        } else {
          alert("Vui lòng chọn ít nhất một mục để xóa");
        }
      },
      icon: <FontAwesomeIcon icon={faTrash} />,
    },
    {
      label: "Bỏ chọn",
      className: "btn-deselect",
      onClick: deselectAll,
      icon: <FontAwesomeIcon icon={faTimes} />,
    },
  ];

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard">
      <Sidebar menuItems={menuItems} />

      <div className="dashboard-content">
        <Header title={pageTitle} actions={headerActions} />

        <div className="content-wrapper">
          <div className="dashboard-heading">
            <h2 className="dashboard-title">
              Danh sách {pageTitle.toLowerCase()}
            </h2>
          </div>

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
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Nhà xuất bản</th>
                  <th>Giá bán</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th style={{ width: "100px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(book.id)}
                        onChange={() => toggleRowSelection(book.id)}
                      />
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.publisher}</td>
                    <td>{book.price}</td>
                    <td>{book.stock}</td>
                    <td>
                      <span className={`status-badge status-${book.status}`}>
                        {book.status === "active" ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                      <td className="actions">
                        <button
                          className="action-button edit-button"
                          title="Sửa"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button
                          className="action-button delete-button"
                          title="Xóa"
                        >
                          <FontAwesomeIcon icon={faTrash} />
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
              {Math.min(indexOfLastRecord, sampleBooks.length)} của{" "}
              {sampleBooks.length} mục
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
