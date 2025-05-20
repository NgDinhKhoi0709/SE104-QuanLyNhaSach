const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// Lấy danh sách hóa đơn
router.get("/", invoiceController.getAllInvoices);

module.exports = router;
