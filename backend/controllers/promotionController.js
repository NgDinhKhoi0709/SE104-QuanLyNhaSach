const promotionModel = require("../models/promotionModel");

// Lấy danh sách khuyến mãi
const getPromotions = async (req, res) => {
    try {
        const promotions = await promotionModel.getAllPromotions();
        res.status(200).json(promotions);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách khuyến mãi" });
    }
};

module.exports = {
    getPromotions,
};