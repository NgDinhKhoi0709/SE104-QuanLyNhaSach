import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import BookForm from "../forms/BookForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./BookTable.css";
import "../../styles/SearchBar.css";
import { formatCurrency } from "../../utils/format";

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
const BookTable = ({ onEdit, onDelete, onView }) => {
  const [books, setBooks] = useState(sampleBooks);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBooks.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredBooks.length / recordsPerPage);

  // Kiểm tra xem tất cả các mục trên tất cả các trang đã được chọn chưa
  const areAllItemsSelected = filteredBooks.length > 0 && 
    filteredBooks.every(book => selectedRows.includes(book.id));

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredBooks.map(book => book.id));
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setShowForm(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const handleDeleteBooks = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setBooks(books.filter((book) => !selectedRows.includes(book.id)));
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
  };

  const handleBookSubmit = (formData) => {
    if (selectedBook) {
      // Edit existing book
      setBooks(
        books.map((book) =>
          book.id === selectedBook.id
            ? { ...book, ...formData }
            : book
        )
      );
    } else {
      // Add new book
      const newBook = {
        id: books.length + 1,
        ...formData,
      };
      setBooks([...books, newBook]);
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

  return (
    <>
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, tác giả, thể loại..."
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

      <div className="book-table-container">
        <table className="book-table">
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
        {areAllItemsSelected && filteredBooks.length > currentRecords.length && (
          <div className="all-pages-selected-info">
            Đã chọn tất cả {filteredBooks.length} mục trên {totalPages} trang
          </div>
        )}
        <div className="pagination-info">
          Hiển thị {indexOfFirstRecord + 1} đến{" "}
          {Math.min(indexOfLastRecord, filteredBooks.length)} của{" "}
          {filteredBooks.length} mục
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
            <BookForm
              book={selectedBook}
              onSubmit={handleBookSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      
      {/* Modal xác nhận xóa */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa sách"
        message={`Bạn có chắc chắn muốn xóa ${selectedRows.length} sách đã chọn? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default BookTable;