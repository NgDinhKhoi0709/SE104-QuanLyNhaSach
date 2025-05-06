const db = require("../db");

// Lấy tất cả khuyến mãi
const getAllPromotions = async () => {
    const [rows] = await db.query("SELECT * FROM promotions");
    return rows;
};

module.exports = {
    getAllPromotions,
};