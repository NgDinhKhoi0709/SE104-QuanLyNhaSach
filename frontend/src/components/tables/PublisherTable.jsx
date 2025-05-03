import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch,
  faCheck,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import PublisherForm from "../forms/PublisherForm";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./PublisherTable.css";
import "../../styles/SearchBar.css";

const PublisherTable = ({ onEdit, onDelete, onView }) => {
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [publishers, setPublishers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/publishers");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`Failed to fetch publishers: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched publishers data:", data);
        setPublishers(data);
      } catch (error) {
        console.error("Error fetching publishers:", error);
      }
    };
    fetchPublishers();
  }, []);

  const filteredPublishers = publishers.filter(
    (publisher) =>
      publisher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPublishers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPublishers.length / recordsPerPage);

  const handleAddPublisher = () => {
    setSelectedPublisher(null);
    setShowForm(true);
  };

  const handleEditPublisher = (publisher) => {
    setSelectedPublisher(publisher);
    setShowForm(true);
  };

  const handleDeletePublishers = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      for (const id of selectedRows) {
        const response = await fetch(`http://localhost:5000/api/publishers/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) {
          const errorText = await response.text();
          let message = `Xóa nhà xuất bản thất bại.`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson && errorJson.error) {
              message = `Xóa nhà xuất bản thất bại: ${errorJson.error}`;
            }
          } catch {
            // fallback to default message
          }
          setNotification({ message, type: "error" });
          setTimeout(() => setNotification({ message: "", type: "" }), 5000);
          throw new Error(`Failed to delete publisher ${id}: ${response.status} ${errorText}`);
        }
      }
      setPublishers(publishers.filter((publisher) => !selectedRows.includes(publisher.id)));
      setSelectedRows([]);
      setShowDeleteConfirmation(false);
      setNotification({ message: "Xóa nhà xuất bản thành công.", type: "delete" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
    } catch (error) {
      console.error("Error deleting publisher(s):", error);
    }
  };

  const handlePublisherSubmit = async (formData) => {
    if (selectedPublisher) {
      try {
        const response = await fetch(`http://localhost:5000/api/publishers/${selectedPublisher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error("Failed to update publisher");
        const updatedPublisher = await response.json();
        setPublishers(
          publishers.map((publisher) =>
            publisher.id === selectedPublisher.id ? updatedPublisher : publisher
          )
        );
        setShowForm(false);
        setNotification({ message: "Sửa nhà xuất bản thành công.", type: "update" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } catch (error) {
        console.error("Error updating publisher:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/publishers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error("Failed to add publisher");
        const newPublisher = await response.json();
        setPublishers([...publishers, newPublisher]);
        setShowForm(false);
        setNotification({ message: "Thêm nhà xuất bản thành công.", type: "add" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } catch (error) {
        console.error("Error adding publisher:", error);
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

  const handleSelectAll = () => {
    if (selectedRows.length === currentRecords.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentRecords.map((record) => record.id));
    }
  };

  const areAllItemsSelected = filteredPublishers.length > 0 &&
    filteredPublishers.every(publisher => selectedRows.includes(publisher.id));

  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPublishers.map(publisher => publisher.id));
    }
  };

  return (
    <>
      {notification.message && (
        <div className={`notification ${notification.type === "error" ? "error" : ""}`}>
          {notification.type === "add" && (
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "8px" }} />
          )}
          {notification.type === "update" && (
            <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: "8px" }} />
          )}
          {notification.type === "delete" && (
            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "8px" }} />
          )}
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
              placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại, email..."
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
          <button className="btn btn-add" onClick={handleAddPublisher}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeletePublishers}
            disabled={selectedRows.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
          <button
            className="btn btn-edit"
            onClick={() => {
              if (selectedRows.length === 1) {
                const publisher = publishers.find((c) => c.id === selectedRows[0]);
                handleEditPublisher(publisher);
              } else {
                alert("Vui lòng chọn một nhà xuất bản để sửa");
              }
            }}
            disabled={selectedRows.length !== 1}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Sửa
          </button>
        </div>
      </div>

      <div className="publisher-table-container">
        <table className="publisher-table">
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
              <th>Tên nhà xuất bản</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((publisher) => (
              <tr
                key={publisher.id}
                className={selectedRows.includes(publisher.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(publisher.id)}
                    onChange={() => toggleRowSelection(publisher.id)}
                  />
                </td>
                <td>{publisher.name}</td>
                <td>{publisher.address}</td>
                <td>{publisher.phone}</td>
                <td>{publisher.email}</td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {areAllItemsSelected && filteredPublishers.length > currentRecords.length && (
          <div className="all-pages-selected-info">
            Đã chọn tất cả {filteredPublishers.length} mục trên {totalPages} trang
          </div>
        )}
        <div className="pagination-info">
          Hiển thị {indexOfFirstRecord + 1} đến{" "}
          {Math.min(indexOfLastRecord, filteredPublishers.length)} của{" "}
          {filteredPublishers.length} mục
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
              className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
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
            <PublisherForm
              publisher={selectedPublisher}
              onSubmit={handlePublisherSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa nhà xuất bản"
        message={`Bạn có chắc chắn muốn xóa ${selectedRows.length} nhà xuất bản đã chọn? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default PublisherTable;