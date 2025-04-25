import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faChartBar,
  faFileExport,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

const ReportStatistics = () => {
  const [month, setMonth] = useState(4); // Mặc định là tháng 4
  const [year, setYear] = useState(2025); // Mặc định là năm 2025
  const [reportType, setReportType] = useState("revenue"); // Mặc định là thống kê doanh thu
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  const getMonthName = (month) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[month - 1];
  };

  return (
    <div className="report-container">
      <h2>BÁO CÁO & THỐNG KÊ</h2>

      <div className="report-options">
        <div 
          className={`report-option ${reportType === "revenue" ? "selected" : ""}`}
          onClick={() => setReportType("revenue")}
        >
          <div className="report-option-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="report-option-title">Doanh thu tháng</div>
          <div className="report-option-desc">Thống kê doanh thu theo tháng</div>
        </div>

        <div 
          className={`report-option ${reportType === "bestsellers" ? "selected" : ""}`}
          onClick={() => setReportType("bestsellers")}
        >
          <div className="report-option-icon">
            <FontAwesomeIcon icon={faChartBar} />
          </div>
          <div className="report-option-title">Sách bán chạy</div>
          <div className="report-option-desc">Thống kê sách bán chạy nhất trong tháng</div>
        </div>
      </div>

      <div className="report-filters">
        <div className="report-filter">
          <label htmlFor="month-select">Tháng:</label>
          <select
            id="month-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
        </div>

        <div className="report-filter">
          <label htmlFor="year-select">Năm:</label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => 2020 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="report-action">
        <button className="generate-report-button" onClick={handleGenerateReport}>
          <FontAwesomeIcon icon={faFileExport} />
          Xuất báo cáo
        </button>
      </div>

      {showPreview && (
        <div className="report-preview">
          <div className="report-preview-title">
            {reportType === "revenue" ? 
              `Doanh thu ${getMonthName(month)} năm ${year}` : 
              `Sách bán chạy nhất ${getMonthName(month)} năm ${year}`}
          </div>
          
          <div className="report-chart">
            {reportType === "revenue" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "20px" }}>
                  <FontAwesomeIcon icon={faChartLine} style={{ fontSize: "50px", color: "#095e5a" }} />
                </div>
                <div style={{ fontSize: "16px", color: "#666" }}>
                  Biểu đồ doanh thu sẽ hiển thị ở đây
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "20px" }}>
                  <FontAwesomeIcon icon={faChartBar} style={{ fontSize: "50px", color: "#095e5a" }} />
                </div>
                <div style={{ fontSize: "16px", color: "#666" }}>
                  Danh sách sách bán chạy sẽ hiển thị ở đây
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportStatistics;