import React, { useState } from "react";

const sampleReports = [
  {
    id: 1,
    type: "revenue",
    month: 4,
    year: 2025,
    totalRevenue: 12000000,
    totalInvoices: 32,
    bestSeller: "Đắc Nhân Tâm",
  },
  {
    id: 2,
    type: "stock",
    month: 4,
    year: 2025,
    totalBooks: 1200,
    lowStockBooks: 5,
    mostStocked: "Harry Potter",
  },
];

const ReportStatistics = () => {
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2025);
  const [reportType, setReportType] = useState("revenue");
  const [showPreview, setShowPreview] = useState(false);

  // Lấy dữ liệu mẫu theo loại báo cáo
  const reportData = sampleReports.find(
    (r) => r.type === reportType && r.month === month && r.year === year
  );

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <div className="report-statistics-container" style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Báo cáo & Thống kê</h2>
      <form onSubmit={handlePreview} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        <label>
          Tháng:
          <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ marginLeft: 8 }}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
        <label>
          Năm:
          <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} min={2020} max={2100} style={{ marginLeft: 8, width: 90 }} />
        </label>
        <label>
          Loại báo cáo:
          <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="revenue">Doanh thu</option>
            <option value="stock">Tồn kho</option>
          </select>
        </label>
        <button type="submit" style={{ padding: '6px 18px', background: '#095e5a', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>Xem báo cáo</button>
      </form>
      {showPreview && reportType === "revenue" && reportData && (
        <div style={{ marginTop: 24 }}>
          <h3>Báo cáo doanh thu tháng {month}/{year}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <tbody>
              <tr><td>Tổng doanh thu:</td><td style={{ fontWeight: 600 }}>{reportData.totalRevenue.toLocaleString()} VNĐ</td></tr>
              <tr><td>Tổng số hóa đơn:</td><td>{reportData.totalInvoices}</td></tr>
              <tr><td>Sách bán chạy nhất:</td><td>{reportData.bestSeller}</td></tr>
            </tbody>
          </table>
        </div>
      )}
      {showPreview && reportType === "stock" && reportData && (
        <div style={{ marginTop: 24 }}>
          <h3>Báo cáo tồn kho tháng {month}/{year}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <tbody>
              <tr><td>Tổng số sách tồn:</td><td style={{ fontWeight: 600 }}>{reportData.totalBooks}</td></tr>
              <tr><td>Số đầu sách tồn kho thấp (&lt; 10):</td><td>{reportData.lowStockBooks}</td></tr>
              <tr><td>Sách tồn kho nhiều nhất:</td><td>{reportData.mostStocked}</td></tr>
            </tbody>
          </table>
        </div>
      )}
      {showPreview && !reportData && (
        <div style={{ marginTop: 24, color: '#d32f2f' }}>Không có dữ liệu cho báo cáo này.</div>
      )}
    </div>
  );
};

export default ReportStatistics;