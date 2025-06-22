const db = require("../db");

const getAllImports = async () => {
    const [imports] = await db.query(`
    SELECT bi.id, bi.import_date, bi.total_price, 
           s.name AS supplier, u.full_name AS employee, bi.supplier_id, bi.imported_by
    FROM book_imports bi
    JOIN suppliers s ON bi.supplier_id = s.id
    JOIN users u ON bi.imported_by = u.id
    ORDER BY bi.import_date DESC
  `);

    for (const imp of imports) {
        const [details] = await db.query(`
      SELECT bid.id, bid.book_id, b.title AS book, bid.quantity, bid.unit_price AS price
      FROM book_import_details bid
      JOIN books b ON bid.book_id = b.id
      WHERE bid.import_id = ?
    `, [imp.id]);
        imp.bookDetails = details;
    }

    return imports;
};

const createImport = async (importData) => {
    const { supplierId, importedBy, bookDetails, total } = importData;
    const importedById = Number(importedBy);
    if (!importedById) throw new Error('Người nhập không hợp lệ!');
    
    try {
        const [importResult] = await db.query(
            "INSERT INTO book_imports (supplier_id, imported_by, total_price) VALUES (?, ?, ?)",
            [supplierId, importedById, total]
        );
        const importId = importResult.insertId;
        for (const detail of bookDetails) {
            await db.query(
                "INSERT INTO book_import_details (import_id, book_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [importId, detail.bookId, detail.quantity, detail.price]
            );

            await db.query(
                "UPDATE books SET quantity_in_stock = quantity_in_stock + ? WHERE id = ?",
                [detail.quantity, detail.bookId]
            );
        }

        return { id: importId };
    } catch (err) {
        console.error("[IMPORT MODEL] Lỗi khi thêm phiếu nhập:", err, err.stack);
        throw err;
    }
};

const deleteImport = async (id) => {
    try {
        const [details] = await db.query("SELECT book_id, quantity FROM book_import_details WHERE import_id = ?", [id]);
        for (const detail of details) {
            await db.query(
                "UPDATE books SET quantity_in_stock = quantity_in_stock - ? WHERE id = ?",
                [detail.quantity, detail.book_id]
            );
        }

        await db.query("DELETE FROM book_import_details WHERE import_id = ?", [id]);
        const [result] = await db.query("DELETE FROM book_imports WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            throw new Error("Phiếu nhập không tồn tại");
        }
        return { message: "Xóa phiếu nhập thành công" };
    } catch (err) {
        throw err;
    }
};

const getImportStatsByYear = async (year) => {
    const [monthlyStats] = await db.query(`
        SELECT 
            MONTH(bi.import_date) as month,
            COUNT(DISTINCT bi.id) as import_count,
            SUM(bid.quantity) as total_books,
            SUM(bid.quantity * bid.unit_price) as total_cost
        FROM 
            book_imports bi
            JOIN book_import_details bid ON bi.id = bid.import_id
        WHERE 
            YEAR(bi.import_date) = ?
        GROUP BY 
            MONTH(bi.import_date)
        ORDER BY 
            month
    `, [year]);

    if (monthlyStats.length === 0) {
        return [];
    }

    // Chuyển đổi dữ liệu để phù hợp với format yêu cầu
    return monthlyStats.map(stat => ({
        month: stat.month,
        importCount: stat.import_count,
        totalBooks: stat.total_books,
        totalCost: parseFloat(stat.total_cost)
    }));
};

const getImportsByYear = async (year) => {
    const [imports] = await db.query(`
        SELECT 
            bi.id, bi.import_date, bi.total_price,
            s.name AS supplier, u.full_name AS employee, 
            bi.supplier_id, bi.imported_by
        FROM 
            book_imports bi
            JOIN suppliers s ON bi.supplier_id = s.id
            JOIN users u ON bi.imported_by = u.id
        WHERE 
            YEAR(bi.import_date) = ?
        ORDER BY 
            bi.import_date DESC
    `, [year]);

    for (const imp of imports) {
        const [details] = await db.query(`
            SELECT 
                bid.id, bid.book_id, b.title AS book, 
                bid.quantity, bid.unit_price AS price
            FROM 
                book_import_details bid
                JOIN books b ON bid.book_id = b.id
            WHERE 
                bid.import_id = ?
        `, [imp.id]);
        imp.bookDetails = details;
    }

    return imports;
};

module.exports = {
    getAllImports,
    createImport,
    deleteImport,
    getImportStatsByYear,
    getImportsByYear
};
