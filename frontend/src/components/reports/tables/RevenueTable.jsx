import React from "react";
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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const RevenueTable = ({ data, year }) => {
  // data: { monthly: [{ month, totalRevenue, totalSold }] }
  if (data === undefined) {
    return (
      <div style={{ marginTop: 24, color: "#888", textAlign: "center" }}>
        Đang tải dữ liệu...
      </div>
    );
  }
  if (!data || !Array.isArray(data.monthly) || data.monthly.length === 0) {
    return (
      <div style={{ color: "#d32f2f", marginTop: 24 }}>
        Không có dữ liệu cho báo cáo này.
      </div>
    );
  }

  // Chuẩn hóa dữ liệu đủ 12 tháng
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const revenueByMonth = months.map((m) => {
    const found = data.monthly.find((item) => Number(item.month) === m);
    return found
      ? {
          totalRevenue: Number(found.totalRevenue) || 0,
          totalSold: Number(found.totalSold) || 0,
        }
      : { totalRevenue: 0, totalSold: 0 };
  });

  const chartData = {
    labels: months.map((m) => `Tháng ${m}`),
    datasets: [
      {
        label: "Tổng doanh thu (VNĐ)",
        data: revenueByMonth.map((d) => d.totalRevenue),
        backgroundColor: "#095e5a",
        yAxisID: "y1",
        fill: false,
        borderColor: "#095e5a",
        tension: 0.1,
      },
      {
        label: "Tổng số lượng sách bán",
        data: revenueByMonth.map((d) => d.totalSold),
        backgroundColor: "#48B162",
        yAxisID: "y2",
        fill: false,
        borderColor: "#48B162",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return (
                context.dataset.label +
                ": " +
                Number(context.parsed.y).toLocaleString("vi-VN") +
                " VNĐ"
              );
            }
            return (
              context.dataset.label +
              ": " +
              Number(context.parsed.y).toLocaleString("vi-VN")
            );
          },
        },
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Tổng doanh thu (VNĐ)" },
        ticks: {
          callback: (value) => Number(value).toLocaleString("vi-VN"),
        },
        beginAtZero: true,
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Tổng số lượng sách bán" },
        grid: { drawOnChartArea: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 24 }}>
        Biểu đồ doanh thu & số lượng sách bán theo tháng năm {year}
      </h3>
      <Line data={chartData} options={options} height={130} />
    </div>
  );
};

export default RevenueTable;
