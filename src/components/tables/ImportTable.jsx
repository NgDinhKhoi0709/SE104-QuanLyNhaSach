import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import ImportForm from "../forms/ImportForm";
import ImportDetailsModal from "../modals/ImportDetailsModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./ImportTable.css";
import "../../styles/SearchBar.css";


// Sample data
const sampleImports = [
  {
    id: 1,
    importCode: "PN001",
    date: "2024-03-15",
    supplier: "NXB Kim Đồng",
    employee: "Nguyễn Văn A",
    total: 5500000,
    bookDetails: [
      {
        book: "Doraemon tập 1",
        quantity: 100,
        price: 25000
      },
      {
        book: "Doraemon tập 2",
        quantity: 80,
        price: 25000
      },
      {
        book: "Dragon Ball tập 1",
        quantity: 50,
        price: 30000
      }
    ]
  },
  {
    id: 2,
    importCode: "PN002",
    date: "2024-03-15",
    supplier: "NXB Trẻ",
    employee: "Trần Thị B",
    total: 3900000,
    bookDetails: [
      {
        book: "Conan tập 1",
        quantity: 50,
        price: 30000
      },
      {
        book: "Conan tập 2",
        quantity: 40,
        price: 30000
      },
      {
        book: "5cm/s",
        quantity: 30,
        price: 45000
      }
    ]
  },
  {
    id: 3,
    importCode: "PN003",
    date: "2024-03-16",
    supplier: "NXB Giáo Dục",
    employee: "Phạm Văn C",
    total: 4500000,
    bookDetails: [
      {
        book: "Toán lớp 10 tập 1",
        quantity: 200,
        price: 15000
      },
      {
        book: "Ngữ văn lớp 10 tập 1",
        quantity: 150,
        price: 12000
      }
    ]
  },
  {
    id: 4,
    importCode: "PN004",
    date: "2024-03-16",
    supplier: "NXB Văn Học",
    employee: "Lê Thị D",
    total: 14375000,
    bookDetails: [
      {
        book: "Nhà Giả Kim",
        quantity: 75,
        price: 85000
      },
      {
        book: "Đắc Nhân Tâm",
        quantity: 70,
        price: 95000
      }
    ]
  },
  {
    id: 5,
    importCode: "PN005",
    date: "2024-03-17",
    supplier: "NXB Tổng Hợp TPHCM",
    employee: "Hoàng Văn E",
    total: 11400000,
    bookDetails: [
      {
        book: "Đắc Nhân Tâm",
        quantity: 120,
        price: 95000
      }
    ]
  },
  {
    id: 6,
    importCode: "PN006",
    date: "2024-03-17",
    supplier: "NXB Hội Nhà Văn",
    employee: "Ngô Thị F",
    total: 5200000,
    bookDetails: [
      {
        book: "Số Đỏ",
        quantity: 80,
        price: 65000
      }
    ]
  },
  {
    id: 7,
    importCode: "PN007",
    date: "2024-03-18",
    supplier: "NXB Thế Giới",
    employee: "Vũ Văn G",
    total: 10800000,
    bookDetails: [
      {
        book: "Harry Potter và Hòn Đá Phù Thủy",
        quantity: 90,
        price: 120000
      }
    ]
  },
  {
    id: 8,
    importCode: "PN008",
    date: "2024-03-18",
    supplier: "NXB Dân Trí",
    employee: "Đặng Thị H",
    total: 6750000,
    bookDetails: [
      {
        book: "Khoa Học Vui",
        quantity: 150,
        price: 45000
      }
    ]
  },
  {
    id: 9,
    importCode: "PN009",
    date: "2024-03-19",
    supplier: "NXB Phụ Nữ",
    employee: "Bùi Văn I",
    total: 6600000,
    bookDetails: [
      {
        book: "Nuôi Con Không Phải Là Cuộc Chiến",
        quantity: 60,
        price: 110000
      }
    ]
  },
  {
    id: 10,
    importCode: "PN010",
    date: "2024-03-19",
    supplier: "NXB Lao Động",
    employee: "Trịnh Thị K",
    total: 6375000,
    bookDetails: [
      {
        book: "Kỹ Năng Làm Việc Nhóm",
        quantity: 85,
        price: 75000
      }
    ]
  },
  {
    id: 11,
    importCode: "PN011",
    date: "2024-03-20",
    supplier: "NXB Thanh Niên",
    employee: "Đinh Văn L",
    total: 9680000,
    bookDetails: [
      {
        book: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        quantity: 110,
        price: 88000
      }
    ]
  },
  {
    id: 12,
    importCode: "PN012",
    date: "2024-03-20",
    supplier: "NXB Chính Trị Quốc Gia",
    employee: "Cao Thị M",
    total: 6750000,
    bookDetails: [
      {
        book: "Luật Doanh Nghiệp 2024",
        quantity: 45,
        price: 150000
      }
    ]
  }
];

