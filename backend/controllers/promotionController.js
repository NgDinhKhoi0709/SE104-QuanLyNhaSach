const promotionService = require("../services/promotionService");

// Lấy danh sách khuyến mãi
const getPromotions = async (req, res) => {
    try {
        const promotions = await promotionService.getAllPromotions();
        res.status(200).json(promotions);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách khuyến mãi" });
    }
};

// Thêm mới khuyến mãi
const addPromotion = async (req, res) => {
    try {
        const result = await promotionService.addPromotion(req.body);
        res.status(201).json({ 
            message: "Thêm mới khuyến mãi thành công", 
            promotionId: result.promotionId,
            promotionCode: result.promotionCode
        });
    } catch (error) {
        console.error("Lỗi khi thêm mới khuyến mãi:", error);
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: "Đã xảy ra lỗi khi thêm mới khuyến mãi" });
    }
};

// Cập nhật khuyến mãi
const updatePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await promotionService.updatePromotion(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi cập nhật khuyến mãi:", error);
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật khuyến mãi" });
    }
};

// Xóa khuyến mãi
const deletePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await promotionService.deletePromotion(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: "Đã xảy ra lỗi khi xóa khuyến mãi" });
    }
};

// Kiểm tra mã khuyến mãi
const checkPromotion = async (req, res) => {
    try {
        const { promotionCode, totalAmount } = req.body;
        const result = await promotionService.checkPromotion(promotionCode, totalAmount);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi kiểm tra mã khuyến mãi:", error);
        if (error.status) {
            return res.status(error.status).json({ 
                success: false, 
                message: error.message 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi khi kiểm tra mã khuyến mãi" 
        });
    }
};

module.exports = {
    getPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    checkPromotion
};