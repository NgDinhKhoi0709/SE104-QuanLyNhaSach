const invoiceService = require("../services/invoiceService");

// Lấy danh sách hóa đơn
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getAllInvoices();
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách hóa đơn" });
    }
};

// Thêm hóa đơn mới
const addInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        const result = await invoiceService.addInvoice(invoiceData);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        if (error.status === 400) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi thêm hóa đơn" });
    }
};

// Lấy chi tiết hóa đơn theo id
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        }
        res.json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy chi tiết hóa đơn" });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const result = await invoiceService.deleteInvoice(invoiceId);
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Không tìm thấy hóa đơn để xóa" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi xóa hóa đơn" });
    }
};

const getTotalRevenueByMonth = async (req, res) => {
    try {
        const year = req.query.year || req.params.year;
        const yearlyData = await invoiceService.getYearlyRevenueData(year);
        res.json(yearlyData);
    } catch (error) {
        console.error(error);
        if (error.message === "Thiếu tham số năm") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi lấy doanh thu theo năm" });
    }
};

const getTop10MostSoldBooks = async (req, res) => {
    try {
        const month = req.query.month || req.params.month;
        const year = req.query.year || req.params.year;
        const books = await invoiceService.getTop10MostSoldBooks(month, year);
        res.json(books);
    } catch (error) {
        console.error(error);
        if (error.message === "Thiếu tham số tháng hoặc năm") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi lấy top 10 sách bán chạy" });
    }
};

const exportInvoicePDF = async (req, res) => {
    try {
        await invoiceService.generateInvoicePDF(req.params.id, res);
    } catch (error) {
        console.error("Export PDF error:", error);
        if (error.message === "Không tìm thấy hóa đơn") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi xuất PDF hóa đơn" });
    }
};

module.exports = {
    getAllInvoices,
    addInvoice,
    getInvoiceById,
    deleteInvoice,
    exportInvoicePDF,
    getTotalRevenueByMonth,
    getTop10MostSoldBooks,
};
