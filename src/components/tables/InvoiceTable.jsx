import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./InvoiceTable.css";

// Sample data
const sampleInvoices = [
  {
    id: 1,
    code: "HD001",
    date: "2024-03-15",
    customer: "Nguyễn Văn A",
    total: 250000,
    discount: 25000,
    payment: "Tiền mặt",
    status: "paid",
  },
  {
    id: 2,
    code: "HD002",
    date: "2024-03-15",
    customer: "Trần Thị B",
    total: 180000,
    discount: 0,
    payment: "Chuyển khoản",
    status: "pending",
  },
  {
    id: 3,
    code: "HD003",
    date: "2024-03-16",
    customer: "Lê Văn C",
    total: 350000,
    discount: 35000,
    payment: "Thẻ tín dụng",
    status: "paid",
  },
  {
    id: 4,
    code: "HD004",
    date: "2024-03-16",
    customer: "Phạm Thị D",
    total: 420000,
    discount: 0,
    payment: "Tiền mặt",
    status: "paid",
  },
  {
    id: 5,
    code: "HD005",
    date: "2024-03-17",
    customer: "Hoàng Văn E",
    total: 280000,
    discount: 28000,
    payment: "Chuyển khoản",
    status: "pending",
  },
  {
    id: 6,
    code: "HD006",
    date: "2024-03-17",
    customer: "Vũ Thị F",
    total: 195000,
    discount: 0,
    payment: "Thẻ tín dụng",
    status: "paid",
  },
  {
    id: 7,
    code: "HD007",
    date: "2024-03-18",
    customer: "Đặng Văn G",
    total: 310000,
    discount: 31000,
    payment: "Tiền mặt",
    status: "paid",
  },
  {
    id: 8,
    code: "HD008",
    date: "2024-03-18",
    customer: "Bùi Thị H",
    total: 275000,
    discount: 0,
    payment: "Chuyển khoản",
    status: "pending",
  },
  {
    id: 9,
    code: "HD009",
    date: "2024-03-19",
    customer: "Ngô Văn I",
    total: 480000,
    discount: 48000,
    payment: "Thẻ tín dụng",
    status: "paid",
  },
  {
    id: 10,
    code: "HD010",
    date: "2024-03-19",
    customer: "Đỗ Thị K",
    total: 225000,
    discount: 0,
    payment: "Tiền mặt",
    status: "paid",
  },
  {
    id: 11,
    code: "HD011",
    date: "2024-03-20",
    customer: "Mai Văn L",
    total: 360000,
    discount: 36000,
    payment: "Chuyển khoản",
    status: "pending",
  },
  {
    id: 12,
    code: "HD012",
    date: "2024-03-20",
    customer: "Lý Thị M",
    total: 195000,
    discount: 0,
    payment: "Thẻ tín dụng",
    status: "paid",
  },
  {
    id: 13,
    code: "HD013",
    date: "2024-03-21",
    customer: "Trương Văn N",
    total: 420000,
    discount: 42000,
    payment: "Tiền mặt",
    status: "paid",
  },
  {
    id: 14,
    code: "HD014",
    date: "2024-03-21",
    customer: "Hồ Thị O",
    total: 285000,
    discount: 0,
    payment: "Chuyển khoản",
    status: "pending",
  },
  {
    id: 15,
    code: "HD015",
    date: "2024-03-22",
    customer: "Phan Văn P",
    total: 375000,
    discount: 37500,
    payment: "Thẻ tín dụng",
    status: "paid",
  },
  {
    id: 16,
    code: "HD016",
    date: "2024-03-22",
    customer: "Võ Thị Q",
    total: 245000,
    discount: 0,
    payment: "Tiền mặt",
    status: "paid",
  },
  {
    id: 17,
    code: "HD017",
    date: "2024-03-23",
    customer: "Cao Văn R",
    total: 320000,
    discount: 32000,
    payment: "Chuyển khoản",
    status: "pending",
  }
];

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const recordsPerPage = 10;

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredInvoices.length / recordsPerPage);

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowForm(true);
  };

  const handleDeleteInvoices = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các hóa đơn đã chọn?")) {
      setInvoices(
        invoices.filter((invoice) => !selectedRows.includes(invoice.id))
      );
      setSelectedRows([]);
    }
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

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "status-badge status-paid";
      case "pending":
        return "status-badge status-pending";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

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
                  checked={
                    selectedRows.length === currentRecords.length &&
                    currentRecords.length > 0
                  }
                  onChange={() => {
                    if (selectedRows.length === currentRecords.length) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(currentRecords.map((invoice) => invoice.id));
                    }
                  }}
                />
              </th>
              <th>Mã hóa đơn</th>
              <th>Ngày lập</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Giảm giá</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
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
                <td>{invoice.code}</td>
                <td>{invoice.date}</td>
                <td>{invoice.customer}</td>
                <td>{invoice.total.toLocaleString()} VNĐ</td>
                <td>{invoice.discount.toLocaleString()} VNĐ</td>
                <td>{invoice.payment}</td>
                <td>
                  <span className={getStatusBadgeClass(invoice.status)}>
                    {getStatusText(invoice.status)}
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
    </>
  );
};

export default InvoiceTable;