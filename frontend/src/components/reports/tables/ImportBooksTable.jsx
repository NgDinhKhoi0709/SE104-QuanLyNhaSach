import React from "react";

const ImportBooksTable = ({ data }) => {
  if (!data)
    return (
      <div style={{ color: "#d32f2f", marginTop: 24 }}>
        Không có dữ liệu cho báo cáo này.
      </div>
    );

  const books = data.books || [];

  return (
    <div className="import-table-container">
      <table className="import-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sách</th>
            <th>Số lượng nhập</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, idx) => (
              <tr key={book.title}>
                <td>{idx + 1}</td>
                <td>{book.title}</td>
                <td>{book.imported}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                Không có dữ liệu sách nhập kho.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}></td>
            <td style={{ fontWeight: 600, textAlign: "right" }}>
              Tổng số sách nhập: {data.totalImported}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ImportBooksTable;
