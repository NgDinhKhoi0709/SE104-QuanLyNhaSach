const promotionModel = require("../models/promotionModel");

function toDateString(date) {
    if (!date) return "";
    const d = new Date(date);
    // Cộng thêm 1 ngày để tránh bị lùi ngày do lệch múi giờ
    d.setUTCDate(d.getUTCDate() + 1);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

// Lấy danh sách khuyến mãi
const getPromotions = async (req, res) => {
    try {
        const promotions = await promotionModel.getAllPromotions();
        // Map lại tên trường cho frontend
        const mappedPromotions = promotions.map(p => ({
            id: p.id,
            code: p.promotion_code,
            name: p.name,
            discount: p.discount,
            startDate: toDateString(p.start_date),
            endDate: toDateString(p.end_date),
            minPrice: p.min_price,
            status: getPromotionStatus(p.start_date, p.end_date)
        }));
        res.status(200).json(mappedPromotions);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách khuyến mãi" });
    }
};

function getPromotionStatus(start, end) {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return "upcoming";
    if (now > endDate) return "expired";
    return "active";
}

// Thêm mới khuyến mãi
const addPromotion = async (req, res) => {
    try {
        const { promotionCode, name, discount, startDate, endDate, minPrice } = req.body;
        if (!promotionCode || !name || !discount || !startDate || !endDate || !minPrice) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin" });
        }

        const result = await promotionModel.addPromotion({
            promotionCode,
            name,
            discount,
            startDate,
            endDate,
            minPrice,
        });

        res.status(201).json({ message: "Thêm mới khuyến mãi thành công", promotionId: result.insertId });
    } catch (error) {
        console.error("Lỗi khi thêm mới khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi thêm mới khuyến mãi" });
    }
};

// Cập nhật khuyến mãi
const updatePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const { promotionCode, name, discount, startDate, endDate, minPrice } = req.body;
        if (!promotionCode || !name || !discount || !startDate || !endDate || !minPrice) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin" });
        }
        const result = await promotionModel.updatePromotion({
            id,
            promotionCode,
            name,
            discount,
            startDate,
            endDate,
            minPrice,
        });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy khuyến mãi để cập nhật" });
        }
        res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật khuyến mãi:", error);
    }
};

// Xóa khuyến mãi
const deletePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await promotionModel.deletePromotion(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy khuyến mãi để xóa" });
        }
        res.status(200).json({ message: "Xóa khuyến mãi thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi xóa khuyến mãi" });
    }
};

module.exports = {
    getPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
};