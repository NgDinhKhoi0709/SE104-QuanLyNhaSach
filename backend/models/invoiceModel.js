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

// Thêm hóa đơn mới
const addInvoice = async (invoiceData) => {
    // Kiểm tra tồn kho trước khi tạo hóa đơn
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

    // Thêm chi tiết hóa đơn (bookDetails)
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

    // Nếu có áp dụng mã khuyến mãi thì tăng used_quantity lên 1
    if (invoiceData.promotion_code) {
        await db.query(
            "UPDATE promotions SET used_quantity = used_quantity + 1 WHERE promotion_code = ?",
            [invoiceData.promotion_code]
        );
    }

    return { id: invoiceId, ...invoiceData };
};

// Lấy chi tiết hóa đơn theo id (bao gồm bookDetails)
const getInvoiceById = async (invoiceId) => {
    // Lấy thông tin hóa đơn
    const [invoices] = await db.query(`
        SELECT i.*, u.full_name AS created_by_name, p.name AS promotion_name
        FROM invoices i
        LEFT JOIN users u ON i.created_by = u.id
        LEFT JOIN promotions p ON i.promotion_code = p.promotion_code
        WHERE i.id = ?
    `, [invoiceId]);
    if (invoices.length === 0) return null;
    const invoice = invoices[0];

    // Lấy chi tiết sách
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
    // Xóa chi tiết hóa đơn trước
    await db.query("DELETE FROM invoice_details WHERE invoice_id = ?", [invoiceId]);
    // Xóa hóa đơn
    const [result] = await db.query("DELETE FROM invoices WHERE id = ?", [invoiceId]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllInvoices,
    addInvoice,
    getInvoiceById,
    deleteInvoice,
};
