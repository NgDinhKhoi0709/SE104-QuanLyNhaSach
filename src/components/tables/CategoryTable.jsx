import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

// Dữ liệu mẫu cho thể loại sách
const sampleCategories = [
  {
    id: 1,
    name: "Tiểu thuyết",
    description: "Những câu chuyện hư cấu dài với cốt truyện và nhân vật phát triển sâu."
  },
  {
    id: 2,
    name: "Kỹ năng sống",
    description: "Sách dạy các kỹ năng để phát triển bản thân và đối phó với các thách thức của cuộc sống."
  },
  {
    id: 3,
    name: "Khoa học",
    description: "Sách về các chủ đề khoa học tự nhiên, công nghệ, và các khám phá khoa học."
  },
  {
    id: 4,
    name: "Tâm lý học",
    description: "Sách về hành vi con người, tâm lý, và phát triển tinh thần."
  },
  {
    id: 5,
    name: "Lịch sử",
    description: "Sách về các sự kiện lịch sử, nhân vật, và các nền văn minh."
  },
  {
    id: 6,
    name: "Kinh tế",
    description: "Sách về kinh tế học, tài chính, đầu tư, và kinh doanh."
  },
  {
    id: 7,
    name: "Trinh thám",
    description: "Những câu chuyện về tội phạm, điều tra và giải quyết các vụ án."
  },
  {
    id: 8,
    name: "Hồi ký",
    description: "Những câu chuyện có thật về cuộc đời của một người, được viết bởi chính họ."
  },
  {
    id: 9,
    name: "Thiếu nhi",
    description: "Sách dành cho trẻ em với nội dung phù hợp với độ tuổi và mục đích giáo dục."
  },
  {
    id: 10,
    name: "Du ký",
    description: "Sách về các chuyến đi, khám phá và trải nghiệm văn hóa khác nhau."
  },
  {
    id: 11,
    name: "Tản văn",
    description: "Văn xuôi ngắn, thường phản ánh suy nghĩ, cảm xúc cá nhân về cuộc sống."
  },
  {
    id: 12,
    name: "Truyện ngắn",
    description: "Những câu chuyện hư cấu ngắn, thường tập trung vào một sự kiện hoặc một số nhân vật."
  }
];

const CategoryTable = ({ onEdit, onDelete }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Tính toán chỉ mục bắt đầu và kết thúc cho phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sampleCategories.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sampleCategories.length / recordsPerPage);

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
              <th>Tên thể loại</th>
              <th>Mô tả</th>
              <th style={{ width: "100px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((category) => (
              <tr key={category.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(category.id)}
                    onChange={() => toggleRowSelection(category.id)}
                  />
                </td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td className="actions">
                  <button
                    className="action-button edit-button"
                    title="Sửa"
                    onClick={() => onEdit && onEdit(category)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Xóa"
                    onClick={() => onDelete && onDelete(category.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}

            {currentRecords.length === 0 && (
              <tr>
                <td
                  colSpan="4"
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
          {Math.min(indexOfLastRecord, sampleCategories.length)} của{" "}
          {sampleCategories.length} mục
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

export default CategoryTable;