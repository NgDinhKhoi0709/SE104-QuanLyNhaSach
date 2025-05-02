const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure your DB connection is correctly configured

// GET suppliers
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, address, phone, email, created_at, updated_at FROM suppliers"
        );
        res.json(rows);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
});

// POST new supplier
router.post("/", async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;
        const [result] = await db.query(
            "INSERT INTO suppliers (name, address, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
            [name, address, phone, email]
        );
        const [rows] = await db.query(
            "SELECT id, name, address, phone, email, created_at, updated_at FROM suppliers WHERE id = ?",
            [result.insertId]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error adding supplier:", error);
        res.status(500).json({ error: "Failed to add supplier" });
    }
});

// PUT update supplier
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, email } = req.body;
        const [result] = await db.query(
            "UPDATE suppliers SET name = ?, address = ?, phone = ?, email = ?, updated_at = NOW() WHERE id = ?",
            [name, address, phone, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        const [rows] = await db.query(
            "SELECT id, name, address, phone, email, created_at, updated_at FROM suppliers WHERE id = ?",
            [id]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ error: "Failed to update supplier" });
    }
});

// DELETE supplier
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM suppliers WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        res.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ error: "Failed to delete supplier" });
    }
});

module.exports = router;
