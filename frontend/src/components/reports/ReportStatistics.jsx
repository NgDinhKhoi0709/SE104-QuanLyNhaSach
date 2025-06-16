import React, { useState, useEffect } from "react";
import RevenueTable from "./tables/RevenueTable";
import Top10BooksTable from "./tables/Top10BooksTable";
import StockTable from "./tables/StockTable";
import ImportBooksTable from "./tables/ImportBooksTable";
import "./ReportStatistics.css";
import { getRevenueByYear, getTop10MostSoldBooks } from "../../services/reportService";

// Dữ liệu mẫu cho từng loại báo cáo
const sampleTopBooks = [
  {
    month: 4,
    year: 2025,
    books: [
      { title: "Đắc Nhân Tâm", sold: 120 },
      { title: "Harry Potter", sold: 100 },
      { title: "Dế Mèn Phiêu Lưu Ký", sold: 90 },
      { title: "Tuổi Trẻ Đáng Giá Bao Nhiêu", sold: 80 },
      { title: "Nhà Giả Kim", sold: 75 },
      { title: "Sapiens", sold: 70 },
      { title: "Sherlock Holmes", sold: 65 },
      { title: "Bí Mật Của May Mắn", sold: 60 },
      { title: "Totto-chan", sold: 55 },
      { title: "Cây Cam Ngọt Của Tôi", sold: 50 },
    ],
  },
];
const sampleStock = [
  {
    month: 4,
    year: 2025,
    totalBooks: 1200,
    lowStockBooks: 5,
    mostStocked: "Harry Potter",
  },
];
const sampleImport = [
  {
    month: 4,
    year: 2025,
    totalImported: 500,
    topImported: "Đắc Nhân Tâm",
    books: [
      { title: "Đắc Nhân Tâm", imported: 120 },
      { title: "Harry Potter", imported: 100 },
      { title: "Dế Mèn Phiêu Lưu Ký", imported: 90 },
      { title: "Tuổi Trẻ Đáng Giá Bao Nhiêu", imported: 80 },
      { title: "Nhà Giả Kim", imported: 75 },
    ],
  },
];

// Thêm dữ liệu mẫu cho doanh thu từng sách trong tháng
const sampleRevenue = [
  {
    month: 4,
    year: 2025,
    totalRevenue: 12000000,
    totalInvoices: 32,
    books: [
      { title: "Đắc Nhân Tâm", sold: 120, revenue: 3600000 },
      { title: "Harry Potter", sold: 100, revenue: 2500000 },
      { title: "Dế Mèn Phiêu Lưu Ký", sold: 90, revenue: 1800000 },
      { title: "Tuổi Trẻ Đáng Giá Bao Nhiêu", sold: 80, revenue: 1600000 },
      { title: "Nhà Giả Kim", sold: 75, revenue: 1500000 },
      { title: "Sapiens", sold: 70, revenue: 1400000 },
      { title: "Sherlock Holmes", sold: 65, revenue: 1300000 },
      { title: "Bí Mật Của May Mắn", sold: 60, revenue: 1200000 },
      { title: "Totto-chan", sold: 55, revenue: 1100000 },
      { title: "Cây Cam Ngọt Của Tôi", sold: 50, revenue: 1000000 },
    ],
  },
  {
    month: 5,
    year: 2025,
    totalRevenue: 15000000,
    totalInvoices: 40,
    books: [
      { title: "Đắc Nhân Tâm", sold: 140, revenue: 4200000 },
      { title: "Harry Potter", sold: 110, revenue: 2750000 },
      // ...có thể thêm dữ liệu cho tháng khác nếu muốn
    ],
  },
];

const TABS = [
  { key: "revenue", label: "Doanh thu bán sách" },
  { key: "top10", label: "Top 10 sách bán chạy" },
  { key: "stock", label: "Hàng tồn kho" },
  { key: "import", label: "Sách nhập kho" },
];

const ReportStatistics = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2025);
  const [revenueData, setRevenueData] = useState(undefined);
  const [top10Books, setTop10Books] = useState(undefined);
  useEffect(() => {
    if (activeTab === "revenue") {
      setRevenueData(undefined);
      getRevenueByYear(year)
        .then((data) => setRevenueData(data))
        .catch(() => setRevenueData(null));
    }
    if (activeTab === "top10") {
      setTop10Books(undefined);
      getTop10MostSoldBooks(month, year)
        .then((books) => {
          setTop10Books(books);
        })
        .catch(() => setTop10Books(null));
    }
  }, [activeTab, year, month]);

  // Lấy dữ liệu mẫu theo tab
  const topBooksData = sampleTopBooks.find(
    (r) => r.month === month && r.year === year
  );
  const stockData = sampleStock.find((r) => r.month === month && r.year === year);
  const importData = sampleImport.find((r) => r.month === month && r.year === year);

  return (
    <div className="report-statistics-container">
      {/* <h2 className="report-title">Báo cáo & Thống kê</h2> */}
      <div className="report-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`report-tab-btn${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="report-filter-row">
        {/* Bỏ chọn tháng cho tab doanh thu */}
        {activeTab !== "revenue" && (
          <label>
            Tháng:
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Năm:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min={2020}
            max={2100}
          />
        </label>
      </div>
      {activeTab === "revenue" && (
        <RevenueTable data={revenueData} year={year} />
      )}      {activeTab === "top10" && (
        <Top10BooksTable books={top10Books} />
      )}
      {activeTab === "stock" && (
        <StockTable data={sampleStock.find((r) => r.month === month && r.year === year)} />
      )}
      {activeTab === "import" && (
        <ImportBooksTable data={sampleImport.find((r) => r.month === month && r.year === year)} />
      )}
    </div>
  );
};

export default ReportStatistics;