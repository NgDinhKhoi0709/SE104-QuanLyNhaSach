import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import PublisherForm from "../forms/PublisherForm";
import "./PublisherTable.css";
import "../../styles/SearchBar.css";

// Dữ liệu mẫu cho nhà xuất bản
const samplePublishers = [
  {
    id: 1,
    name: "NXB Trẻ",
    address: "161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM",
    phone: "028 3931 6289",
    email: "hopthubandoc@nxbtre.com.vn",
    status: "active",
  },
  {
    id: 2,
    name: "NXB Kim Đồng",
    address: "55 Quang Trung, Hai Bà Trưng, Hà Nội",
    phone: "024 3943 4730",
    email: "info@nxbkimdong.com.vn",
    status: "active",
  },
  {
    id: 3,
    name: "NXB Tổng hợp TP.HCM",
    address: "62 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    phone: "028 3822 5340",
    email: "tonghop@nxbhcm.com.vn",
    status: "active",
  },
  {
    id: 4,
    name: "NXB Giáo dục",
    address: "81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    phone: "024 3822 0801",
    email: "contact@nxbgd.vn",
    status: "active",
  },
  {
    id: 5,
    name: "NXB Văn học",
    address: "18 Nguyễn Trường Tộ, Ba Đình, Hà Nội",
    phone: "024 3848 1468",
    email: "info@nxbvanhoc.com.vn",
    status: "active",
  },
  {
    id: 6,
    name: "NXB Dân Trí",
    address: "25 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    phone: "028 3822 0802",
    email: "info@nxbdantri.com.vn",
    status: "active",
  },
  {
    id: 7,
    name: "NXB Thế Giới",
    address: "46 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    phone: "024 3822 0803",
    email: "contact@nxbthegioi.com.vn",
    status: "active",
  },
  {
    id: 8,
    name: "NXB Tri Thức",
    address: "53 Nguyễn Du, Hai Bà Trưng, Hà Nội",
    phone: "024 3822 0804",
    email: "info@nxbtritue.com.vn",
    status: "active",
  },
  {
    id: 9,
    name: "NXB Hội Nhà Văn",
    address: "65 Nguyễn Du, Hai Bà Trưng, Hà Nội",
    phone: "024 3822 0805",
    email: "contact@nxbhoinhavan.com.vn",
    status: "active",
  },
  {
    id: 10,
    name: "NXB Lao Động",
    address: "175 Giảng Võ, Đống Đa, Hà Nội",
    phone: "024 3822 0806",
    email: "info@nxblaodong.com.vn",
    status: "active",
  },
  {
    id: 11,
    name: "NXB Tổng Hợp Đồng Nai",
    address: "261 Đồng Khởi, Biên Hòa, Đồng Nai",
    phone: "0251 3822 0807",
    email: "contact@nxbdongnai.com.vn",
    status: "active",
  },
  {
    id: 12,
    name: "NXB Thanh Niên",
    address: "248 Cống Quỳnh, Phường Phạm Ngũ Lão, Quận 1, TP.HCM",
    phone: "028 3822 0808",
    email: "info@nxbthanhnien.com.vn",
    status: "active",
  },
  {
    id: 13,
    name: "NXB Phụ Nữ",
    address: "39 Hàng Chuối, Hai Bà Trưng, Hà Nội",
    phone: "024 3822 0809",
    email: "contact@nxbphunu.com.vn",
    status: "active",
  },
  {
    id: 14,
    name: "NXB Chính Trị Quốc Gia",
    address: "6 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    phone: "024 3822 0810",
    email: "info@nxbctqg.com.vn",
    status: "active",
  },
  {
    id: 15,
    name: "NXB Công An Nhân Dân",
    address: "92 Nguyễn Du, Hai Bà Trưng, Hà Nội",
    phone: "024 3822 0811",
    email: "contact@nxbcand.com.vn",
    status: "active",
  }
];

const PublisherTable = ({ onEdit, onDelete, onView }) => {
  const [publishers, setPublishers] = useState(samplePublishers);
  const [showForm, setShowForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Filter publishers based on search query
  const filteredPublishers = publishers.filter(
    (publisher) =>
      publisher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
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
    if (window.confirm("Bạn có chắc chắn muốn xóa các nhà xuất bản đã chọn?")) {
      setPublishers(
        publishers.filter((publisher) => !selectedRows.includes(publisher.id))
      );
      setSelectedRows([]);
    }
  };

  const handlePublisherSubmit = (formData) => {
    if (selectedPublisher) {
      // Edit existing publisher
      setPublishers(
        publishers.map((publisher) =>
          publisher.id === selectedPublisher.id
            ? { ...publisher, ...formData }
            : publisher
        )
      );
    } else {
      // Add new publisher
      const newPublisher = {
        id: publishers.length + 1,
        ...formData,
      };
      setPublishers([...publishers, newPublisher]);
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

  const handleSelectAll = () => {
    if (selectedRows.length === currentRecords.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentRecords.map((record) => record.id));
    }
  };

  // Kiểm tra xem tất cả các mục trên tất cả các trang đã được chọn chưa
  const areAllItemsSelected = filteredPublishers.length > 0 && 
    filteredPublishers.every(publisher => selectedRows.includes(publisher.id));

  // Xử lý khi chọn/bỏ chọn tất cả - hai trạng thái: chọn tất cả các trang hoặc bỏ chọn tất cả
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedRows([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả trên mọi trang
      setSelectedRows(filteredPublishers.map(publisher => publisher.id));
    }
  };

  return (
    <>
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
            <button onClick={() => {}} className="search-button">
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
            <PublisherForm
              publisher={selectedPublisher}
              onSubmit={handlePublisherSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PublisherTable;