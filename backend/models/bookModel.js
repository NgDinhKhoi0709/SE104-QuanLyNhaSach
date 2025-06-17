const db = require("../db");

const getAllBooks = async () => {
    const [rows] = await db.query(`
    SELECT b.id, b.title, b.author, b.category_id, b.publisher_id,
    c.name AS category, p.name AS publisher,
    b.publication_year AS publicationYear, b.price, b.quantity_in_stock AS stock, b.description, b.created_at, b.updated_at
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN publishers p ON b.publisher_id = p.id
  `);
    return rows;
};

const getBookById = async (id) => {
    const [rows] = await db.query(`
    SELECT b.id, b.title, b.author, b.category_id, b.publisher_id,
    c.name AS category, p.name AS publisher,
    b.publication_year AS publicationYear, b.price, b.quantity_in_stock AS stock, b.description, b.created_at, b.updated_at
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN publishers p ON b.publisher_id = p.id
    WHERE b.id = ?
  `, [id]);
    return rows[0];
};

const createBook = async (book) => {
    const { title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description } = book;
    const [result] = await db.query(
        "INSERT INTO books (title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description]
    );
    return getBookById(result.insertId);
};

const updateBook = async (id, book) => {
    const { title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description } = book;
    const [result] = await db.query(
        "UPDATE books SET title = ?, author = ?, category_id = ?, publisher_id = ?, publication_year = ?, price = ?, quantity_in_stock = ?, description = ?, updated_at = NOW() WHERE id = ?",
        [title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Book not found");
    }
    return getBookById(id);
};

const deleteBook = async (id) => {
    const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
        throw new Error("Book not found");
    }
    return { message: "Book deleted successfully" };
};

const getOldStockBooks = async (months = 2) => {
    const [rows] = await db.query(`
    SELECT b.id, b.title, b.author, b.category_id, b.publisher_id,
        c.name AS category, p.name AS publisher,
        b.publication_year AS publicationYear, b.price, 
        b.quantity_in_stock AS stock, b.description, b.created_at, b.updated_at
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN publishers p ON b.publisher_id = p.id
    WHERE TIMESTAMPDIFF(MONTH, b.updated_at, NOW()) >= ?
    AND b.quantity_in_stock > 0
    ORDER BY b.updated_at ASC
    `, [months]);
    return rows;
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getOldStockBooks,
};