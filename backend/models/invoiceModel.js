const db = require("../db");

// Lấy tất cả hóa đơn (không join chi tiết)
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

module.exports = {
    getAllInvoices,
};
