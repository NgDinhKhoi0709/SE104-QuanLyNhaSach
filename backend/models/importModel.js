const db = require("../db");

const getAllImports = async () => {
    // Get all imports with supplier and user info
    const [imports] = await db.query(`
    SELECT bi.id, bi.import_date, bi.total_price, 
           s.name AS supplier, u.username AS employee, bi.supplier_id, bi.imported_by
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
            [supplierId, importedBy, total]
        );
        const importId = importResult.insertId;

        // Thêm từng chi tiết sách nhập
        for (const detail of bookDetails) {
            await conn.query(
                "INSERT INTO book_import_details (import_id, book_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [importId, detail.bookId, detail.quantity, detail.price]
            );
        }

        await conn.commit();
        return { id: importId };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

module.exports = {
    getAllImports,
    createImport,
};
