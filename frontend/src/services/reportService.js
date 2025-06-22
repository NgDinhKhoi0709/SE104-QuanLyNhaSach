import axios from "axios";

// Lấy thống kê doanh thu và số lượng sách bán theo 12 tháng của năm
export const getRevenueByYear = async (year) => {
  const res = await axios.get(`http://localhost:5000/api/invoices/revenue?year=${year}`);
  return res.data;
};

// Lấy thống kê doanh thu và số lượng sách bán theo ngày trong tháng
export const getDailyRevenueByMonth = async (month, year) => {
  const res = await axios.get(`http://localhost:5000/api/invoices/daily-revenue?month=${month}&year=${year}`);
  return res.data;
};

// Lấy top 10 sách bán chạy nhất theo tháng và năm
export const getTop10MostSoldBooks = async (month, year) => {
  const res = await axios.get(`http://localhost:5000/api/invoices/top10?month=${month}&year=${year}`);
  return res.data;
};
