import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import BookForm from "../forms/BookForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./BookTable.css";
import "../../styles/SearchBar.css";
import { formatCurrency } from "../../utils/format";

const BookTable = ({ onEdit, onDelete, onView }) => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Add notification state at the top
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Define fetchBooks function to load books from backend:
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/books");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch books: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Call fetchBooks in useEffect:
  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  const confirmDelete = async () => {
    try {
      for (const id of selectedRows) {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete book ${id}: ${errorText}`);
        }
      }
      await fetchBooks(); // re-fetch the updated books list
      setSelectedRows([]);
      setShowDeleteConfirmation(false);
      setNotification({ message: "Xóa đầu sách thành công.", type: "delete" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
    } catch (error) {
      console.error("Error deleting book(s):", error);
    }
  };

  const handleBookSubmit = async (formData) => {
    if (selectedBook) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${selectedBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error("Failed to update book");
        // Instead of manually updating state, re-fetch the full list:
        await fetchBooks();
        setShowForm(false);
        setNotification({ message: "Sửa đầu sách thành công.", type: "update" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } catch (error) {
        console.error("Error updating book:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error("Failed to add book");
        // Rather than updating state with the response, re-fetch the full list:
        await fetchBooks();
        setShowForm(false);
        setNotification({ message: "Thêm đầu sách thành công.", type: "add" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }
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
      {notification.message && (
        <div className={`notification ${notification.type === "error" ? "error" : ""}`}>
          <FontAwesomeIcon
            icon={notification.type === "add" ? faCheck : (notification.type === "update" ? faPencilAlt : null)}
            style={{ marginRight: "8px" }}
          />
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification({ message: "", type: "" })}
            aria-label="Đóng thông báo"
          >
            &times;
          </button>
          <div className="progress-bar"></div>
        </div>
      )}
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={() => { }} className="search-button">
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
              <th>Năm xuất bản</th>
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
                <td>{book.publicationYear || "-"}</td>
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
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
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
              className={`pagination-button ${currentPage === index + 1 ? "active" : ""
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