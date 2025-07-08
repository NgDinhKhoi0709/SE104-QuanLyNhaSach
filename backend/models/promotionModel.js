const db = require("../db");

// Generate a new promotion code in format KM01, KM02, etc.
const generatePromotionCode = async () => {
    const [result] = await db.query(
        "SELECT promotion_code FROM promotions WHERE promotion_code LIKE 'KM%' ORDER BY promotion_code DESC LIMIT 1"
    );
    
    let nextNumber = 1;
    if (result.length > 0) {
        const lastCode = result[0].promotion_code;
        const numericPart = lastCode.substring(2); // Extract digits after "KM"
        nextNumber = parseInt(numericPart, 10) + 1;
    }
    
    return `KM${String(nextNumber).padStart(2, '0')}`;
};


const getAllPromotions = async () => {
    const [rows] = await db.query("SELECT * FROM promotions");
    return rows;
};

const getAvailablePromotions = async (total_price) => {
    const [rows] = await db.query(
        `SELECT * FROM promotions 
         WHERE start_date <= NOW() 
         AND end_date >= NOW() 
         AND used_quantity < quantity
         AND min_price <= ?`,
        [total_price]
    );
    return rows;
}
// Thêm mới khuyến mãi
const addPromotion = async ({ name, type, discount, startDate, endDate, minPrice, quantity }) => {
    const safeQuantity = quantity === undefined || quantity === "" ? null : quantity;
    
    // Generate promotion code
    const promotionCode = await generatePromotionCode();
    
    const [result] = await db.query(
        `INSERT INTO promotions (promotion_code, name, type, discount, start_date, end_date, min_price, quantity, used_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)` ,
        [promotionCode, name, type, discount, startDate, endDate, minPrice, safeQuantity]
    );
    
    return { 
        insertId: result.insertId, 
        promotionCode 
    };
};

// Cập nhật khuyến mãi
const updatePromotion = async ({ id, name, type, discount, startDate, endDate, minPrice, quantity, usedQuantity }) => {
    const safeQuantity = quantity === undefined || quantity === "" ? null : quantity;
    
    // Get the existing promotion code
    const [promotionResult] = await db.query(
        "SELECT promotion_code FROM promotions WHERE id = ?",
        [id]
    );
    
    const promotionCode = promotionResult.length > 0 ? promotionResult[0].promotion_code : null;
    
    const [result] = await db.query(
        `UPDATE promotions SET name = ?, type = ?, discount = ?, start_date = ?, end_date = ?, min_price = ?, quantity = ?, used_quantity = ?
         WHERE id = ?`,
        [name, type, discount, startDate, endDate, minPrice, safeQuantity, usedQuantity, id]
    );
    
    return result;
};

// Xóa khuyến mãi
const deletePromotion = async (id) => {
    // First get the promotion code that needs to be deleted
    const [promotionResult] = await db.query(
        "SELECT promotion_code FROM promotions WHERE id = ?",
        [id]
    );
    
    if (promotionResult.length === 0) {
        return { affectedRows: 0 }; // Promotion not found
    }
    
    const promotionCode = promotionResult[0].promotion_code;
    
    // Update all invoices that use this promotion code to have NULL
    await db.query(
        "UPDATE invoices SET promotion_code = NULL WHERE promotion_code = ?",
        [promotionCode]
    );
    
    // Now delete the promotion
    const [result] = await db.query(
        "DELETE FROM promotions WHERE id = ?",
        [id]
    );
    
    return result;
};

module.exports = {
    getAllPromotions,
    getAvailablePromotions,
    generatePromotionCode,
    addPromotion,
    updatePromotion,
    deletePromotion,
};