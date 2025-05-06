const express = require("express");
const promotionController = require("../controllers/promotionController");
const router = express.Router();

// Route lấy danh sách khuyến mãi
router.get("/promotions", promotionController.getPromotions);

module.exports = router;