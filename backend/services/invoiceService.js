const PDFDocument = require("pdfkit");
const path = require("path");
const invoiceModel = require("../models/invoiceModel");

// Lấy danh sách hóa đơn
const getAllInvoices = async () => {
    return await invoiceModel.getAllInvoices();
};

// Thêm hóa đơn mới
const addInvoice = async (invoiceData) => {
    return await invoiceModel.addInvoice(invoiceData);
};

// Lấy chi tiết hóa đơn theo id
const getInvoiceById = async (invoiceId) => {
    return await invoiceModel.getInvoiceById(invoiceId);
};

// Xóa hóa đơn
const deleteInvoice = async (invoiceId) => {
    return await invoiceModel.deleteInvoice(invoiceId);
};

// Lấy tổng doanh thu theo tháng trong năm
const getYearlyRevenueData = async (year) => {
    if (!year) {
        throw new Error("Thiếu tham số năm");
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
    return { monthly };
};

// Lấy doanh thu theo ngày trong một tháng cụ thể
const getDailyRevenueData = async (month, year) => {
    if (!month || !year) {
        throw new Error("Thiếu tham số tháng hoặc năm");
    }
    
    console.log(`[getDailyRevenueData] Lấy dữ liệu cho tháng ${month}/${year}`);
    
    // Lấy số ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Lấy dữ liệu từ database
    const dailyData = await invoiceModel.getDailyRevenueByMonth(month, year);
    console.log("[getDailyRevenueData] Dữ liệu từ database:", dailyData);
    
    // Chuẩn hóa dữ liệu để đảm bảo đủ số ngày trong tháng
    const normalizedData = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const found = dailyData.find(data => Number(data.day) === d);
        normalizedData.push({
            day: d,
            totalRevenue: found ? Number(found.totalRevenue) || 0 : 0,
            totalSold: found ? Number(found.totalSold) || 0 : 0
        });
    }
    
    const hasData = normalizedData.some(day => day.totalRevenue > 0 || day.totalSold > 0);
    console.log(`[getDailyRevenueData] Dữ liệu sau chuẩn hóa (${hasData ? 'có dữ liệu' : 'không có dữ liệu'})`, normalizedData);
    
    return { daily: normalizedData };
};

// Lấy top 10 sách bán chạy nhất
const getTop10MostSoldBooks = async (month, year) => {
    if (!month || !year) {
        throw new Error("Thiếu tham số tháng hoặc năm");
    }
    return await invoiceModel.getTop10MostSoldBooks(month, year);
};

// Tạo file PDF hóa đơn
const generateInvoicePDF = async (invoiceId, res) => {
    const invoice = await invoiceModel.getInvoiceById(invoiceId);
    if (!invoice) {
        throw new Error("Không tìm thấy hóa đơn");
    }

    // Tạo PDF
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Đăng ký font hỗ trợ tiếng Việt
    try {
        doc.registerFont(
            "DejaVu",
            path.join(__dirname, "../../public/fonts/DejaVuSans.ttf")
        );
        doc.font("DejaVu");
    } catch (fontErr) {
        console.error("Font registration error:", fontErr);
        throw new Error("Không tìm thấy hoặc lỗi font DejaVuSans.ttf");
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
    return doc;
};

module.exports = {
    getAllInvoices,
    addInvoice,
    getInvoiceById,
    deleteInvoice,
    getYearlyRevenueData,
    getTop10MostSoldBooks,
    generateInvoicePDF,
    getDailyRevenueData
};
