import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./ImportBooksTable.css"; // CSS riêng cho ImportBooksTable
import { getImportStatsByYear } from "../../../services/importService";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ImportBooksTable = ({ data, year }) => {
  // Dữ liệu nhập kho theo tháng cho biểu đồ
  const [monthlyImportData, setMonthlyImportData] = useState([]);
    // Lấy dữ liệu nhập kho theo tháng
  useEffect(() => {
    async function fetchImportStats() {
      try {
        // Sử dụng API thực tế
        const data = await getImportStatsByYear(year);
        
        if (data && data.length > 0) {
          // Chuyển đổi dữ liệu từ API để phù hợp với format biểu đồ
          const formattedData = data.map(item => ({
            month: item.month,
            totalBooks: item.totalBooks,
            totalCost: item.totalCost
          }));
          
          setMonthlyImportData(formattedData);
        } else {
          // Nếu không có dữ liệu, dùng mảng rỗng
          setMonthlyImportData([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê nhập kho:", error);
        // Dùng dữ liệu rỗng khi có lỗi
        setMonthlyImportData([]);
      }
    }
    
    fetchImportStats();
  }, [year]);

  // Tạo dữ liệu cho biểu đồ
  const chartData = {
    labels: monthlyImportData.map(d => `Tháng ${d.month}`),
    datasets: [
      {
        label: "Số lượng sách nhập",
        data: monthlyImportData.map(d => d.totalBooks),
        backgroundColor: "#1976d2",
        yAxisID: "y1",
        fill: false,
        borderColor: "#1976d2",
        tension: 0.1,
      },
      {
        label: "Tổng giá trị nhập (VNĐ)",
        data: monthlyImportData.map(d => d.totalCost),
        backgroundColor: "#d32f2f",
        yAxisID: "y2",
        fill: false,
        borderColor: "#d32f2f",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return context.dataset.label + ": " + Number(context.parsed.y).toLocaleString("vi-VN");
            }
            return context.dataset.label + ": " + Number(context.parsed.y).toLocaleString("vi-VN") + " VNĐ";
          },
        },
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Số lượng sách" },
        beginAtZero: true,
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Giá trị nhập (VNĐ)" },
        ticks: {
          callback: (value) => Number(value).toLocaleString("vi-VN"),
        },
        grid: { drawOnChartArea: false },
        beginAtZero: true,
      },
    },
  };

  if (monthlyImportData.length === 0) {
    return (
      <div className="no-data-message">
        Không có dữ liệu nhập kho cho khoảng thời gian này.
      </div>
    );
  }

  return (
    <div className="import-table-container">
      {/* Biểu đồ thống kê nhập kho theo tháng */}
      <div className="import-chart-container">
        <h3 className="chart-title">Biểu đồ số lượng và giá trị nhập kho theo tháng năm {year}</h3>
        <Line data={chartData} options={chartOptions} height={130} />
      </div>
    </div>
  );
};

export default ImportBooksTable;
