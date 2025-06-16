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
    
    // Format with leading zeros (KM01, KM02, etc.)
    return `KM${String(nextNumber).padStart(2, '0')}`;
};

// Lấy tất cả khuyến mãi
const getAllPromotions = async () => {
    const [rows] = await db.query("SELECT * FROM promotions");
    return rows;
};

// Thêm mới khuyến mãi
const addPromotion = async ({ name, type, discount, startDate, endDate, minPrice, quantity }) => {
    console.log("[addPromotion] quantity:", quantity);
    const safeQuantity = quantity === undefined || quantity === "" ? null : quantity;
    console.log("[addPromotion] safeQuantity:", safeQuantity);
    
    // Generate promotion code
    const promotionCode = await generatePromotionCode();
    
    const [result] = await db.query(
        `INSERT INTO promotions (promotion_code, name, type, discount, start_date, end_date, min_price, quantity, used_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)` ,
        [promotionCode, name, type, discount, startDate, endDate, minPrice, safeQuantity]
    );
    
    return { ...result, promotionCode };
};

// Cập nhật khuyến mãi
const updatePromotion = async ({ id, name, type, discount, startDate, endDate, minPrice, quantity, usedQuantity }) => {
    console.log("[updatePromotion] quantity:", quantity);
    const safeQuantity = quantity === undefined || quantity === "" ? null : quantity;
    console.log("[updatePromotion] safeQuantity:", safeQuantity);
    
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
    addPromotion,
    updatePromotion,
    deletePromotion,
};