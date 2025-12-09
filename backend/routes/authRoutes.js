const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    login,
    register,
    me,
    changePassword
} = require('../controllers/authController');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, me);
router.post('/change-password', authMiddleware, changePassword);

// Admin only - register new user
router.post('/register', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için admin yetkisi gerekli'
        });
    }
    next();
}, register);

module.exports = router;