const ImportTable = () => {
  const [imports, setImports] = useState(sampleImports);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const recordsPerPage = 10;
  
  // Modal xác nhận xóa
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Filter imports based on search query
  const filteredImports = imports.filter(
    (importItem) =>
      importItem.importCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      importItem.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Thêm tìm kiếm theo tên sách trong danh sách sách nhập
      importItem.bookDetails.some(detail => 
        detail.book.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setImports(imports.filter((importItem) => !selectedRows.includes(importItem.id)));
    setSelectedRows([]);
    setShowDeleteConfirmation(false);
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

  // Kiểm tra xem tất cả các mục trên tất cả các trang đã được chọn chưa
  const areAllItemsSelected = filteredImports.length > 0 && 
    filteredImports.every(importItem => selectedRows.includes(importItem.id));

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredImports.map(importItem => importItem.id));
    }
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleViewDetails = (importItem) => {
    setSelectedImport(importItem);
    setShowDetailsModal(true);
  };

  const calculateTotalBooks = (importItem) => {
    return importItem.bookDetails.reduce((total, book) => total + book.quantity, 0);
  };
  
  // Hàm để hiển thị danh sách sách với giới hạn ký tự
  const getBooksList = (importItem) => {
    const booksList = importItem.bookDetails.map(book => book.book).join(", ");
    return booksList.length > 30 ? booksList.substring(0, 30) + "..." : booksList;
  };

  return (
    <>
      <div className="table-actions">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phiếu nhập, nhà cung cấp..."
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
                  checked={areAllItemsSelected}
                  onChange={handleSelectAllToggle}
                  title={areAllItemsSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                />
              </th>
              <th>Mã phiếu nhập</th>
              <th>Ngày nhập</th>
              <th>Nhà cung cấp</th>
              <th>Danh sách sách</th>
              <th>Tổng số sách</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
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
                <td>{importItem.importCode}</td>
                <td>{importItem.date}</td>
                <td>{importItem.supplier}</td>
                <td className="books-column">{getBooksList(importItem)}</td>
                <td>{calculateTotalBooks(importItem)}</td>
                <td>{importItem.total.toLocaleString()} VNĐ</td>
                <td className="actions">
                  <button
                    className="btn btn-view"
                    onClick={() => handleViewDetails(importItem)}
                    title="Xem chi tiết"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
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
        {areAllItemsSelected && filteredImports.length > currentRecords.length && (
          <div className="all-pages-selected-info">
            Đã chọn tất cả {filteredImports.length} mục trên {totalPages} trang
          </div>
        )}
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
      
      {showDetailsModal && (
        <ImportDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          importData={selectedImport}
        />
      )}
      
      {/* Modal xác nhận xóa */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa phiếu nhập"
        message={`Bạn có chắc chắn muốn xóa ${selectedRows.length} phiếu nhập đã chọn? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default ImportTable;
