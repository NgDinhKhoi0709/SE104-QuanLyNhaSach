import React, { useState, useEffect } from "react";
import RevenueTable from "./tables/RevenueTable";
import Top10BooksTable from "./tables/Top10BooksTable";
import StockTable from "./tables/StockTable";
import ImportBooksTable from "./tables/ImportBooksTable";
import "./ReportStatistics.css";
import { getRevenueByYear, getTop10MostSoldBooks, getDailyRevenueByMonth } from "../../services/reportService";
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
  const [dailyRevenueData, setDailyRevenueData] = useState(undefined);
  const [revenueViewType, setRevenueViewType] = useState("monthly"); // 'monthly' or 'daily'
  const [top10Books, setTop10Books] = useState(undefined);
  const [stockData, setStockData] = useState(undefined);
  const [importData, setImportData] = useState(undefined);

  useEffect(() => {
    if (activeTab === "revenue") {
      if (revenueViewType === "monthly") {
        setRevenueData(undefined);
        getRevenueByYear(year)
          .then((data) => setRevenueData(data))
          .catch(() => setRevenueData(null));
      } else if (revenueViewType === "daily") {
        setDailyRevenueData(undefined);
        getDailyRevenueByMonth(month, year)
          .then((data) => {
            console.log("Daily revenue data received:", data);
            setDailyRevenueData(data);
          })
          .catch((error) => {
            console.error("Error fetching daily revenue data:", error);
            setDailyRevenueData(null);
          });
      }
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
    }    
    if (activeTab === "import") {
      setImportData(undefined);
      getImportsByMonth(year)
        .then((imports) => setImportData({ imports }))
        .catch((err) => {
          console.error("Lỗi khi lấy dữ liệu nhập kho:", err);
          setImportData(null);
        });
    }
  }, [activeTab, year, month, revenueViewType]);

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
      </div>
      
      <div className="report-filter-row">
        {/* View type selector for revenue tab */}
        {activeTab === "revenue" && (
          <label>
            Loại xem:
            <select
              value={revenueViewType}
              onChange={(e) => setRevenueViewType(e.target.value)}
              style={{ marginLeft: "8px" }}
            >
              <option value="monthly">Theo tháng</option>
              <option value="daily">Theo ngày</option>
            </select>
          </label>
        )}
        
        {/* Month selector */}
        {(activeTab === "top10" || (activeTab === "revenue" && revenueViewType === "daily")) && (
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
        
        {/* Year selector */}
        {(activeTab !== "stock" || activeTab === "import" || activeTab === "revenue" || activeTab === "top10") && (
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
      
      {activeTab === "revenue" && revenueViewType === "monthly" && (
        <RevenueTable data={revenueData} year={year} viewType="monthly" />
      )}
      
      {activeTab === "revenue" && revenueViewType === "daily" && (
        <RevenueTable data={dailyRevenueData} year={year} month={month} viewType="daily" />
      )}
      
      {activeTab === "top10" && (
        <Top10BooksTable books={top10Books} />
      )}
      
      {activeTab === "stock" && (
        <StockTable data={stockData} />
      )}
      
      {activeTab === "import" && (
        <ImportBooksTable data={importData} year={year} />
      )}
    </div>
  );
};

export default ReportStatistics;