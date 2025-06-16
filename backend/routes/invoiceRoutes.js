const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// Lấy danh sách hóa đơn
router.get("/", invoiceController.getAllInvoices);

// Thêm hóa đơn mới
router.post("/", invoiceController.addInvoice);
// Lấy tổng doanh thu theo tháng
router.get("/revenue", invoiceController.getTotalRevenueByMonth);

// Lấy top 10 sách bán chạy nhất theo tháng và năm
router.get("/top10", invoiceController.getTop10MostSoldBooks);

// Lấy chi tiết hóa đơn
router.get("/:id", invoiceController.getInvoiceById);

// Route xuất PDF hóa đơn
router.get("/:id/pdf", invoiceController.exportInvoicePDF);

router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
