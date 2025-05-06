const db = require("../db");

const getRules = async () => {
    const [rules] = await db.query("SELECT * FROM rules LIMIT 1");
    return rules[0]; // Giả sử chỉ có 1 bản ghi
};

const updateRules = async (ruleData) => {
    const { min_import_quantity, min_stock_before_import, min_stock_after_sale, max_promotion_duration } = ruleData;

    console.log("Truy vấn SQL đang thực thi:", {
        min_import_quantity,
        min_stock_before_import,
        min_stock_after_sale,
        max_promotion_duration
    }); // Log dữ liệu trước khi thực thi truy vấn

    const [result] = await db.query(
        `UPDATE rules 
         SET min_import_quantity = ?, 
             min_stock_before_import = ?, 
             min_stock_after_sale = ?, 
             max_promotion_duration = ? 
         WHERE id = 1`,
        [min_import_quantity, min_stock_before_import, min_stock_after_sale, max_promotion_duration]
    );

    console.log("Kết quả truy vấn SQL:", result); // Log kết quả truy vấn

    return result;
};

module.exports = {
    getRules,
    updateRules,
};