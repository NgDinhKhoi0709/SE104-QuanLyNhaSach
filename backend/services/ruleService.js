const ruleModel = require("../models/ruleModel");

/**
 * Lấy các quy định hiện tại
 * @returns {Promise<Object>} Thông tin quy định
 */
const getRules = async () => {
    const rules = await ruleModel.getRules();
    if (!rules) {
        throw { status: 404, message: "Không tìm thấy quy định" };
    }
    return rules;
};

/**
 * Cập nhật các quy định
 * @param {Object} ruleData Dữ liệu quy định mới
 * @returns {Promise<Object>} Kết quả cập nhật
 */
const updateRules = async (ruleData) => {
    const { min_import_quantity, min_stock_before_import, min_stock_after_sale, max_promotion_duration } = ruleData;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (
        min_import_quantity < 0 ||
        min_stock_before_import < 0 ||
        min_stock_after_sale < 0 ||
        max_promotion_duration < 1
    ) {
        throw { status: 400, message: "Dữ liệu không hợp lệ" };
    }

    const result = await ruleModel.updateRules({
        min_import_quantity,
        min_stock_before_import,
        min_stock_after_sale,
        max_promotion_duration,
    });

    if (result.affectedRows === 0) {
        throw { status: 404, message: "Không tìm thấy quy định để cập nhật" };
    }

    return { message: "Cập nhật quy định thành công" };
};

module.exports = {
    getRules,
    updateRules,
};
