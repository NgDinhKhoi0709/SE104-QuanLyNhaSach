import React, { useState, useEffect } from "react";
import RevenueTable from "./tables/RevenueTable";
import Top10BooksTable from "./tables/Top10BooksTable";
import StockTable from "./tables/StockTable";
import ImportBooksTable from "./tables/ImportBooksTable";
import "./ReportStatistics.css";
import { getRevenueByYear, getTop10MostSoldBooks } from "../../services/reportService";
import { getAllBooks } from "../../services/bookService";
import { getAllImports, getImportsByMonth } from "../../services/importService";

const TABS = [
  { key: "revenue", label: "Doanh thu bán sách" },
  { key: "top10", label: "Top 10 sách bán chạy" },
  { key: "stock", label: "Tồn kho" },
  { key: "import", label: "Nhập kho" },
];

const ReportStatistics = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2025);
  const [revenueData, setRevenueData] = useState(undefined);
  const [top10Books, setTop10Books] = useState(undefined);
  const [stockData, setStockData] = useState(undefined);
  const [importData, setImportData] = useState(undefined);

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
    if (activeTab === "stock") {
      setStockData(undefined);
      getAllBooks()
        .then((books) => setStockData({ books }))
        .catch(() => setStockData(null));
    }    if (activeTab === "import") {
      setImportData(undefined);
      getImportsByMonth(year)
        .then((imports) => setImportData({ imports }))
        .catch((err) => {
          console.error("Lỗi khi lấy dữ liệu nhập kho:", err);
          setImportData(null);
        });
    }
  }, [activeTab, year, month]);

  return (
    <div className="report-statistics-container">
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
      </div>      <div className="report-filter-row">
        {activeTab !== "revenue" && activeTab !== "stock" && activeTab !== "import" && (
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
        {activeTab !== "stock" && activeTab !== "import" && (
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
        )}
        {activeTab === "import" && (
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
        )}
      </div>
      {activeTab === "revenue" && (
        <RevenueTable data={revenueData} year={year} />
      )}      
      {activeTab === "top10" && (
        <Top10BooksTable books={top10Books} />
      )}      {activeTab === "stock" && (
        <StockTable data={stockData} />
      )}      {activeTab === "import" && (
        <ImportBooksTable data={importData} year={year} />
      )}
    </div>
  );
};

export default ReportStatistics;