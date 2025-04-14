import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPencilAlt, faEye } from "@fortawesome/free-solid-svg-icons";
import "./SupplierTable.css";

// Sample data
const sampleSuppliers = [
  {
    id: 1,
    name: "NXB Kim Đồng",
    address: "55 Quang Trung, Hai Bà Trưng, Hà Nội",
    phone: "0243.943.4490",
    email: "info@nxbkimdong.com.vn",
    status: "active",
  },
  {
    id: 2,
    name: "NXB Trẻ",
    address: "161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM",
    phone: "0283.931.6289",
    email: "hopthubandoc@nxbtre.com.vn",
    status: "active",
  },
  {
    id: 3,
    name: "NXB Giáo Dục",
    address: "81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    phone: "0243.822.0801",
    email: "contact@nxbgd.vn",
    status: "active",
  },
  {
    id: 4,
    name: "First News - Trí Việt",
    address: "11H Nguyễn Thị Minh Khai, Q1, TP.HCM",
    phone: "0283.822.7979",
    email: "info@firstnews.com.vn",
    status: "active",
  },
  {
    id: 5,
    name: "Alpha Books",
    address: "67 Lương Văn Can, Hoàn Kiếm, Hà Nội",
    phone: "0243.938.8631",
    email: "info@alphabooks.vn",
    status: "active",
  },
  {
    id: 6,
    name: "Thái Hà Books",
    address: "23 Ngõ 80 Trung Kính, Cầu Giấy, Hà Nội",
    phone: "0243.793.0480",
    email: "book@thaihabooks.com",
    status: "active",
  },
  {
    id: 7,
    name: "Nhã Nam",
    address: "59 Đỗ Quang, Cầu Giấy, Hà Nội",
    phone: "0243.782.5786",
    email: "info@nhanam.vn",
    status: "active",
  },
  {
    id: 8,
    name: "NXB Tổng hợp TP.HCM",
    address: "62 Nguyễn Thị Minh Khai, Q1, TP.HCM",
    phone: "0283.822.5340",
    email: "tonghop@nxbhcm.com.vn",
    status: "inactive",
  },
  {
    id: 9,
    name: "Phương Nam Book",
    address: "940 Đường 3/2, Q11, TP.HCM",
    phone: "0283.962.3386",
    email: "online@phuongnam.vn",
    status: "active",
  },
  {
    id: 10,
    name: "Đinh Tị Books",
    address: "35 Cao Thắng, Q3, TP.HCM",
    phone: "0283.832.2332",
    email: "info@dinhtibooks.vn",
    status: "active",
  },
  {
    id: 11,
    name: "NXB Văn Học",
    address: "18 Nguyễn Trường Tộ, Ba Đình, Hà Nội",
    phone: "0243.829.2664",
    email: "info@nxbvanhoc.com.vn",
    status: "inactive",
  },
  {
    id: 12,
    name: "NXB Hội Nhà Văn",
    address: "65 Nguyễn Du, Hai Bà Trưng, Hà Nội",
    phone: "0243.822.2135",
    email: "contact@nxbhoinhavanvn.com",
    status: "active",
  },
  {
    id: 13,
    name: "NXB Lao Động",
    address: "175 Giảng Võ, Đống Đa, Hà Nội",
    phone: "0243.851.5380",
    email: "info@nxblaodong.com.vn",
    status: "active",
  },
  {
    id: 14,
    name: "NXB Phụ Nữ",
    address: "39 Hàng Chuối, Hai Bà Trưng, Hà Nội",
    phone: "0243.971.4288",
    email: "contact@nxbphunu.com.vn",
    status: "active",
  },
  {
    id: 15,
    name: "Công ty Văn hóa Đông A",
    address: "113 Đông Các, Đống Đa, Hà Nội",
    phone: "0243.732.5438",
    email: "info@dongabooks.vn",
    status: "active",
  },
];

const SupplierTable = () => {
  const [suppliers, setSuppliers] = useState(sampleSuppliers);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const recordsPerPage = 10;

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery)
  );

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSuppliers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredSuppliers.length / recordsPerPage);

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowForm(true);
  };

  const handleDeleteSuppliers = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các nhà cung cấp đã chọn?")) {
      setSuppliers(
        suppliers.filter((supplier) => !selectedRows.includes(supplier.id))
      );
      setSelectedRows([]);
    }
  };

  const handleSupplierSubmit = (formData) => {
    if (selectedSupplier) {
      // Edit existing supplier
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === selectedSupplier.id
            ? { ...supplier, ...formData }
            : supplier
        )
      );
    } else {
      // Add new supplier
      const newSupplier = {
        id: suppliers.length + 1,
        ...formData,
      };
      setSuppliers([...suppliers, newSupplier]);
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
      case "active":
        return "status-badge status-active";
      case "inactive":
        return "status-badge status-inactive";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "inactive":
        return "Ngừng hoạt động";
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
          <button className="btn btn-add" onClick={handleAddSupplier}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeleteSuppliers}
            disabled={selectedRows.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </button>
          <button
            className="btn btn-edit"
            onClick={() => {
              if (selectedRows.length === 1) {
                const supplier = suppliers.find((c) => c.id === selectedRows[0]);
                handleEditSupplier(supplier);
              } else {
                alert("Vui lòng chọn một nhà cung cấp để sửa");
              }
            }}
            disabled={selectedRows.length !== 1}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Sửa
          </button>
        </div>
      </div>

      <div className="supplier-table-container">
        <table className="supplier-table">
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
                      setSelectedRows(currentRecords.map((supplier) => supplier.id));
                    }
                  }}
                />
              </th>
              <th>Tên nhà cung cấp</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((supplier) => (
              <tr
                key={supplier.id}
                className={selectedRows.includes(supplier.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(supplier.id)}
                    onChange={() => toggleRowSelection(supplier.id)}
                  />
                </td>
                <td>{supplier.name}</td>
                <td>{supplier.address}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>
                  <span className={getStatusBadgeClass(supplier.status)}>
                    {getStatusText(supplier.status)}
                  </span>
                </td>
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
          {Math.min(indexOfLastRecord, filteredSuppliers.length)} của{" "}
          {filteredSuppliers.length} mục
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
            <SupplierForm
              supplier={selectedSupplier}
              onSubmit={handleSupplierSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierTable;