const promotionModel = require("../models/promotionModel");
const db = require("../db");

function toDateString(date) {
    if (!date) return "";
    const d = new Date(date);
    // Cộng thêm 1 ngày để tránh bị lùi ngày do lệch múi giờ
    d.setUTCDate(d.getUTCDate() + 1);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

function getPromotionStatus(start, end) {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return "upcoming";
    if (now > endDate) return "expired";
    return "active";
}

// Lấy tất cả khuyến mãi
const getAllPromotions = async () => {
    const promotions = await promotionModel.getAllPromotions();
    
    // Map lại tên trường cho frontend
    return promotions.map(p => ({
        id: p.id,
        code: p.promotion_code,
        name: p.name,
        type: p.type,
        discount: p.discount,
        startDate: toDateString(p.start_date),
        endDate: toDateString(p.end_date),
        minPrice: p.min_price,
        quantity: p.quantity,
        usedQuantity: p.used_quantity,
        status: getPromotionStatus(p.start_date, p.end_date)
    }));
};

// Thêm khuyến mãi mới
const addPromotion = async (promotionData) => {
    const { name, type, discount, startDate, endDate, minPrice, quantity } = promotionData;
    
    if (!name || !type || !discount || !startDate || !endDate || !minPrice) {
        throw { status: 400, message: "Vui lòng cung cấp đầy đủ thông tin" };
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

    return {
        promotionId: result.insertId,
        promotionCode: result.promotionCode
    };
};

// Cập nhật khuyến mãi
const updatePromotion = async (id, promotionData) => {
    const { name, type, discount, startDate, endDate, minPrice, quantity, usedQuantity } = promotionData;
    
    if (!name || !type || !discount || !startDate || !endDate || !minPrice) {
        throw { status: 400, message: "Vui lòng cung cấp đầy đủ thông tin" };
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
        throw { status: 404, message: "Không tìm thấy khuyến mãi để cập nhật" };
    }

    return { message: "Cập nhật khuyến mãi thành công" };
};

// Xóa khuyến mãi
const deletePromotion = async (id) => {
    const result = await promotionModel.deletePromotion(id);
    
    if (result.affectedRows === 0) {
        throw { status: 404, message: "Không tìm thấy khuyến mãi để xóa" };
    }

    return { message: "Xóa khuyến mãi thành công" };
};

// Kiểm tra mã khuyến mãi
const checkPromotion = async (promotionCode, totalAmount) => {
    if (!promotionCode || !totalAmount) {
        throw { 
            status: 400, 
            success: false, 
            message: "Vui lòng cung cấp mã khuyến mãi và tổng tiền hóa đơn" 
        };
    }

    // Tìm khuyến mãi theo mã
    const [promotion] = await db.query(
        "SELECT * FROM promotions WHERE promotion_code = ?",
        [promotionCode]
    );

    // Kiểm tra khuyến mãi có tồn tại không
    if (promotion.length === 0) {
        throw { 
            status: 404, 
            success: false, 
            message: "Mã khuyến mãi không hợp lệ" 
        };
    }

    const promoInfo = promotion[0];
    const now = new Date();
    const startDate = new Date(promoInfo.start_date);
    const endDate = new Date(promoInfo.end_date);

    // Kiểm tra thời hạn
    if (now < startDate) {
        throw { 
            status: 400, 
            success: false, 
            message: "Mã khuyến mãi chưa có hiệu lực" 
        };
    }

    if (now > endDate) {
        throw { 
            status: 400, 
            success: false, 
            message: "Mã khuyến mãi đã hết hạn" 
        };
    }

    // Kiểm tra số lượng sử dụng
    if (promoInfo.quantity !== null && promoInfo.used_quantity >= promoInfo.quantity) {
        throw { 
            status: 400, 
            success: false, 
            message: "Mã khuyến mãi đã hết lượt sử dụng" 
        };
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (parseFloat(totalAmount) < parseFloat(promoInfo.min_price)) {
        throw { 
            status: 400, 
            success: false, 
            message: `Giá trị đơn hàng tối thiểu là ${parseInt(promoInfo.min_price).toLocaleString('vi-VN')} VNĐ` 
        };
    }

    // Tính toán số tiền giảm giá
    let discountAmount = 0;
    if (promoInfo.type === 'percent') {
        discountAmount = (parseFloat(totalAmount) * parseFloat(promoInfo.discount)) / 100;
    } else {
        discountAmount = parseFloat(promoInfo.discount);
    }

    // Trả về thông tin khuyến mãi và số tiền được giảm
    return {
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
    };
};

module.exports = {
    getAllPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    checkPromotion
};
