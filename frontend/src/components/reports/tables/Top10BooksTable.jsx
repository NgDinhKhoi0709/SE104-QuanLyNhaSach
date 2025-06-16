import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Top10BooksTable = ({ books }) => {
  if (!books || books.length === 0)
    return (
      <div style={{ color: "#d32f2f", marginTop: 24 }}>
        Không có dữ liệu cho báo cáo này.
      </div>
    );

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: books.map((book) => book.title),
    datasets: [
      {
        label: "Số lượng bán",
        data: books.map((book) => book.total_sold),
        backgroundColor: "#095e5a",
        borderColor: "#074c48",
        borderWidth: 1,
      },
    ],
  };  // Plugin tùy chỉnh để hiển thị số liệu
  const datalabelsPlugin = {
    id: 'datalabels',
    afterDatasetsDraw: function(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar, index) => {
          const data = dataset.data[index];
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            Number(data).toLocaleString('vi-VN'),
            bar.x - 5,
            bar.y
          );
        });
      });
    }
  };

  const options = {
    indexAxis: 'y', // Tạo horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${Number(context.parsed.x).toLocaleString("vi-VN")}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng bán",
        },
        ticks: {
          callback: (value) => Number(value).toLocaleString("vi-VN"),
        },
      },
      y: {
        title: {
          display: true,
          text: "Tên sách",
        },
      },
    },
  };
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 24 }}>
        Top 10 sách bán chạy nhất
      </h3>
      <Bar data={chartData} options={options} plugins={[datalabelsPlugin]} height={70} />
    </div>
  );
};

export default Top10BooksTable;
