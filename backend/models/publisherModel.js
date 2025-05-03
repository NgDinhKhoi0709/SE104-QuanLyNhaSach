const db = require("../db");

const getAllPublishers = async () => {
    const [rows] = await db.query(
        "SELECT id, name, address, phone, email, created_at, updated_at FROM publishers"
    );
    return rows;
};

const getPublisherById = async (id) => {
    const [rows] = await db.query(
        "SELECT id, name, address, phone, email, created_at, updated_at FROM publishers WHERE id = ?",
        [id]
    );
    return rows[0];
};

const createPublisher = async (publisher) => {
    const { name, address, phone, email } = publisher;
    const [result] = await db.query(
        "INSERT INTO publishers (name, address, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [name, address, phone, email]
    );
    return getPublisherById(result.insertId);
};

const updatePublisher = async (id, publisher) => {
    const { name, address, phone, email } = publisher;
    const [result] = await db.query(
        "UPDATE publishers SET name = ?, address = ?, phone = ?, email = ?, updated_at = NOW() WHERE id = ?",
        [name, address, phone, email, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Publisher not found");
    }
    return getPublisherById(id);
};

const deletePublisher = async (id) => {
    const [result] = await db.query("DELETE FROM publishers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
        throw new Error("Publisher not found");
    }
    return { message: "Publisher deleted successfully" };
};

module.exports = {
    getAllPublishers,
    getPublisherById,
    createPublisher,
    updatePublisher,
    deletePublisher,
};
