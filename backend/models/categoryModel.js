const db = require("../db");

const getAllCategories = async () => {
    const [rows] = await db.query("SELECT id, name, description, created_at, updated_at FROM categories");
    return rows;
};

const getCategoryById = async (id) => {
    const [rows] = await db.query("SELECT id, name, description, created_at, updated_at FROM categories WHERE id = ?", [id]);
    return rows[0];
};

const createCategory = async (category) => {
    const { name, description } = category;
    const [result] = await db.query(
        "INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
        [name, description]
    );
    return getCategoryById(result.insertId);
};

const updateCategory = async (id, category) => {
    const { name, description } = category;
    const [result] = await db.query(
        "UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?",
        [name, description, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Category not found");
    }
    return getCategoryById(id);
};

const deleteCategory = async (id) => {
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
        throw new Error("Category not found");
    }
    return { message: "Category deleted successfully" };
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
