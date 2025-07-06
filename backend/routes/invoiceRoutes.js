const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { verifyToken } = require("../middlewares/authMiddleware");
// Lấy danh sách hóa đơn (cần xác thực)
router.get("/", verifyToken, invoiceController.getInvoices);
// Thêm hóa đơn mới (không cần xác thực)
router.post("/", invoiceController.addInvoice);
// Lấy tổng doanh thu theo tháng (không cần xác thực)
router.get("/revenue", invoiceController.getTotalRevenueByMonth);

// Lấy doanh thu theo ngày trong tháng (không cần xác thực)
router.get("/daily-revenue", invoiceController.getDailyRevenueByMonth);

// Lấy top 10 sách bán chạy nhất theo tháng và năm (không cần xác thực)
router.get("/top10", invoiceController.getTop10MostSoldBooks);

// Lấy chi tiết hóa đơn (không cần xác thực)
router.get("/:id", invoiceController.getInvoiceById);

// Route xuất PDF hóa đơn (không cần xác thực)
router.get("/:id/pdf", invoiceController.exportInvoicePDF);

router.delete("/:id", verifyToken, invoiceController.deleteInvoice);

module.exports = router;
