const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure your DB connection is correctly configured

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, address, phone, email, created_at, updated_at FROM publishers"
        );
        console.log("Publishers fetched:", rows);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching publishers:", error);
        res.status(500).json({ error: "Failed to fetch publishers" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;
        const [result] = await db.query(
            "INSERT INTO publishers (name, address, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
            [name, address, phone, email]
        );
        const [rows] = await db.query(
            "SELECT id, name, address, phone, email, created_at, updated_at FROM publishers WHERE id = ?",
            [result.insertId]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error adding publisher:", error);
        res.status(500).json({ error: "Failed to add publisher" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, email } = req.body;
        const [result] = await db.query(
            "UPDATE publishers SET name = ?, address = ?, phone = ?, email = ?, updated_at = NOW() WHERE id = ?",
            [name, address, phone, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Publisher not found" });
        }
        const [rows] = await db.query(
            "SELECT id, name, address, phone, email, created_at, updated_at FROM publishers WHERE id = ?",
            [id]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating publisher:", error);
        res.status(500).json({ error: "Failed to update publisher" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM publishers WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Publisher not found" });
        }
        res.json({ message: "Publisher deleted successfully" });
    } catch (error) {
        console.error("Error deleting publisher:", error);
        res.status(500).json({ error: "Failed to delete publisher" });
    }
});

module.exports = router;
