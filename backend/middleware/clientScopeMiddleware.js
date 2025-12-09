/**
 * Client Scope Middleware
 * 
 * Bu middleware, kullanıcının yalnızca kendi client'ına ait verilere
 * erişebilmesini sağlar. Admin kullanıcıları tüm verilere erişebilir.
 */

const clientScopeMiddleware = (req, res, next) => {
    // Admin her şeyi görebilir
    if (req.user.role === 'admin') {
        // Admin için client_id filtresi opsiyonel (query param'dan alınabilir)
        req.clientScope = {
            isAdmin: true,
            clientId: req.query.client_id ? parseInt(req.query.client_id) : null
        };
        return next();
    }

    // Client kullanıcıları sadece kendi client_id'lerini görebilir
    if (!req.user.client_id) {
        return res.status(403).json({
            success: false,
            message: 'Kullanıcının bağlı olduğu bir client bulunamadı'
        });
    }

    req.clientScope = {
        isAdmin: false,
        clientId: req.user.client_id
    };

    next();
};

/**
 * getClientFilter - SQL sorgularında kullanılmak üzere client filtresi döner
 * @param {Object} clientScope - req.clientScope objesi
 * @returns {Object} { whereClause: string, params: array }
 */
const getClientFilter = (clientScope, tableAlias = '') => {
    const prefix = tableAlias ? `${tableAlias}.` : '';

    if (clientScope.isAdmin && !clientScope.clientId) {
        // Admin ve belirli bir client seçilmemiş - tüm kayıtlar
        return { whereClause: '1=1', params: [] };
    }

    // Belirli bir client_id filtresi
    return {
        whereClause: `${prefix}client_id = ?`,
        params: [clientScope.clientId]
    };
};

module.exports = { clientScopeMiddleware, getClientFilter };
