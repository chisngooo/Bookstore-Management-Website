const express = require("express");
const promotionController = require("../controllers/promotionController");
const router = express.Router();

// Route lấy danh sách khuyến mãi
router.get("/", promotionController.getPromotions);

// Route thêm mới khuyến mãi
router.post("/", promotionController.addPromotion);

// Route sửa khuyến mãi
router.put("/:id", promotionController.updatePromotion);

// Route xóa khuyến mãi
router.delete("/:id", promotionController.deletePromotion);

// Route kiểm tra mã khuyến mãi
router.post("/check", promotionController.checkPromotion);

module.exports = router;