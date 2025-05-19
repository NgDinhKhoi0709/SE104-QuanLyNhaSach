const db = require("../db");

// Lấy tất cả khuyến mãi
const getAllPromotions = async () => {
    const [rows] = await db.query("SELECT * FROM promotions");
    return rows;
};

// Thêm mới khuyến mãi
const addPromotion = async ({ promotionCode, name, type, discount, startDate, endDate, minPrice, quantity }) => {
    console.log("[addPromotion] quantity:", quantity);
    const safeQuantity = quantity === undefined || quantity === "" ? null : quantity;
    console.log("[addPromotion] safeQuantity:", safeQuantity);
    const [result] = await db.query(
        `INSERT INTO promotions (promotion_code, name, type, discount, start_date, end_date, min_price, quantity, used_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)` ,
        [promotionCode, name, type, discount, startDate, endDate, minPrice, safeQuantity]
    );
    return result;
};

// Cập nhật khuyến mãi
const updatePromotion = async ({ id, promotionCode, name, type, discount, startDate, endDate, minPrice, quantity, usedQuantity }) => {
    console.log("[updatePromotion] quantity:", quantity);
    const safeQuantity = quantity === undefined || quantity === "" ? null : quantity;
    console.log("[updatePromotion] safeQuantity:", safeQuantity);
    const [result] = await db.query(
        `UPDATE promotions SET promotion_code = ?, name = ?, type = ?, discount = ?, start_date = ?, end_date = ?, min_price = ?, quantity = ?, used_quantity = ?
         WHERE id = ?`,
        [promotionCode, name, type, discount, startDate, endDate, minPrice, safeQuantity, usedQuantity, id]
    );
    return result;
};

// Xóa khuyến mãi
const deletePromotion = async (id) => {
    const [result] = await db.query(
        "DELETE FROM promotions WHERE id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getAllPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
};