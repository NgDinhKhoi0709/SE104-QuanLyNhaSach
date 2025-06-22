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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Top10BooksTable = ({ books, month, year }) => {
  console.log("Top10BooksTable props:", { books, month, year }); // Debug log

  const exportToPDF = async () => {
    try {
      const chartElement = document.getElementById("top10-books-chart");
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement, {
        scale: 10,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("landscape", "mm", "a4");

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create title as image to support Vietnamese
      const displayMonth = month || new Date().getMonth() + 1;
      const displayYear = year || new Date().getFullYear();
      const title = `Báo cáo Top 10 sách bán chạy nhất - Tháng ${displayMonth}/${displayYear}`;

      const titleCanvas = document.createElement("canvas");
      const titleCtx = titleCanvas.getContext("2d");
      titleCanvas.width = 1400;
      titleCanvas.height = 60;
      titleCtx.fillStyle = "#ffffff";
      titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
      titleCtx.fillStyle = "#000000";
      titleCtx.font = "bold 32px Arial, sans-serif";
      titleCtx.textAlign = "center";
      titleCtx.fillText(title, titleCanvas.width / 2, 40);

      const titleImgData = titleCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(titleImgData, "PNG", 10, 5, 277, 15);

      // Add chart
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);

      // Add timestamp as image
      const timestampCanvas = document.createElement("canvas");
      const timestampCtx = timestampCanvas.getContext("2d");
      timestampCanvas.width = 600;
      timestampCanvas.height = 40;
      timestampCtx.fillStyle = "#ffffff";
      timestampCtx.fillRect(0, 0, timestampCanvas.width, timestampCanvas.height);
      timestampCtx.fillStyle = "#000000";
      timestampCtx.font = "16px Arial, sans-serif";
      const timestamp = `Xuất lúc: ${new Date().toLocaleString("vi-VN")}`;
      timestampCtx.fillText(timestamp, 10, 25);

      const timestampImgData = timestampCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(timestampImgData, "PNG", 15, imgHeight + 35, 120, 8);

      // Save the PDF
      const fileName = `bao-cao-top-10-sach-ban-chay-thang-${displayMonth}-${displayYear}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo PDF");
    }
  };

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
  }; // Plugin tùy chỉnh để hiển thị số liệu
  const datalabelsPlugin = {
    id: "datalabels",
    afterDatasetsDraw: function (chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar, index) => {
          const data = dataset.data[index];
          ctx.fillStyle = "#fff";
          ctx.font = "bold 14px Arial";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText(
            Number(data).toLocaleString("vi-VN"),
            bar.x - 5,
            bar.y
          );
        });
      });
    },
  };

  const options = {
    indexAxis: "y", // Tạo horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${Number(context.parsed.x).toLocaleString(
              "vi-VN"
            )}`;
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
  const displayMonth = month || new Date().getMonth() + 1;
  const displayYear = year || new Date().getFullYear();

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h3 style={{ margin: 0 }}>
          Top 10 sách bán chạy nhất - Tháng {displayMonth}/{displayYear}
        </h3>
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={exportToPDF}
        >
          📄 Xuất PDF
        </button>
      </div>
      <div id="top10-books-chart">
        <Bar
          data={chartData}
          options={options}
          plugins={[datalabelsPlugin]}
          height={70}
        />
      </div>
    </div>
  );
};

export default Top10BooksTable;

