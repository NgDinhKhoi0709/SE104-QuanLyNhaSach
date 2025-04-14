import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
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
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import CategoryTable from "../components/tables/CategoryTable";
import PublisherTable from "../components/tables/PublisherTable";
import ImportTable from "../components/tables/ImportTable";
import SupplierTable from "../components/tables/SupplierTable";
import InvoiceTable from "../components/tables/InvoiceTable";
import PromotionTable from "../components/tables/PromotionTable";
import ReportStatistics from "../components/reports/ReportStatistics";
import RulesSettings from "../components/rules/RulesSettings";
import AccountsPage from "./accounts/AccountsPage";
import BookForm from "../components/forms/BookForm";
import { useAuth } from "../contexts/AuthContext";
import { useAuthorization } from "../contexts/AuthorizationContext";
import { formatCurrency } from "../utils/format";
import "./Dashboard.css";

// Dữ liệu mẫu cho các sách
const sampleBooks = [
  {
    id: 1,
    title: "Đắc nhân tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    publisher: "NXB Tổng hợp",
    price: 85000,
    stock: 25,
    status: "active",
  },
  {
    id: 2,
    title: "Nhà giả kim",
    author: "Paulo Coelho",
    category: "Tiểu thuyết",
    publisher: "NXB Văn học",
    price: 65000,
    stock: 18,
    status: "active",
  },
  {
    id: 3,
    title: "Tuổi trẻ đáng giá bao nhiêu",
    author: "Rosie Nguyễn",
    category: "Kỹ năng sống",
    publisher: "NXB Hội Nhà văn",
    price: 70000,
    stock: 12,
    status: "active",
  },
  {
    id: 4,
    title: "Cây cam ngọt của tôi",
    author: "José Mauro de Vasconcelos",
    category: "Tiểu thuyết",
    publisher: "NXB Hội Nhà văn",
    price: 108000,
    stock: 8,
    status: "active",
  },
  {
    id: 5,
    title: "Tôi thấy hoa vàng trên cỏ xanh",
    author: "Nguyễn Nhật Ánh",
    category: "Tiểu thuyết",
    publisher: "NXB Trẻ",
    price: 83000,
    stock: 0,
    status: "inactive",
  },
  {
    id: 6,
    title: "Đời ngắn đừng ngủ dài",
    author: "Robin Sharma",
    category: "Kỹ năng sống",
    publisher: "NXB Trẻ",
    price: 60000,
    stock: 15,
    status: "active",
  },
  {
    id: 7,
    title: "Muôn kiếp nhân sinh",
    author: "Nguyên Phong",
    category: "Tâm linh",
    publisher: "NXB Tổng hợp",
    price: 120000,
    stock: 5,
    status: "active",
  },
  {
    id: 8,
    title: "Chiến binh cầu vồng",
    author: "Andrea Hirata",
    category: "Tiểu thuyết",
    publisher: "NXB Trẻ",
    price: 95000,
    stock: 7,
    status: "active",
  },
  {
    id: 9,
    title: "Dám bị ghét",
    author: "Ichiro Kishimi",
    category: "Tâm lý học",
    publisher: "NXB Lao Động",
    price: 98000,
    stock: 14,
    status: "active",
  },
  {
    id: 10,
    title: "Thiên nga đen",
    author: "Nassim Taleb",
    category: "Kinh tế học",
    publisher: "NXB Trẻ",
    price: 130000,
    stock: 3,
    status: "active",
  },
  {
    id: 11,
    title: "Hoàng tử bé",
    author: "Antoine de Saint-Exupéry",
    category: "Thiếu nhi",
    publisher: "NXB Kim Đồng",
    price: 55000,
    stock: 20,
    status: "active",
  },
  {
    id: 12,
    title: "Sapiens: Lược sử loài người",
    author: "Yuval Noah Harari",
    category: "Lịch sử",
    publisher: "NXB Dân Trí",
    price: 189000,
    stock: 10,
    status: "active",
  },
  {
    id: 13,
    title: "Totto-chan bên cửa sổ",
    author: "Tetsuko Kuroyanagi",
    category: "Hồi ký",
    publisher: "NXB Trẻ",
    price: 75000,
    stock: 22,
    status: "active",
  },
  {
    id: 14,
    title: "Bí mật của may mắn",
    author: "Álex Rovira",
    category: "Truyện ngắn",
    publisher: "NXB Lao Động",
    price: 49000,
    stock: 30,
    status: "active",
  },
  {
    id: 15,
    title: "Người truyền ký ức",
    author: "Lois Lowry",
    category: "Khoa học viễn tưởng",
    publisher: "NXB Văn Học",
    price: 90000,
    stock: 0,
    status: "inactive",
  },
  {
    id: 16,
    title: "Cà phê cùng Tony",
    author: "Tony Buổi Sáng",
    category: "Truyền cảm hứng",
    publisher: "NXB Trẻ",
    price: 65000,
    stock: 26,
    status: "active",
  },
  {
    id: 17,
    title: "Đi tìm lẽ sống",
    author: "Viktor Frankl",
    category: "Tâm lý học",
    publisher: "NXB Tổng hợp",
    price: 110000,
    stock: 17,
    status: "active",
  },
  {
    id: 18,
    title: "Sherlock Holmes toàn tập",
    author: "Arthur Conan Doyle",
    category: "Trinh thám",
    publisher: "NXB Văn Học",
    price: 240000,
    stock: 9,
    status: "active",
  },
  {
    id: 19,
    title: "Kẻ trộm sách",
    author: "Markus Zusak",
    category: "Lịch sử giả tưởng",
    publisher: "NXB Văn Học",
    price: 160000,
    stock: 2,
    status: "active",
  },
  {
    id: 20,
    title: "Đồi gió hú",
    author: "Emily Brontë",
    category: "Kinh điển",
    publisher: "NXB Văn Học",
    price: 88000,
    stock: 12,
    status: "active",
  },
  {
    id: 21,
    title: "Chúng ta rồi sẽ ổn thôi",
    author: "Nguyễn Thiên Ngân",
    category: "Tản văn",
    publisher: "NXB Trẻ",
    price: 69000,
    stock: 6,
    status: "active",
  },
  {
    id: 22,
    title: "Bí mật tư duy triệu phú",
    author: "T. Harv Eker",
    category: "Kinh doanh",
    publisher: "NXB Lao Động",
    price: 105000,
    stock: 11,
    status: "active",
  },
  {
    id: 23,
    title: "Tuổi trẻ không trì hoãn",
    author: "Thần Cách",
    category: "Kỹ năng sống",
    publisher: "NXB Văn Học",
    price: 87000,
    stock: 13,
    status: "active",
  },
  {
    id: 24,
    title: "Giết con chim nhại",
    author: "Harper Lee",
    category: "Kinh điển",
    publisher: "NXB Văn Học",
    price: 115000,
    stock: 4,
    status: "active",
  },
  {
    id: 25,
    title: "Không gia đình",
    author: "Hector Malot",
    category: "Kinh điển",
    publisher: "NXB Kim Đồng",
    price: 92000,
    stock: 15,
    status: "active",
  },
  {
    id: 26,
    title: "Mắt biếc",
    author: "Nguyễn Nhật Ánh",
    category: "Tiểu thuyết",
    publisher: "NXB Trẻ",
    price: 78000,
    stock: 10,
    status: "active",
  },
  {
    id: 27,
    title: "Lược sử thời gian",
    author: "Stephen Hawking",
    category: "Khoa học",
    publisher: "NXB Trẻ",
    price: 135000,
    stock: 6,
    status: "active",
  },
  {
    id: 28,
    title: "Điều kỳ diệu của tiệm tạp hóa Namiya",
    author: "Higashino Keigo",
    category: "Tiểu thuyết",
    publisher: "NXB Hội Nhà Văn",
    price: 105000,
    stock: 9,
    status: "active",
  },
  {
    id: 29,
    title: "Tư duy nhanh và chậm",
    author: "Daniel Kahneman",
    category: "Tâm lý học",
    publisher: "NXB Thế Giới",
    price: 169000,
    stock: 3,
    status: "active",
  },
  {
    id: 30,
    title: "Nghệ thuật sống",
    author: "Epictetus",
    category: "Triết học",
    publisher: "NXB Tri Thức",
    price: 62000,
    stock: 14,
    status: "active",
  },
  {
    id: 31,
    title: "Hạt giống tâm hồn",
    author: "Nhiều tác giả",
    category: "Truyền cảm hứng",
    publisher: "NXB Tổng hợp",
    price: 59000,
    stock: 21,
    status: "active",
  },
  {
    id: 32,
    title: "Nỗi buồn chiến tranh",
    author: "Bảo Ninh",
    category: "Chiến tranh",
    publisher: "NXB Hội Nhà Văn",
    price: 95000,
    stock: 2,
    status: "active",
  },
  {
    id: 33,
    title: "Bắt trẻ đồng xanh",
    author: "J. D. Salinger",
    category: "Kinh điển",
    publisher: "NXB Văn Học",
    price: 99000,
    stock: 8,
    status: "active",
  },
  {
    id: 34,
    title: "1984",
    author: "George Orwell",
    category: "Kinh điển",
    publisher: "NXB Dân Trí",
    price: 110000,
    stock: 5,
    status: "active",
  },
  {
    id: 35,
    title: "Thế giới phẳng",
    author: "Thomas L. Friedman",
    category: "Kinh tế",
    publisher: "NXB Trẻ",
    price: 145000,
    stock: 4,
    status: "active",
  },
  {
    id: 36,
    title: "Chúng ta sống có tốt không?",
    author: "Minh Niệm",
    category: "Thiền học",
    publisher: "NXB Văn Hóa",
    price: 90000,
    stock: 11,
    status: "active",
  },
  {
    id: 37,
    title: "Con đường ít người đi",
    author: "M. Scott Peck",
    category: "Tâm lý học",
    publisher: "NXB Tổng hợp",
    price: 102000,
    stock: 7,
    status: "active",
  },
  {
    id: 38,
    title: "Thức tỉnh mục đích sống",
    author: "Eckhart Tolle",
    category: "Tâm linh",
    publisher: "NXB Trẻ",
    price: 129000,
    stock: 3,
    status: "active",
  },
  {
    id: 39,
    title: "Phi lý trí",
    author: "Dan Ariely",
    category: "Tâm lý học",
    publisher: "NXB Lao Động",
    price: 98000,
    stock: 13,
    status: "active",
  },
  {
    id: 40,
    title: "Một lít nước mắt",
    author: "Aya Kito",
    category: "Hồi ký",
    publisher: "NXB Văn Học",
    price: 88000,
    stock: 0,
    status: "inactive",
  },
  {
    id: 41,
    title: "Tuổi thơ dữ dội",
    author: "Phùng Quán",
    category: "Lịch sử",
    publisher: "NXB Kim Đồng",
    price: 75000,
    stock: 10,
    status: "active",
  },
  {
    id: 42,
    title: "Bên kia đường biên",
    author: "Nguyễn Phương Mai",
    category: "Du ký",
    publisher: "NXB Trẻ",
    price: 95000,
    stock: 6,
    status: "active",
  },
  {
    id: 43,
    title: "Ngày xưa có một chuyện tình",
    author: "Nguyễn Nhật Ánh",
    category: "Tiểu thuyết",
    publisher: "NXB Trẻ",
    price: 82000,
    stock: 7,
    status: "active",
  },
  {
    id: 44,
    title: "Không bao giờ là thất bại! Tất cả là thử thách",
    author: "Chung Ju Yung",
    category: "Hồi ký",
    publisher: "NXB Lao Động",
    price: 109000,
    stock: 5,
    status: "active",
  },
  {
    id: 45,
    title: "Nhà lãnh đạo không chức danh",
    author: "Robin Sharma",
    category: "Kỹ năng sống",
    publisher: "NXB Trẻ",
    price: 89000,
    stock: 12,
    status: "active",
  },
  {
    id: 46,
    title: "Lối sống tối giản của người Nhật",
    author: "Sasaki Fumio",
    category: "Phong cách sống",
    publisher: "NXB Thế Giới",
    price: 76000,
    stock: 15,
    status: "active",
  },
  {
    id: 47,
    title: "Đừng lựa chọn an nhàn khi còn trẻ",
    author: "Cảnh Thiên",
    category: "Truyền cảm hứng",
    publisher: "NXB Văn Học",
    price: 86000,
    stock: 9,
    status: "active",
  },
  {
    id: 48,
    title: "Cánh đồng bất tận",
    author: "Nguyễn Ngọc Tư",
    category: "Truyện ngắn",
    publisher: "NXB Trẻ",
    price: 72000,
    stock: 6,
    status: "active",
  },
  {
    id: 49,
    title: "Bố già",
    author: "Mario Puzo",
    category: "Tiểu thuyết",
    publisher: "NXB Văn Học",
    price: 138000,
    stock: 8,
    status: "active",
  },
  {
    id: 50,
    title: "Chiến tranh không có một khuôn mặt phụ nữ",
    author: "Svetlana Alexievich",
    category: "Lịch sử",
    publisher: "NXB Phụ Nữ",
    price: 112000,
    stock: 5,
    status: "active",
  }
];

