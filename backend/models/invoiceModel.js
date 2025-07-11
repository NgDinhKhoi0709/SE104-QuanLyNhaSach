const db = require("../db");

const getAllInvoices = async () => {
    const [rows] = await db.query(`
        SELECT i.*, u.full_name AS created_by_name, p.name AS promotion_name
        FROM invoices i
        LEFT JOIN users u ON i.created_by = u.id
        LEFT JOIN promotions p ON i.promotion_code = p.promotion_code
        ORDER BY i.created_at DESC
    `);
    return rows;
};

const getInvoicesByUser = async (userId) => {
    const [rows] = await db.query(`
        SELECT i.*, u.full_name AS created_by_name, p.name AS promotion_name
        FROM invoices i
        LEFT JOIN users u ON i.created_by = u.id
        LEFT JOIN promotions p ON i.promotion_code = p.promotion_code
        WHERE i.created_by = ?
        ORDER BY i.created_at DESC
    `, [userId]);
    return rows;
};

const addInvoice = async (invoiceData) => {
    if (Array.isArray(invoiceData.bookDetails)) {
        for (const detail of invoiceData.bookDetails) {
            const [rows] = await db.query(
                "SELECT quantity_in_stock FROM books WHERE id = ?",
                [detail.book_id]
            );
            const currentStock = rows[0]?.quantity_in_stock ?? 0;
            if (detail.quantity > currentStock) {
                throw {
                    status: 400,
                    message: `Sách ID ${detail.book_id} không đủ tồn kho. Hiện còn: ${currentStock}, yêu cầu: ${detail.quantity}`
                };
            }
        }
    }

    const [invoiceResult] = await db.query(
        `INSERT INTO invoices (customer_name, customer_phone, total_amount, discount_amount, final_amount, promotion_code, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            invoiceData.customer_name,
            invoiceData.customer_phone,
            invoiceData.total_amount,
            invoiceData.discount_amount,
            invoiceData.final_amount,
            invoiceData.promotion_code || null,
            invoiceData.created_by,
            invoiceData.created_at || new Date()
        ]
    );
    const invoiceId = invoiceResult.insertId;

    if (Array.isArray(invoiceData.bookDetails)) {
        for (const detail of invoiceData.bookDetails) {
            await db.query(
                `INSERT INTO invoice_details (invoice_id, book_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)`,
                [invoiceId, detail.book_id, detail.quantity, detail.unit_price]
            );
            // Trừ tồn kho sách
            await db.query(
                "UPDATE books SET quantity_in_stock = quantity_in_stock - ? WHERE id = ?",
                [detail.quantity, detail.book_id]
            );
        }
    }

    if (invoiceData.promotion_code) {
        await db.query(
            "UPDATE promotions SET used_quantity = used_quantity + 1 WHERE promotion_code = ?",
            [invoiceData.promotion_code]
        );
    }

    return { id: invoiceId, ...invoiceData };
};


const getInvoiceById = async (invoiceId) => {
    const [invoices] = await db.query(`
        SELECT i.*, u.full_name AS created_by_name, p.name AS promotion_name
        FROM invoices i
        LEFT JOIN users u ON i.created_by = u.id
        LEFT JOIN promotions p ON i.promotion_code = p.promotion_code
        WHERE i.id = ?
    `, [invoiceId]);
    if (invoices.length === 0) return null;
    const invoice = invoices[0];
    const [details] = await db.query(`
        SELECT d.*, b.title AS book_title
        FROM invoice_details d
        LEFT JOIN books b ON d.book_id = b.id
        WHERE d.invoice_id = ?
    `, [invoiceId]);
    invoice.bookDetails = details;
    return invoice;
};

const deleteInvoice = async (invoiceId) => {
    // Lấy ngày tạo hóa đơn và chi tiết sách
    const [invoices] = await db.query(`SELECT created_at FROM invoices WHERE id = ?`, [invoiceId]);
    if (invoices.length === 0) return false;
    const createdAt = new Date(invoices[0].created_at);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) {
        const [details] = await db.query(`SELECT book_id, quantity FROM invoice_details WHERE invoice_id = ?`, [invoiceId]);
        for (const detail of details) {
            await db.query(`UPDATE books SET quantity_in_stock = quantity_in_stock + ? WHERE id = ?`, [detail.quantity, detail.book_id]);
        }
    }

    await db.query("DELETE FROM invoice_details WHERE invoice_id = ?", [invoiceId]);
    const [result] = await db.query("DELETE FROM invoices WHERE id = ?", [invoiceId]);
    return result.affectedRows > 0;
};

// Lấy tổng doanh thu và tổng số lượng sách bán theo tháng và năm
const getTotalRevenueByMonth = async (month, year) => {
    const [summary] = await db.query(`
        SELECT
            SUM(d.quantity * d.unit_price) AS totalRevenue,
            SUM(d.quantity) AS totalSold
        FROM invoices i
        JOIN invoice_details d ON i.id = d.invoice_id
        WHERE MONTH(i.created_at) = ? AND YEAR(i.created_at) = ?
    `, [month, year]);
    return {
        totalRevenue: summary[0]?.totalRevenue || 0,
        totalSold: summary[0]?.totalSold || 0
    };
}

// Lấy tổng doanh thu và tổng số lượng sách bán theo ngày trong tháng và năm
const getDailyRevenueByMonth = async (month, year) => {
    const [dailyData] = await db.query(`
        SELECT
            DAY(i.created_at) AS day,
            SUM(d.quantity * d.unit_price) AS totalRevenue,
            SUM(d.quantity) AS totalSold
        FROM invoices i
        JOIN invoice_details d ON i.id = d.invoice_id
        WHERE MONTH(i.created_at) = ? AND YEAR(i.created_at) = ?
        GROUP BY DAY(i.created_at)
        ORDER BY DAY(i.created_at)
    `, [month, year]);
    return dailyData;
}

const getTop10MostSoldBooks = async (month, year) => {
    const [rows] = await db.query(`
        SELECT b.id, b.title, SUM(d.quantity) AS total_sold
        FROM invoice_details d
        JOIN invoices i ON d.invoice_id = i.id
        JOIN books b ON d.book_id = b.id
        WHERE MONTH(i.created_at) = ? AND YEAR(i.created_at) = ?
        GROUP BY b.id, b.title
        ORDER BY total_sold DESC
        LIMIT 10
    `, [month, year]);
    return rows;
};
module.exports = {
    getAllInvoices,
    getInvoicesByUser,
    addInvoice,
    getInvoiceById,
    deleteInvoice,
    getTotalRevenueByMonth,
    getTop10MostSoldBooks,
    getDailyRevenueByMonth
};
