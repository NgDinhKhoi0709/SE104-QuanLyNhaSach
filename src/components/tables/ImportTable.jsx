import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import ImportForm from "../forms/ImportForm";
import "./ImportTable.css";

// Sample data
const sampleImports = [
  {
    id: 1,
    date: "2024-03-15",
    supplier: "NXB Kim Đồng",
    book: "Doraemon tập 1",
    quantity: 100,
    price: 25000,
  },
  {
    id: 2,
    date: "2024-03-15",
    supplier: "NXB Trẻ",
    book: "Conan tập 1",
    quantity: 50,
    price: 30000,
  },
  {
    id: 3,
    date: "2024-03-16",
    supplier: "NXB Giáo Dục",
    book: "Toán lớp 10 tập 1",
    quantity: 200,
    price: 15000,
  },
  {
    id: 4,
    date: "2024-03-16",
    supplier: "NXB Văn Học",
    book: "Nhà Giả Kim",
    quantity: 75,
    price: 85000,
  },
  {
    id: 5,
    date: "2024-03-17",
    supplier: "NXB Tổng Hợp TPHCM",
    book: "Đắc Nhân Tâm",
    quantity: 120,
    price: 95000,
  },
  {
    id: 6,
    date: "2024-03-17",
    supplier: "NXB Hội Nhà Văn",
    book: "Số Đỏ",
    quantity: 80,
    price: 65000,
  },
  {
    id: 7,
    date: "2024-03-18",
    supplier: "NXB Thế Giới",
    book: "Harry Potter và Hòn Đá Phù Thủy",
    quantity: 90,
    price: 120000,
  },
  {
    id: 8,
    date: "2024-03-18",
    supplier: "NXB Dân Trí",
    book: "Khoa Học Vui",
    quantity: 150,
    price: 45000,
  },
  {
    id: 9,
    date: "2024-03-19",
    supplier: "NXB Phụ Nữ",
    book: "Nuôi Con Không Phải Là Cuộc Chiến",
    quantity: 60,
    price: 110000,
  },
  {
    id: 10,
    date: "2024-03-19",
    supplier: "NXB Lao Động",
    book: "Kỹ Năng Làm Việc Nhóm",
    quantity: 85,
    price: 75000,
  },
  {
    id: 11,
    date: "2024-03-20",
    supplier: "NXB Thanh Niên",
    book: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    quantity: 110,
    price: 88000,
  },
  {
    id: 12,
    date: "2024-03-20",
    supplier: "NXB Chính Trị Quốc Gia",
    book: "Luật Doanh Nghiệp 2024",
    quantity: 45,
    price: 150000,
  },
  {
    id: 13,
    date: "2024-03-21",
    supplier: "NXB Công An Nhân Dân",
    book: "Bộ Luật Hình Sự 2024",
    quantity: 40,
    price: 180000,
  },
  {
    id: 14,
    date: "2024-03-21",
    supplier: "NXB Thông Tin và Truyền Thông",
    book: "Lập Trình Python Cơ Bản",
    quantity: 95,
    price: 125000,
  },
  {
    id: 15,
    date: "2024-03-22",
    supplier: "NXB Y Học",
    book: "Sức Khỏe Cho Mọi Người",
    quantity: 70,
    price: 95000,
  },
  {
    id: 16,
    date: "2024-03-22",
    supplier: "NXB Mỹ Thuật",
    book: "Học Vẽ Cơ Bản",
    quantity: 55,
    price: 85000,
  },
  {
    id: 17,
    date: "2024-03-23",
    supplier: "NXB Âm Nhạc",
    book: "Tự Học Guitar",
    quantity: 65,
    price: 78000,
  }
];

const ImportTable = () => {
  const [imports, setImports] = useState(sampleImports);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const recordsPerPage = 10;

  // Filter imports based on search query
  const filteredImports = imports.filter(
    (importItem) =>
      importItem.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      importItem.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredImports.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredImports.length / recordsPerPage);

  const handleAddImport = () => {
    setSelectedImport(null);
    setShowForm(true);
  };

  const handleEditImport = (importItem) => {
    setSelectedImport(importItem);
    setShowForm(true);
  };

  const handleDeleteImports = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các phiếu nhập đã chọn?")) {
      setImports(
        imports.filter((importItem) => !selectedRows.includes(importItem.id))
      );
      setSelectedRows([]);
    }
  };

  const handleImportSubmit = (formData) => {
    if (selectedImport) {
      // Edit existing import
      setImports(
        imports.map((importItem) =>
          importItem.id === selectedImport.id
            ? { ...importItem, ...formData }
            : importItem
        )
      );
    } else {
      // Add new import
      const newImport = {
        id: imports.length + 1,
        ...formData,
      };
      setImports([...imports, newImport]);
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
          <button className="btn btn-add" onClick={handleAddImport}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeleteImports}
            disabled={selectedRows.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
          <button
            className="btn btn-edit"
            onClick={() => {
              if (selectedRows.length === 1) {
                const importItem = imports.find((c) => c.id === selectedRows[0]);
                handleEditImport(importItem);
              } else {
                alert("Vui lòng chọn một phiếu nhập để sửa");
              }
            }}
            disabled={selectedRows.length !== 1}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Sửa
          </button>
        </div>
      </div>

      <div className="import-table-container">
        <table className="import-table">
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
                      setSelectedRows(currentRecords.map((importItem) => importItem.id));
                    }
                  }}
                />
              </th>
              <th>Ngày nhập</th>
              <th>Nhà cung cấp</th>
              <th>Sách</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((importItem) => (
              <tr
                key={importItem.id}
                className={selectedRows.includes(importItem.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(importItem.id)}
                    onChange={() => toggleRowSelection(importItem.id)}
                  />
                </td>
                <td>{importItem.date}</td>
                <td>{importItem.supplier}</td>
                <td>{importItem.book}</td>
                <td>{importItem.quantity}</td>
                <td>{importItem.price.toLocaleString()} VNĐ</td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
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
          {Math.min(indexOfLastRecord, filteredImports.length)} của{" "}
          {filteredImports.length} mục
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
            <ImportForm
              importItem={selectedImport}
              onSubmit={handleImportSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImportTable;
