const db = require("../db");

const getAllPublishers = async () => {
    const [rows] = await db.query(
        "SELECT id, name FROM publishers"
    );
    return rows;
};

const getPublisherById = async (id) => {
    const [rows] = await db.query(
        "SELECT id, name FROM publishers WHERE id = ?",
        [id]
    );
    return rows[0];
};

const createPublisher = async (publisher) => {
    const { name } = publisher;
    const [result] = await db.query(
        "INSERT INTO publishers (name, created_at, updated_at) VALUES (?, NOW(), NOW())",
        [name]
    );
    return getPublisherById(result.insertId);
};

const updatePublisher = async (id, publisher) => {
    const { name } = publisher;
    const [result] = await db.query(
        "UPDATE publishers SET name = ?, updated_at = NOW() WHERE id = ?",
        [name, id]
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

const searchPublishers = async (keyword) => {
    const like = `${keyword}%`;
    const [rows] = await db.query(
        `SELECT id, name
         FROM publishers
         WHERE name LIKE ?
         ORDER BY name ASC`,
        [like]
    );
    return rows;
};

module.exports = {
    getAllPublishers,
    getPublisherById,
    createPublisher,
    updatePublisher,
    deletePublisher,
    searchPublishers,
};
