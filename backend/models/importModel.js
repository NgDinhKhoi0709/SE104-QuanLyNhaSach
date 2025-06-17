const db = require("../db");

const getAllImports = async () => {
    // Get all imports with supplier and user info
    const [imports] = await db.query(`
    SELECT bi.id, bi.import_date, bi.total_price, 
           s.name AS supplier, u.full_name AS employee, bi.supplier_id, bi.imported_by
    FROM book_imports bi
    JOIN suppliers s ON bi.supplier_id = s.id
    JOIN users u ON bi.imported_by = u.id
    ORDER BY bi.import_date DESC
  `);

    // For each import, get its book details
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
    // Đảm bảo importedBy là số
    const importedById = Number(importedBy);
    if (!importedById) throw new Error('Người nhập không hợp lệ!');

    // Log to debug
    console.log("Import data received:", importData);
    console.log("importedBy value:", importedBy, "type:", typeof importedBy);

    // Check if the user exists
    try {
        const [userCheck] = await db.query("SELECT id FROM users WHERE id = ?", [importedBy]);
        console.log("User check result:", userCheck);
        if (userCheck.length === 0) {
            throw new Error(`User with ID ${importedBy} does not exist. Please ensure the user is registered in the system.`);
        }
    } catch (err) {
        console.error("Error checking user:", err);
        throw err;
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Thêm vào book_imports
        const [importResult] = await conn.query(
            "INSERT INTO book_imports (supplier_id, imported_by, total_price) VALUES (?, ?, ?)",
            [supplierId, importedById, total]
        );
        const importId = importResult.insertId;

        // Thêm từng chi tiết sách nhập
        for (const detail of bookDetails) {
            await conn.query(
                "INSERT INTO book_import_details (import_id, book_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [importId, detail.bookId, detail.quantity, detail.price]
            );
            // Cập nhật tồn kho sách
            await conn.query(
                "UPDATE books SET quantity_in_stock = quantity_in_stock + ? WHERE id = ?",
                [detail.quantity, detail.bookId]
            );
        }

        await conn.commit();
        return { id: importId };
    } catch (err) {
        console.error("[IMPORT MODEL] Lỗi khi thêm phiếu nhập:", err, err.stack);
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

const deleteImport = async (id) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        console.log("[IMPORT MODEL] Xóa phiếu nhập với id:", id);

        // Lấy chi tiết phiếu nhập để rollback tồn kho
        const [details] = await conn.query("SELECT book_id, quantity FROM book_import_details WHERE import_id = ?", [id]);
        console.log("[IMPORT MODEL] Chi tiết phiếu nhập:", details);

        // Trừ lại tồn kho cho từng sách
        for (const detail of details) {
            const [updateResult] = await conn.query(
                "UPDATE books SET quantity_in_stock = quantity_in_stock - ? WHERE id = ?",
                [detail.quantity, detail.book_id]
            );
            console.log(`[IMPORT MODEL] Đã trừ tồn kho sách id=${detail.book_id}, số lượng=${detail.quantity}, affectedRows=${updateResult.affectedRows}`);
        }

        // Xóa chi tiết phiếu nhập
        const [deleteDetailsResult] = await conn.query("DELETE FROM book_import_details WHERE import_id = ?", [id]);
        console.log("[IMPORT MODEL] Đã xóa chi tiết phiếu nhập, affectedRows:", deleteDetailsResult.affectedRows);

        // Xóa phiếu nhập
        const [result] = await conn.query("DELETE FROM book_imports WHERE id = ?", [id]);
        console.log("[IMPORT MODEL] Đã xóa phiếu nhập, affectedRows:", result.affectedRows);

        await conn.commit();
        if (result.affectedRows === 0) {
            throw new Error("Import not found");
        }
        return { message: "Import deleted successfully" };
    } catch (err) {
        await conn.rollback();
        console.error("[IMPORT MODEL] Lỗi khi xóa phiếu nhập:", err, err.stack);
        throw err;
    } finally {
        conn.release();
    }
};

const getImportStatsByYear = async (year) => {
    // Lấy thống kê nhập kho theo tháng trong năm
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

    // Nếu không có dữ liệu, trả về mảng rỗng
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
    // Lấy tất cả phiếu nhập trong năm chỉ định
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

    // Tương tự như getAllImports, lấy chi tiết cho mỗi phiếu nhập
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
