const PDFDocument = require("pdfkit");
const path = require("path");
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

// Thêm hóa đơn mới
const addInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        const result = await invoiceModel.addInvoice(invoiceData);
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
        const invoice = await invoiceModel.getInvoiceById(req.params.id);
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
        const result = await invoiceModel.deleteInvoice(invoiceId);
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
        if (!year) {
            return res.status(400).json({ message: "Thiếu tham số năm" });
        }
        // Lấy dữ liệu cho cả 12 tháng
        const monthly = [];
        for (let m = 1; m <= 12; m++) {
            const result = await invoiceModel.getTotalRevenueByMonth(m, year);
            monthly.push({
                month: m,
                totalRevenue: result.totalRevenue || 0,
                totalSold: result.totalSold || 0
            });
        }
        res.json({ monthly });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy doanh thu theo năm" });
    }
};

const getTop10MostSoldBooks = async (req, res) => {
    try {
        const month = req.query.month || req.params.month;
        const year = req.query.year || req.params.year;
        if (!month || !year) {
            return res.status(400).json({ message: "Thiếu tham số tháng hoặc năm" });
        }
        const books = await invoiceModel.getTop10MostSoldBooks(month, year);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy top 10 sách bán chạy" });
    }
};

const exportInvoicePDF = async (req, res) => {
    try {
        const invoice = await invoiceModel.getInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        }

        // Tạo PDF
        const doc = new PDFDocument({ size: "A4", margin: 40 });

        // Đăng ký font hỗ trợ tiếng Việt từ public/fonts thay vì backend/fonts
        try {
            // Thay đổi đường dẫn để trỏ tới public/fonts
            doc.registerFont(
                "DejaVu",
                path.join(__dirname, "../../public/fonts/DejaVuSans.ttf")
            );
            doc.font("DejaVu");
            console.log("Font đăng ký thành công!");
        } catch (fontErr) {
            console.error("Font registration error:", fontErr);
            console.error("Font path:", path.join(__dirname, "../../public/fonts/DejaVuSans.ttf"));
            return res.status(500).json({ message: "Không tìm thấy hoặc lỗi font DejaVuSans.ttf" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice_${invoice.id || "unknown"}.pdf`);
        doc.pipe(res);

        // Tiêu đề hóa đơn
        doc.fontSize(20).text(`HÓA ĐƠN BÁN SÁCH`, { align: "center" });
        doc.moveDown(1.5);

        // Tạo layout 2 cột cho thông tin hóa đơn
        const leftColumn = 50;
        const rightColumn = 300;
        const startY = doc.y;

        // Thông tin bên trái - Khách hàng
        doc.fontSize(12).text(`Khách hàng: ${invoice.customer_name || ""}`, leftColumn, startY);
        doc.text(`SĐT: ${invoice.customer_phone || ""}`, leftColumn);

        // Thông tin bên phải - Ngày và người lập hóa đơn
        doc.fontSize(12).text(`Ngày: ${invoice.created_at ? new Date(invoice.created_at).toLocaleDateString("vi-VN") : ""}`, rightColumn, startY);
        doc.text(`Người lập: ${invoice.created_by_name}`, rightColumn);

        // Di chuyển xuống dưới dòng dài nhất của cả 2 cột
        doc.moveDown(2);

        // Căn lề trái cho tiêu đề chi tiết đơn hàng
        doc.text("Chi tiết đơn hàng:", 50, doc.y, { underline: true, align: "left" });
        doc.moveDown(0.5);

        // Cải thiện bảng chi tiết với các đường kẻ và căn chỉnh chuẩn hơn
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidths = [40, 200, 40, 80, 100]; // Chiều rộng các cột
        const colPositions = [
            tableLeft, 
            tableLeft + colWidths[0], 
            tableLeft + colWidths[0] + colWidths[1], 
            tableLeft + colWidths[0] + colWidths[1] + colWidths[2],
            tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
        ];
        const rowHeight = 25;
        
        // Vẽ header của bảng
        doc.font("DejaVu").fontSize(12);
        doc.rect(tableLeft, tableTop, colWidths.reduce((a, b) => a + b, 0), rowHeight).stroke();
        doc.text("STT", colPositions[0] + 5, tableTop + 7, { width: colWidths[0] - 10 });
        doc.text("Tên sách", colPositions[1] + 5, tableTop + 7, { width: colWidths[1] - 10 });
        doc.text("SL", colPositions[2] + 5, tableTop + 7, { width: colWidths[2] - 10, align: 'center' });
        doc.text("Đơn giá", colPositions[3] + 5, tableTop + 7, { width: colWidths[3] - 10, align: 'right' });
        doc.text("Thành tiền", colPositions[4] + 5, tableTop + 7, { width: colWidths[4] - 10, align: 'right' });
        
        // Vẽ đường kẻ ngăn cách header và nội dung
        doc.moveTo(tableLeft, tableTop + rowHeight)
           .lineTo(tableLeft + colWidths.reduce((a, b) => a + b, 0), tableTop + rowHeight)
           .stroke();
           
        // Vẽ các đường kẻ dọc ngăn cách các cột
        for (let i = 1; i < colPositions.length; i++) {
            doc.moveTo(colPositions[i], tableTop)
               .lineTo(colPositions[i], tableTop + rowHeight)
               .stroke();
        }
        
        // Ensure bookDetails is an array
        const bookDetails = Array.isArray(invoice.bookDetails) ? invoice.bookDetails : [];
        let currentTop = tableTop + rowHeight;
        
        // Vẽ các dòng cho từng sản phẩm
        bookDetails.forEach((book, idx) => {
            // Vẽ khung cho dòng
            doc.rect(tableLeft, currentTop, colWidths.reduce((a, b) => a + b, 0), rowHeight).stroke();
            
            // Điền nội dung vào từng ô
            doc.text(`${idx + 1}`, colPositions[0] + 5, currentTop + 7, { width: colWidths[0] - 10 });
            doc.text(`${book.book_title || book.title || ""}`, colPositions[1] + 5, currentTop + 7, { width: colWidths[1] - 10 });
            doc.text(`${book.quantity || 0}`, colPositions[2] + 5, currentTop + 7, { width: colWidths[2] - 10, align: 'center' });
            doc.text(`${Number(book.unit_price || 0).toLocaleString("vi-VN")}`, colPositions[3] + 5, currentTop + 7, { width: colWidths[3] - 10, align: 'right' });
            doc.text(`${((book.quantity || 0) * (book.unit_price || 0)).toLocaleString("vi-VN")}`, colPositions[4] + 5, currentTop + 7, { width: colWidths[4] - 10, align: 'right' });
            
            // Vẽ đường kẻ dọc ngăn cách các cột
            for (let i = 1; i < colPositions.length; i++) {
                doc.moveTo(colPositions[i], currentTop)
                   .lineTo(colPositions[i], currentTop + rowHeight)
                   .stroke();
            }
            
            currentTop += rowHeight;
        });

        // Tổng cộng
        doc.moveDown();
        currentTop += 15;
        // Đặt label bên trái, giá trị và VNĐ sát nhau bên phải
        const labelX = 320;
        const valueX = 470;
        const lineHeight = 22;
        doc.fontSize(12);

        doc.text("Tổng tiền hàng:", labelX, currentTop);
        doc.text(`${Number(invoice.total_amount || 0).toLocaleString("vi-VN")} VNĐ`, valueX, currentTop, { align: 'left' });

        currentTop += lineHeight;
        doc.text("Giảm giá:", labelX, currentTop);
        doc.text(`${Number(invoice.discount_amount || 0).toLocaleString("vi-VN")} VNĐ`, valueX, currentTop, { align: 'left' });

        currentTop += lineHeight;
        doc.text("Thành tiền:", labelX, currentTop);
        doc.fontSize(12); // Giảm font size về giống các dòng trên
        doc.text(`${Number(invoice.final_amount || 0).toLocaleString("vi-VN")} VNĐ`, valueX, currentTop, { align: 'left' });

        doc.end();
    } catch (error) {
        console.error("Export PDF error:", error);
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
