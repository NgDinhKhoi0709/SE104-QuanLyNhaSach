const db = require("../db");

// Lấy tất cả khuyến mãi
const getAllPromotions = async () => {
    const [rows] = await db.query("SELECT * FROM promotions");
    return rows;
};

// Thêm mới khuyến mãi
const addPromotion = async ({ promotionCode, name, discount, startDate, endDate, minPrice }) => {
    const [result] = await db.query(
        `INSERT INTO promotions (promotion_code, name, discount, start_date, end_date, min_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [promotionCode, name, discount, startDate, endDate, minPrice]
    );
    return result;
};

// Cập nhật khuyến mãi
const updatePromotion = async ({ id, promotionCode, name, discount, startDate, endDate, minPrice }) => {
    const [result] = await db.query(
        `UPDATE promotions SET promotion_code = ?, name = ?, discount = ?, start_date = ?, end_date = ?, min_price = ?
         WHERE id = ?`,
        [promotionCode, name, discount, startDate, endDate, minPrice, id]
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