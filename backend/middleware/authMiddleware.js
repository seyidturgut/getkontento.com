const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Yetkilendirme başlığı bulunamadı'
            });
        }

        // Check Bearer format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Token formatı geçersiz. Format: Bearer <token>'
            });
        }

        const token = parts[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            role: decoded.role,
            client_id: decoded.client_id
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuş'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Yetkilendirme hatası'
        });
    }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için admin yetkisi gerekli'
        });
    }
    next();
};

// Client owner or admin middleware
const ownerOrAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'client_owner') {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için admin veya client owner yetkisi gerekli'
        });
    }
    next();
};

module.exports = { authMiddleware, adminOnly, ownerOrAdmin };
