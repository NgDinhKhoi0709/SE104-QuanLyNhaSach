const invoiceService = require("../services/invoiceService");

const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getAllInvoices();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách hóa đơn" });
    }
};

const addInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        const result = await invoiceService.addInvoice(invoiceData);
        res.status(201).json(result);
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi thêm hóa đơn" });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        }
        res.json(invoice);
    } catch (error) {
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
        res.status(500).json({ message: "Lỗi server khi xóa hóa đơn" });
    }
};

const getTotalRevenueByMonth = async (req, res) => {
    try {
        const year = req.query.year || req.params.year;
        const yearlyData = await invoiceService.getYearlyRevenueData(year);
        res.json(yearlyData);
    } catch (error) {
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
        if (error.message === "Thiếu tham số tháng hoặc năm") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi lấy top 10 sách bán chạy" });
    }
};

const getDailyRevenueByMonth = async (req, res) => {
    try {
        const month = req.query.month || req.params.month;
        const year = req.query.year || req.params.year;
        const dailyData = await invoiceService.getDailyRevenueData(month, year);
        res.json(dailyData);
    } catch (error) {
        if (error.message === "Thiếu tham số tháng hoặc năm") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi lấy doanh thu theo ngày" });
    }
};

const exportInvoicePDF = async (req, res) => {
    try {
        await invoiceService.generateInvoicePDF(req.params.id, res);
    } catch (error) {
        if (error.message === "Không tìm thấy hóa đơn") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Lỗi server khi xuất PDF hóa đơn" });
    }
};

// Endpoint test để tạo dữ liệu mẫu cho tháng 6/2025
const createTestDataForJune2025 = async (req, res) => {
    try {
        // Lấy một số cuốn sách từ cơ sở dữ liệu
        const [books] = await require('../db').query("SELECT id, price FROM books LIMIT 5");
        
        if (!books || books.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy sách trong cơ sở dữ liệu" });
        }

        const result = [];
        
        // Tạo một số hóa đơn trong tháng 6/2025 cho các ngày khác nhau
        for (let day = 1; day <= 15; day += 2) { // Tạo cho ngày 1, 3, 5, 7, 9, 11, 13, 15
            const date = new Date(2025, 5, day); // Tháng 6 (chỉ số 5)
            
            const invoiceData = {
                customer_name: `Khách hàng Test ${day}`,
                customer_phone: `09${100000 + day}`,
                total_amount: 0,
                discount_amount: 0,
                final_amount: 0,
                created_by: 1, // Admin
                created_at: date,
                bookDetails: []
            };
            
            // Thêm chi tiết sách vào hóa đơn
            const totalBooks = Math.floor(Math.random() * 3) + 1; // 1-3 cuốn sách
            for (let i = 0; i < totalBooks; i++) {
                const book = books[Math.floor(Math.random() * books.length)];
                const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 cuốn mỗi loại
                
                invoiceData.bookDetails.push({
                    book_id: book.id,
                    quantity: quantity,
                    unit_price: book.price
                });
                
                // Cập nhật tổng tiền
                invoiceData.total_amount += quantity * book.price;
            }
            
            // Giả lập giảm giá 10% cho một số hóa đơn
            if (day % 4 === 1) { // ngày 1, 5, 9, 13
                invoiceData.discount_amount = Math.round(invoiceData.total_amount * 0.1);
            }
            
            invoiceData.final_amount = invoiceData.total_amount - invoiceData.discount_amount;
            
            // Thêm hóa đơn vào cơ sở dữ liệu
            try {
                const invoice = await invoiceService.addInvoice(invoiceData);
                result.push(invoice);
            } catch (err) {
                console.error(`Lỗi khi tạo hóa đơn ngày ${day}:`, err);
            }
        }
        
        res.status(201).json({ 
            message: `Đã tạo ${result.length} hóa đơn mẫu cho tháng 6/2025`,
            invoices: result 
        });
    } catch (error) {
        console.error("Lỗi khi tạo dữ liệu test:", error);
        res.status(500).json({ message: "Lỗi server khi tạo dữ liệu test" });
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
    getDailyRevenueByMonth,
    createTestDataForJune2025
};
