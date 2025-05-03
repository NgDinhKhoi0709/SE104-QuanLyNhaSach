const categoryModel = require("../models/categoryModel");

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await categoryModel.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.updateCategory(id, req.body);
        res.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: error.message || "Failed to update category" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoryModel.deleteCategory(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: error.message || "Failed to delete category" });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
