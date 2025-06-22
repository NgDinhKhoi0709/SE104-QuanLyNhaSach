const promotionModel = require("../models/promotionModel");
const db = require("../db");

const getAllPromotions = async () => {
    return await promotionModel.getAllPromotions();
};

const addPromotion = async (promotionData) => {
    const { name, type, discount, startDate, endDate, minPrice, quantity } = promotionData;
    
    if (!name || !type || !discount || !startDate || !endDate || !minPrice) {
        throw { status: 400, message: "Vui lòng cung cấp đầy đủ thông tin" };
    }

    return await promotionModel.addPromotion({
        name,
        type,
        discount,
        startDate,
        endDate,
        minPrice,
        quantity,
    });
};

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

const checkPromotion = async (promotionCode, totalAmount) => {
    if (!promotionCode || !totalAmount) {
        throw { 
            status: 400, 
            success: false, 
            message: "Vui lòng cung cấp mã khuyến mãi và tổng tiền hóa đơn" 
        };
    }

    const [promotion] = await db.query(
        "SELECT * FROM promotions WHERE promotion_code = ?",
        [promotionCode]
    );

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

    if (parseFloat(totalAmount) < parseFloat(promoInfo.min_price)) {
        throw { 
            status: 400, 
            success: false, 
            message: `Giá trị đơn hàng tối thiểu là ${parseInt(promoInfo.min_price).toLocaleString('vi-VN')} VNĐ` 
        };
    }
    let discountAmount = 0;
    if (promoInfo.type === 'percent') {
        discountAmount = parseFloat(totalAmount) * parseFloat(promoInfo.discount) / 100;
    } else {
        discountAmount = parseFloat(promoInfo.discount);
    }

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
