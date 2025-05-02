const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure your db connection is correctly configured

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, name, description FROM categories");
        console.log("Categories fetched:", rows);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// POST route for adding a new category
router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;
        // Insert new category with current timestamps
        const [result] = await db.query(
            "INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
            [name, description]
        );
        // Retrieve the newly created category
        const [rows] = await db.query(
            "SELECT id, name, description FROM categories WHERE id = ?",
            [result.insertId]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category" });
    }
});

// DELETE route for deleting a category by id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
});

// PUT route for updating a category by id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const [result] = await db.query(
            "UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?",
            [name, description, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        const [rows] = await db.query(
            "SELECT id, name, description FROM categories WHERE id = ?",
            [id]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
});

module.exports = router;
