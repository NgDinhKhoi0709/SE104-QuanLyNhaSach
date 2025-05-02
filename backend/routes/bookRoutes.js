const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure your DB connection is correctly configured

// GET books
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.id, b.title, b.author, b.category_id, b.publisher_id,
            c.name AS category, p.name AS publisher,
            b.publication_year AS publicationYear, b.price, b.quantity_in_stock AS stock, b.description, b.created_at, b.updated_at
            FROM books b
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN publishers p ON b.publisher_id = p.id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// POST new book
router.post("/", async (req, res) => {
    try {
        const { title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description } = req.body;
        const [result] = await db.query(
            "INSERT INTO books (title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description]
        );
        const [rows] = await db.query(
            "SELECT id, title, author, category_id, publisher_id, publication_year, price, quantity_in_stock AS stock, description, created_at, updated_at FROM books WHERE id = ?",
            [result.insertId]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ error: "Failed to add book" });
    }
});

// PUT update book
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description } = req.body;
        const [result] = await db.query(
            "UPDATE books SET title = ?, author = ?, category_id = ?, publisher_id = ?, publication_year = ?, price = ?, quantity_in_stock = ?, description = ?, updated_at = NOW() WHERE id = ?",
            [title, author, category_id, publisher_id, publication_year, price, quantity_in_stock, description, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        const [rows] = await db.query(
            "SELECT id, title, author, category_id, publisher_id, publication_year, price, quantity_in_stock AS stock, description, created_at, updated_at FROM books WHERE id = ?",
            [id]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: "Failed to update book" });
    }
});

// DELETE book (if needed)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
});

module.exports = router;
