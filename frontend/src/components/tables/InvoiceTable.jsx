import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEye,
  // faPrint, // Bỏ import icon in hóa đơn
  faSearch,
  faCheck,
  faTimes as faTimesIcon
} from "@fortawesome/free-solid-svg-icons";
import InvoiceForm from "../forms/InvoiceForm";
import InvoiceDetailsModal from "../modals/InvoiceDetailsModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { getAllInvoices, addInvoice, getInvoiceById, deleteInvoice } from "../../services/invoiceService";
import "../../styles/SearchBar.css";
import "./InvoiceTable.css";

const InvoiceTable = ({ onEdit, onDelete, onView, onPrint }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showProgress, setShowProgress] = useState(false);
  const progressRef = useRef();

  const recordsPerPage = 10;
  
  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    getAllInvoices()
      .then((data) => setInvoices(data))
      .catch((err) => {
        setInvoices([]);
        // Có thể hiển thị thông báo lỗi ở đây nếu muốn
      });
  }, []);

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.id + "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.customer_phone || "").includes(searchQuery)
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

  const confirmDelete = async () => {
    try {
      // Xóa từng hóa đơn đã chọn
      for (const id of selectedRows) {
        await deleteInvoice(id);
      }
      // Reload lại danh sách hóa đơn
      const data = await getAllInvoices();
      setInvoices(data);
      setSelectedRows([]);
      setShowDeleteConfirmation(false);
      setNotification({ message: "Xóa hóa đơn thành công!", type: "success" });
      setShowProgress(true);
    } catch (err) {
      setNotification({ message: "Xóa hóa đơn thất bại!", type: "error" });
      setShowProgress(true);
    }
  };

  // Hiệu ứng tự động tắt thông báo sau 5s và reset progress bar
  useEffect(() => {
    if (notification.message) {
      setShowProgress(true);
      progressRef.current = setTimeout(() => {
        setNotification({ message: "", type: "" });
        setShowProgress(false);
      }, 5000);
    }
    return () => {
      if (progressRef.current) clearTimeout(progressRef.current);
    };
  }, [notification.message]);

  const handleInvoiceSubmit = async (formData) => {
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
      // Add new invoice to backend
      try {
        const result = await addInvoice(formData);
        // Reload invoices from backend
        const data = await getAllInvoices();
        setInvoices(data);
        setNotification({ message: "Tạo hóa đơn thành công!", type: "success" });
        setShowProgress(true);
        // Xuất file PDF ngay sau khi tạo hóa đơn thành công
        if (result && result.id) {
          window.open(`http://localhost:5000/api/invoices/${result.id}/pdf`, "_blank");
        }
      } catch (err) {
        setNotification({ message: "Tạo hóa đơn thất bại!", type: "error" });
        setShowProgress(true);
      }
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

  const handleViewDetails = async (invoice) => {
    try {
      const detail = await getInvoiceById(invoice.id);
      setSelectedInvoice(detail);
      setShowDetailsModal(true);
    } catch (err) {
      alert("Không thể tải chi tiết hóa đơn!");
    }
  };

  const handlePrintInvoice = (invoice) => {
    if (onPrint) {
      onPrint(invoice);
    }
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
              <th>Tên khách hàng</th>
              <th>Người lập</th>
              <th>Ngày lập</th>
              <th>Thành tiền</th>
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
                <td>{invoice.id}</td>
                <td>{invoice.customer_name}</td>
                <td>{invoice.created_by_name || invoice.created_by}</td>
                <td>
                  {
                    invoice.created_at
                      ? new Date(invoice.created_at).toLocaleDateString("vi-VN")
                      : ""
                  }
                </td>
                <td>{Number(invoice.final_amount).toLocaleString("vi-VN")} VNĐ</td>
                <td className="actions">
                  <button
                    className="btn btn-view"
                    onClick={() => handleViewDetails(invoice)}
                    title="Xem chi tiết"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
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

      {/* Thông báo giống BookForm */}
      {notification.message && (
        <div
          className={`notification ${notification.type === "error" ? "error" : notification.type === "success" ? "success" : ""}`}
        >
          <FontAwesomeIcon
            icon={
              notification.type === "success"
                ? faCheck
                : notification.type === "error"
                ? faTimesIcon
                : faTrash
            }
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
          {showProgress && <div className="progress-bar"></div>}
        </div>
      )}
    </>
  );
};

export default InvoiceTable;