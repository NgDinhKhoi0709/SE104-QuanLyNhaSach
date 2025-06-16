import React from "react";

const StockTable = ({ data }) => {
  if (!data)
    return (
      <div style={{ color: "#d32f2f", marginTop: 24 }}>
        Không có dữ liệu cho báo cáo này.
      </div>
    );

  // Giả lập dữ liệu danh sách sách tồn kho theo tháng (nếu có)
  const books = data.books || [
    { title: "Đắc Nhân Tâm", stock: 120 },
    { title: "Harry Potter", stock: 80 },
    { title: "Dế Mèn Phiêu Lưu Ký", stock: 60 },
    { title: "Tuổi Trẻ Đáng Giá Bao Nhiêu", stock: 45 },
    { title: "Nhà Giả Kim", stock: 40 }
  ];

  return (
    <div className="import-table-container">
      <table className="import-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sách</th>
            <th>Số lượng tồn</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, idx) => (
              <tr key={book.title}>
                <td>{idx + 1}</td>
                <td>{book.title}</td>
                <td>{book.stock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                Không có dữ liệu sách tồn kho.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}></td>
            <td style={{ fontWeight: 600, textAlign: "right" }}>
              Tổng số sách tồn: {data.totalBooks}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default StockTable;
