import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho nhà xuất bản
const samplePublishers = [
  {
    id: 1,
    name: "NXB Trẻ",
    address: "161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM",
    phone: "028 3931 6289",
    email: "hopthubandoc@nxbtre.com.vn"
  },
  {
    id: 2,
    name: "NXB Kim Đồng",
    address: "55 Quang Trung, Hai Bà Trưng, Hà Nội",
    phone: "024 3943 4730",
    email: "info@nxbkimdong.com.vn"
  },
  {
    id: 3,
    name: "NXB Tổng hợp TP.HCM",
    address: "62 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    phone: "028 3822 5340",
    email: "tonghop@nxbhcm.com.vn"
  },
  {
    id: 4,
    name: "NXB Văn Học",
    address: "18 Nguyễn Trường Tộ, Ba Đình, Hà Nội",
    phone: "024 3848 0486",
    email: "info@nxbvanhoc.com.vn"
  },
  {
    id: 5,
    name: "NXB Thế Giới",
    address: "7 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    phone: "028 3822 5796",
    email: "thegioi@nxb.com.vn"
  },
  {
    id: 6,
    name: "NXB Lao Động",
    address: "175 Giảng Võ, Đống Đa, Hà Nội",
    phone: "024 3851 5380",
    email: "nxblaodong@yahoo.com.vn"
  },
  {
    id: 7,
    name: "NXB Giáo Dục",
    address: "81 Trần Hưng Đạo, Hà Nội",
    phone: "024 3822 2058",
    email: "contact@nxbgd.vn"
  },
  {
    id: 8,
    name: "NXB Hội Nhà Văn",
    address: "65 Nguyễn Du, Hai Bà Trưng, Hà Nội",
    phone: "024 3822 2135",
    email: "nhaxuatban@hnv.vn"
  },
  {
    id: 9,
    name: "NXB Phụ Nữ",
    address: "39 Hàng Chuối, Hai Bà Trưng, Hà Nội",
    phone: "024 3971 3289",
    email: "phunu@gmail.com"
  },
  {
    id: 10,
    name: "NXB Dân Trí",
    address: "58/85 Trần Phú, Hà Đông, Hà Nội",
    phone: "024 6293 6111",
    email: "nxbdantri@gmail.com"
  },
  {
    id: 11,
    name: "NXB Thanh Niên",
    address: "62 Bà Triệu, Hoàn Kiếm, Hà Nội",
    phone: "024 3943 4044",
    email: "lienhe@nxbthanhnien.vn"
  },
  {
    id: 12,
    name: "NXB Tri Thức",
    address: "53 Nguyễn Du, Hai Bà Trưng, Hà Nội",
    phone: "024 3944 7279",
    email: "lienhe@nxbtrithuc.vn"
  }
];

const PublisherTable = ({ onEdit, onDelete }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = samplePublishers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(samplePublishers.length / recordsPerPage);

  // Xử lý chọn/bỏ chọn row
  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
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
              <th>Tên nhà xuất bản</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th style={{ width: "100px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((publisher) => (
              <tr key={publisher.id}>
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
                <td className="actions">
                  <button
                    className="action-button edit-button"
                    title="Sửa"
                    onClick={() => onEdit && onEdit(publisher)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Xóa"
                    onClick={() => onDelete && onDelete(publisher.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
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
          {Math.min(indexOfLastRecord, samplePublishers.length)} của{" "}
          {samplePublishers.length} mục
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
    </>
  );
};

export default PublisherTable;