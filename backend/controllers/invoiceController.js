const invoiceModel = require("../models/invoiceModel");

// Lấy danh sách hóa đơn
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceModel.getAllInvoices();
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách hóa đơn" });
    }
};

module.exports = {
    getAllInvoices,
};
