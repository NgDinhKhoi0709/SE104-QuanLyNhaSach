const promotionModel = require("../models/promotionModel");
const db = require("../db");

const getAllPromotions = async () => {
    return await promotionModel.getAllPromotions();
};

const getAvailablePromotions = async (total_price) => {
    const promotions = await promotionModel.getAvailablePromotions(total_price);
    return promotions;
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

module.exports = {
    getAllPromotions,
    getAvailablePromotions,
    addPromotion,
    updatePromotion,
    deletePromotion
};
