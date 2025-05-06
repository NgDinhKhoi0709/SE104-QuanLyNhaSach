const ruleModel = require("../models/ruleModel");

const getRules = async (req, res) => {
    try {
        const rules = await ruleModel.getRules();
        if (!rules) {
            return res.status(404).json({ message: "Không tìm thấy quy định" });
        }
        res.status(200).json(rules);
    } catch (error) {
        console.error("Lỗi khi lấy quy định:", error);
        res.status(500).json({ message: "Lỗi khi lấy quy định", error });
    }
};

const updateRules = async (req, res) => {
    try {
        console.log("Dữ liệu nhận được từ frontend:", req.body); // Log dữ liệu nhận được
        const { min_import_quantity, min_stock_before_import, min_stock_after_sale, max_promotion_duration } = req.body;

        if (
            min_import_quantity < 0 ||
            min_stock_before_import < 0 ||
            min_stock_after_sale < 0 ||
            max_promotion_duration < 1
        ) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }

        const result = await ruleModel.updateRules({
            min_import_quantity,
            min_stock_before_import,
            min_stock_after_sale,
            max_promotion_duration,
        });

        console.log("Kết quả từ database:", result); // Log kết quả từ database

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy quy định để cập nhật" });
        }

        res.status(200).json({ message: "Cập nhật quy định thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật quy định:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật quy định", error });
    }
};

module.exports = {
    getRules,
    updateRules,
};