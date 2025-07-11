const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Login route
router.post('/login', authController.login);

// Xác thực token - hỗ trợ cả POST và GET
router.post('/validate-token', authMiddleware.verifyToken, authController.validateToken);
router.get('/validate-token', authMiddleware.verifyToken, authController.validateToken);

// Đăng xuất
router.post('/logout', authMiddleware.verifyToken, authController.logout);

// Forgot password routes
router.post('/forgot-password', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
