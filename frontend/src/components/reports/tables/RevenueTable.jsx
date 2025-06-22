import React from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./RevenueTable.css";

ChartJS.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RevenueTable = ({ data, year, month, viewType = "monthly" }) => {
  const exportToPDF = async () => {
    try {
      const chartElement = document.getElementById("revenue-chart");
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement, {
        scale: 9,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const title = viewType === "daily" 
        ? `Báo cáo doanh thu & số lượng sách bán - Tháng ${month}/${year}`
        : `Báo cáo doanh thu & số lượng sách bán - Năm ${year}`;
    
      const titleCanvas = document.createElement('canvas');
      const titleCtx = titleCanvas.getContext('2d');
      titleCanvas.width = 1400;
      titleCanvas.height = 60;
      titleCtx.fillStyle = '#ffffff';
      titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
      titleCtx.fillStyle = '#000000';
      titleCtx.font = 'bold 32px Arial, sans-serif';
      titleCtx.textAlign = 'center';
      titleCtx.fillText(title, titleCanvas.width / 2, 40);
      
      const titleImgData = titleCanvas.toDataURL("image/png");
      pdf.addImage(titleImgData, "PNG", 10, 5, 277, 15);
      
      // Add chart
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      
      // Add revenue summary as image
      const totalRevenue = revenueByMonth.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalSold = revenueByMonth.reduce((sum, item) => sum + item.totalSold, 0);
      
      const summaryCanvas = document.createElement('canvas');
      const summaryCtx = summaryCanvas.getContext('2d');
      summaryCanvas.width = 1200;
      summaryCanvas.height = 80;
      summaryCtx.fillStyle = '#ffffff';
      summaryCtx.fillRect(0, 0, summaryCanvas.width, summaryCanvas.height);
      summaryCtx.fillStyle = '#000000';
      summaryCtx.font = 'bold 24px Arial, sans-serif';
      summaryCtx.textAlign = 'left';
      summaryCtx.fillText(`Tổng kết năm ${year}:`, 20, 30);
      
      summaryCtx.font = '20px Arial, sans-serif';
      summaryCtx.fillText(`Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`, 20, 55);
      summaryCtx.fillText(`Tổng số sách bán: ${totalSold.toLocaleString('vi-VN')} cuốn`, 450, 55);
      
      const summaryImgData = summaryCanvas.toDataURL("image/png");
      pdf.addImage(summaryImgData, "PNG", 10, imgHeight + 35, 277, 20);
      
      // Add timestamp as image
      const timestampCanvas = document.createElement('canvas');
      const timestampCtx = timestampCanvas.getContext('2d');
      timestampCanvas.width = 600;
      timestampCanvas.height = 40;
      timestampCtx.fillStyle = '#ffffff';
      timestampCtx.fillRect(0, 0, timestampCanvas.width, timestampCanvas.height);
      timestampCtx.fillStyle = '#000000';
      timestampCtx.font = '16px Arial, sans-serif';
      const timestamp = `Xuất lúc: ${new Date().toLocaleString("vi-VN")}`;
      timestampCtx.fillText(timestamp, 10, 25);
      
      const timestampImgData = timestampCanvas.toDataURL("image/png");
      pdf.addImage(timestampImgData, "PNG", 15, imgHeight + 60, 120, 8);
      
      // Save the PDF
      const fileName = viewType === "daily" 
        ? `bao-cao-doanh-thu-ngay-${month}-${year}.pdf`
        : `bao-cao-doanh-thu-thang-${year}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo PDF");
    }
  };

    if (data === undefined) {
    return (
      <div className="loading-message">
        Đang tải dữ liệu...
      </div>
    );
  }
  if (viewType === "daily") {
    console.log("RevenueTable - daily view data:", data);
    const hasData = data && Array.isArray(data.daily) && data.daily.some(dayData => 
      dayData.totalRevenue > 0 || dayData.totalSold > 0
    );
      if (!data || !Array.isArray(data.daily) || !hasData) {
      return (
        <div className="error-message">
          Không có dữ liệu cho tháng {month}/{year}.
        </div>
      );
    }
    return renderDailyView(data.daily, month, year);
  }
  
  // Handle monthly view
  if (!data || !Array.isArray(data.monthly) || data.monthly.length === 0) {
    return (
      <div style={{ color: "#d32f2f", marginTop: 24 }}>
        Không có dữ liệu cho năm {year}.
      </div>
    );
  }

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
    labels: months.map((m) => `Tháng ${m}`),    datasets: [      {
        type: 'line',
        label: "Tổng doanh thu (VNĐ)",
        data: revenueByMonth.map((d) => d.totalRevenue),
        backgroundColor: "#FF7043",
        yAxisID: "y2",
        fill: false,
        borderColor: "#FF7043",
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        type: 'bar',
        label: "Tổng số lượng sách bán",
        data: revenueByMonth.map((d) => d.totalSold),
        backgroundColor: "#48B162",
        yAxisID: "y1",
        borderColor: "#36964e",
        borderWidth: 1,
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
    },    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Tổng số lượng sách bán" },
        beginAtZero: true,
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Tổng doanh thu (VNĐ)" },
        ticks: {
          callback: (value) => Number(value).toLocaleString("vi-VN"),
        },
        grid: { drawOnChartArea: false },
        beginAtZero: true,
      },
    },
  };
  return (
    <div style={{ marginTop: 24 }}>
      <div className="chart-header">
        <h3 style={{ marginBottom: 24 }}>
          Biểu đồ doanh thu & số lượng sách bán năm {year}
        </h3>
        <button className="export-pdf-btn" onClick={exportToPDF}>
          📄 Xuất PDF
        </button>
      </div>
      <div id="revenue-chart">
        <Chart type='bar' data={chartData} options={options} height={130} />
      </div>
      <div className="revenue-summary">
        <div className="summary-items">
          <div className="summary-item">
            <span className="label">Tổng doanh thu:</span>
            <span className="value">
              {revenueByMonth.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Tổng số sách bán:</span>
            <span className="value">
              {revenueByMonth.reduce((sum, item) => sum + item.totalSold, 0).toLocaleString('vi-VN')} cuốn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to render daily view
const renderDailyView = (dailyData, month, year) => {
  // Convert month to Vietnamese month name
  const monthNames = [
    'Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 
    'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Mười hai'
  ];
  
  const vietnameseMonth = monthNames[parseInt(month) - 1];
    // Prepare chart data
  const chartData = {
    labels: dailyData.map((d) => `N${d.day}`),
    datasets: [
      {
        type: 'line',
        label: "Tổng doanh thu (VNĐ)",
        data: dailyData.map((d) => d.totalRevenue),
        backgroundColor: "#FF7043",
        yAxisID: "y2",
        fill: false,
        borderColor: "#FF7043",
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        type: 'bar',
        label: "Tổng số lượng sách bán",
        data: dailyData.map((d) => d.totalSold),
        backgroundColor: "#48B162",
        yAxisID: "y1",
        borderColor: "#36964e",
        borderWidth: 1,
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
    },    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Tổng số lượng sách bán" },
        beginAtZero: true,
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Tổng doanh thu (VNĐ)" },
        ticks: {
          callback: (value) => Number(value).toLocaleString("vi-VN"),
        },
        grid: { drawOnChartArea: false },
        beginAtZero: true,
      },
    },
  };  
  const exportToPDF = async () => {
    try {
      const chartElement = document.getElementById("revenue-chart-daily");
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
      // Create title as image to support Vietnamese
      const title = `Báo cáo doanh thu & số lượng sách bán - Tháng ${month}/${year}`;
    
      const titleCanvas = document.createElement('canvas');
      const titleCtx = titleCanvas.getContext('2d');
      titleCanvas.width = 1400;
      titleCanvas.height = 60;
      titleCtx.fillStyle = '#ffffff';
      titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
      titleCtx.fillStyle = '#000000';
      titleCtx.font = 'bold 30px Arial, sans-serif';
      titleCtx.textAlign = 'center';
      titleCtx.fillText(title, titleCanvas.width / 2, 40);
      
      const titleImgData = titleCanvas.toDataURL("image/png");
      pdf.addImage(titleImgData, "PNG", 10, 5, 277, 15);
      
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      
      // Add revenue summary as image
      const totalRevenue = dailyData.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalSold = dailyData.reduce((sum, item) => sum + item.totalSold, 0);
      
      const summaryCanvas = document.createElement('canvas');
      const summaryCtx = summaryCanvas.getContext('2d');
      summaryCanvas.width = 1200;
      summaryCanvas.height = 80;
      summaryCtx.fillStyle = '#ffffff';
      summaryCtx.fillRect(0, 0, summaryCanvas.width, summaryCanvas.height);
      summaryCtx.fillStyle = '#000000';
      summaryCtx.font = 'bold 24px Arial, sans-serif';
      summaryCtx.textAlign = 'left';
      summaryCtx.fillText(`Tổng kết tháng ${month}/${year}:`, 20, 30);
      
      summaryCtx.font = '20px Arial, sans-serif';
      summaryCtx.fillText(`Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`, 20, 55);
      summaryCtx.fillText(`Tổng số sách bán: ${totalSold.toLocaleString('vi-VN')} cuốn`, 450, 55);
      
      const summaryImgData = summaryCanvas.toDataURL("image/png");
      pdf.addImage(summaryImgData, "PNG", 10, imgHeight + 35, 277, 20);
      
      // Add timestamp as image
      const timestampCanvas = document.createElement('canvas');
      const timestampCtx = timestampCanvas.getContext('2d');
      timestampCanvas.width = 600;
      timestampCanvas.height = 40;
      timestampCtx.fillStyle = '#ffffff';
      timestampCtx.fillRect(0, 0, timestampCanvas.width, timestampCanvas.height);
      timestampCtx.fillStyle = '#000000';
      timestampCtx.font = '16px Arial, sans-serif';
      const timestamp = `Xuất lúc: ${new Date().toLocaleString("vi-VN")}`;
      timestampCtx.fillText(timestamp, 10, 25);
      
      const timestampImgData = timestampCanvas.toDataURL("image/png");
      pdf.addImage(timestampImgData, "PNG", 15, imgHeight + 60, 120, 8);
      
      pdf.save(`bao-cao-doanh-thu-ngay-${month}-${year}.pdf`);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      alert("Có lỗi xảy ra khi xuất báo cáo PDF");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="chart-header">
        <h3 style={{ marginBottom: 24 }}>
          Biểu đồ doanh thu & số lượng sách bán ({month}/{year})
        </h3>
        <button className="export-pdf-btn" onClick={exportToPDF}>
          📄 Xuất PDF
        </button>
      </div>
      <div id="revenue-chart-daily">
        <Chart type='bar' data={chartData} options={options} height={130} />
      </div>
      <div className="revenue-summary">
        <h4>Tổng kết tháng {month}/{year}</h4>
        <div className="summary-items">
          <div className="summary-item">
            <span className="label">Tổng doanh thu:</span>
            <span className="value">
              {dailyData.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Tổng số sách bán:</span>
            <span className="value">
              {dailyData.reduce((sum, item) => sum + item.totalSold, 0).toLocaleString('vi-VN')} cuốn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTable;
