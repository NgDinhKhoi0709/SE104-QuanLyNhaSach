const ruleService = require("../services/ruleService");

/**
 * Lấy thông tin quy định
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRules = async (req, res) => {
    try {
        const rules = await ruleService.getRules();
        res.status(200).json(rules);
    } catch (error) {
        console.error("Lỗi khi lấy quy định:", error);
        const statusCode = error.status || 500;
        const message = error.message || "Lỗi khi lấy quy định";
        res.status(statusCode).json({ message });
    }
};

/**
 * Cập nhật quy định
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateRules = async (req, res) => {
    try {
        console.log("Dữ liệu nhận được từ frontend:", req.body);
        const result = await ruleService.updateRules(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi cập nhật quy định:", error);
        const statusCode = error.status || 500;
        const message = error.message || "Lỗi khi cập nhật quy định";
        res.status(statusCode).json({ message });
    }
};

module.exports = {
    getRules,
    updateRules,
};