// Dữ liệu mẫu cho menu sidebar
const menuItems = [
  {
    path: "/books",
    label: "Quản lý đầu sách",
    icon: <FontAwesomeIcon icon={faBook} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/categories",
    label: "Quản lý thể loại sách",
    icon: <FontAwesomeIcon icon={faListUl} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/publishers",
    label: "Quản lý nhà xuất bản",
    icon: <FontAwesomeIcon icon={faBuilding} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/imports",
    label: "Quản lý nhập sách",
    icon: <FontAwesomeIcon icon={faFileImport} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/suppliers",
    label: "Quản lý nhà cung cấp",
    icon: <FontAwesomeIcon icon={faTruck} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/invoices",
    label: "Quản lý hóa đơn",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/promotions",
    label: "Quản lý khuyến mãi",
    icon: <FontAwesomeIcon icon={faTag} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/reports",
    label: "Báo cáo/ Thống kê",
    icon: <FontAwesomeIcon icon={faChartBar} />,
    showActions: false, // Không hiển thị nút hành động
  },
  {
    path: "/rules",
    label: "Thay đổi quy định",
    icon: <FontAwesomeIcon icon={faCog} />,
    showActions: false, // Không hiển thị nút hành động
  },
  {
    path: "/accounts",
    label: "Quản lý tài khoản",
    icon: <FontAwesomeIcon icon={faUser} />,
    showActions: true, // Hiển thị các nút hành động
  },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Thêm hook useNavigate
  const { user } = useAuth(); // Sử dụng user thay vì currentUser cho nhất quán
  const { hasPermission } = useAuthorization();
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState(sampleBooks);

  // Sửa lại useEffect để xử lý chuyển hướng đúng cách
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Sử dụng navigate thay vì trả về component Navigate
    }
  }, [user, navigate]);

  // Xác định trang hiện tại dựa trên URL
  const currentPath = location.pathname;
  const currentRoute = currentPath === "/" ? "/books" : currentPath;
  const currentMenuItem =
    menuItems.find((item) => item.path === currentRoute) || menuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

  // Các hàm xử lý chung cho tất cả các bảng
  const handleEdit = (item) => {
    alert(`Đang sửa ${JSON.stringify(item, null, 2)}`);
  };

  const handleDelete = (id) => {
    alert(`Đang xóa mục có ID: ${id}`);
  };

  const handleView = (item) => {
    alert(`Xem chi tiết: ${JSON.stringify(item, null, 2)}`);
  };

  const handlePrint = (item) => {
    alert(`In hóa đơn: ${JSON.stringify(item, null, 2)}`);
  };

  // Lọc sách dựa trên searchQuery
  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Tính toán phân trang với dữ liệu đã lọc
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBooks.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBooks.length / recordsPerPage);

  // Xử lý chọn/bỏ chọn row
  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Xử lý thêm sách mới
  const handleAddBook = () => {
    setSelectedBook(null);
    setShowBookForm(true);
  };

  // Xử lý chỉnh sửa sách
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowBookForm(true);
  };

  // Xử lý xóa sách
  const handleDeleteBooks = () => {
    if (selectedRows.length === 0) {
      alert("Vui lòng chọn ít nhất một sách để xóa");
      return;
    }
    
    if (window.confirm("Bạn có chắc chắn muốn xóa các sách đã chọn?")) {
      setBooks(books.filter(book => !selectedRows.includes(book.id)));
      setSelectedRows([]);
    }
  };

  // Xử lý submit form
  const handleBookSubmit = (bookData) => {
    if (selectedBook) {
      // Chỉnh sửa sách
      setBooks(
        books.map((book) =>
          book.id === selectedBook.id ? { ...bookData, id: book.id } : book
        )
      );
    } else {
      // Thêm sách mới
      setBooks([...books, { ...bookData, id: books.length + 1 }]);
    }
    setShowBookForm(false);
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
  ];

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render bảng dữ liệu tùy theo trang hiện tại
  const renderTable = () => {
    switch (currentRoute) {
      case "/books":
        return (
          <>
            <div className="table-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="action-buttons">
                <button className="btn btn-add" onClick={handleAddBook}>
                  <FontAwesomeIcon icon={faPlus} /> Thêm mới
                </button>
                <button
                  className="btn btn-delete"
                  onClick={handleDeleteBooks}
                  disabled={selectedRows.length === 0}
                >
                  <FontAwesomeIcon icon={faTrash} /> Xóa
                </button>
                <button
                  className="btn btn-edit"
                  onClick={() => {
                    if (selectedRows.length === 1) {
                      const book = books.find((b) => b.id === selectedRows[0]);
                      handleEditBook(book);
                    } else {
                      alert("Vui lòng chọn một sách để sửa");
                    }
                  }}
                  disabled={selectedRows.length !== 1}
                >
                  <FontAwesomeIcon icon={faPencilAlt} /> Sửa
                </button>
              </div>
            </div>

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
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Thể loại</th>
                    <th>Nhà xuất bản</th>
                    <th>Giá bán</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((book) => (
                    <tr
                      key={book.id}
                      className={selectedRows.includes(book.id) ? "selected" : ""}
                    >
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
                      <td>{formatCurrency(book.price)}</td>
                      <td>{book.stock}</td>
                      <td>
                        <span className={`status-badge status-${book.status}`}>
                          {book.status === "active" ? "Còn hàng" : "Hết hàng"}
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
                {Math.min(indexOfLastRecord, filteredBooks.length)} của{" "}
                {filteredBooks.length} mục
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

            {showBookForm && (
              <div className="modal">
                <div className="modal-content">
                  <BookForm
                    book={selectedBook}
                    onSubmit={handleBookSubmit}
                    onClose={() => setShowBookForm(false)}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "/categories":
        return <CategoryTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "/publishers":
        return <PublisherTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "/imports":
        return (
          <ImportTable 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onView={handleView} 
          />
        );
      case "/suppliers":
        return <SupplierTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "/invoices":
        return (
          <InvoiceTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
          />
        );
      case "/promotions":
        return (
          <PromotionTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        );
      case "/reports":
        return <ReportStatistics />;
      case "/rules":
        return <RulesSettings />;
      case "/accounts":
        return <AccountsPage />;
      // Các trang khác có thể được thêm vào đây khi cần
      default:
        return <div>Nội dung đang được phát triển...</div>;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar menuItems={menuItems} />

      <div className="dashboard-content">
        {currentRoute !== '/accounts' && (
          <Header 
            title={pageTitle} 
            showActions={false}
          />
        )}

        <div className="content-wrapper">
          <div className="dashboard-heading">
            <h2 className="dashboard-title"></h2>
          </div>

          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
