const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

module.exports = {
    getAllCategories,
};
