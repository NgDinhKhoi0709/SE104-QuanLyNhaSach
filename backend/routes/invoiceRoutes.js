const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// Lấy danh sách hóa đơn
router.get("/", invoiceController.getAllInvoices);

// Thêm hóa đơn mới
router.post("/", invoiceController.addInvoice);

// Lấy chi tiết hóa đơn
router.get("/:id", invoiceController.getInvoiceById);

// Route xuất PDF hóa đơn
router.get("/:id/pdf", invoiceController.exportInvoicePDF);

router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
