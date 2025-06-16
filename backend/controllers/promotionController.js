const promotionModel = require("../models/promotionModel");
const db = require("../db"); // Thêm dòng này

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
            type: p.type,
            discount: p.discount,
            startDate: toDateString(p.start_date),
            endDate: toDateString(p.end_date),
            minPrice: p.min_price,
            quantity: p.quantity, // sửa lại đúng trường
            usedQuantity: p.used_quantity,
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
        const { name, type, discount, startDate, endDate, minPrice, quantity } = req.body;
        if (!name || !type || !discount || !startDate || !endDate || !minPrice) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin" });
        }

        const result = await promotionModel.addPromotion({
            name,
            type,
            discount,
            startDate,
            endDate,
            minPrice,
            quantity,
        });

        res.status(201).json({ 
            message: "Thêm mới khuyến mãi thành công", 
            promotionId: result.insertId,
            promotionCode: result.promotionCode
        });
    } catch (error) {
        console.error("Lỗi khi thêm mới khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi thêm mới khuyến mãi" });
    }
};

// Cập nhật khuyến mãi
const updatePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("[updatePromotion] req.body:", req.body);
        const { name, type, discount, startDate, endDate, minPrice, quantity, usedQuantity } = req.body;
        console.log("[updatePromotion] extracted quantity:", quantity);
        if (!name || !type || !discount || !startDate || !endDate || !minPrice) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin" });
        }
        const result = await promotionModel.updatePromotion({
            id,
            name,
            type,
            discount,
            startDate,
            endDate,
            minPrice,
            quantity,
            usedQuantity: usedQuantity || 0,
        });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy khuyến mãi để cập nhật" });
        }
        res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật khuyến mãi:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật khuyến mãi" });
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

// Kiểm tra mã khuyến mãi
const checkPromotion = async (req, res) => {
    try {
        const { promotionCode, totalAmount } = req.body;
        
        if (!promotionCode || !totalAmount) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng cung cấp mã khuyến mãi và tổng tiền hóa đơn" 
            });
        }

        // Tìm khuyến mãi theo mã
        const [promotion] = await db.query(
            "SELECT * FROM promotions WHERE promotion_code = ?",
            [promotionCode]
        );

        // Kiểm tra khuyến mãi có tồn tại không
        if (promotion.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Mã khuyến mãi không hợp lệ" 
            });
        }

        const promoInfo = promotion[0];
        const now = new Date();
        const startDate = new Date(promoInfo.start_date);
        const endDate = new Date(promoInfo.end_date);

        // Kiểm tra thời hạn
        if (now < startDate) {
            return res.status(400).json({ 
                success: false, 
                message: "Mã khuyến mãi chưa có hiệu lực" 
            });
        }

        if (now > endDate) {
            return res.status(400).json({ 
                success: false, 
                message: "Mã khuyến mãi đã hết hạn" 
            });
        }

        // Kiểm tra số lượng sử dụng
        if (promoInfo.quantity !== null && promoInfo.used_quantity >= promoInfo.quantity) {
            return res.status(400).json({ 
                success: false, 
                message: "Mã khuyến mãi đã hết lượt sử dụng" 
            });
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (parseFloat(totalAmount) < parseFloat(promoInfo.min_price)) {
            return res.status(400).json({ 
                success: false, 
                message: `Giá trị đơn hàng tối thiểu là ${parseInt(promoInfo.min_price).toLocaleString('vi-VN')} VNĐ` 
            });
        }

        // Tính toán số tiền giảm giá
        let discountAmount = 0;
        if (promoInfo.type === 'percent') {
            discountAmount = (parseFloat(totalAmount) * parseFloat(promoInfo.discount)) / 100;
        } else {
            discountAmount = parseFloat(promoInfo.discount);
        }

        // Thành công, trả về thông tin khuyến mãi và số tiền được giảm
        res.status(200).json({
            success: true,
            message: "Áp dụng mã khuyến mãi thành công",
            data: {
                promotion_id: promoInfo.id,
                promotion_code: promoInfo.promotion_code,
                name: promoInfo.name,
                type: promoInfo.type,
                discount: promoInfo.discount,
                discountAmount: discountAmount,
                finalAmount: parseFloat(totalAmount) - discountAmount
            }
        });
    } catch (error) {
        console.error("Lỗi khi kiểm tra mã khuyến mãi:", error);
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
    checkPromotion // Thêm hàm mới này
};