const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

/**
 * Get All Clients
 * GET /api/clients
 */
const getAllClients = async (req, res) => {
    try {
        const { status, plan, search } = req.query;

        let query = 'SELECT * FROM clients WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (plan) {
            query += ' AND plan = ?';
            params.push(plan);
        }

        if (search) {
            query += ' AND (name LIKE ? OR domain LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [clients] = await pool.execute(query, params);

        res.json({
            success: true,
            data: clients,
            count: clients.length
        });

    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Client listesi alınırken bir hata oluştu'
        });
    }
};

/**
 * Get Single Client
 * GET /api/clients/:id
 */
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;

        const [clients] = await pool.execute(
            'SELECT * FROM clients WHERE id = ?',
            [id]
        );

        if (clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client bulunamadı'
            });
        }

        // Get user count for this client
        const [userCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE client_id = ?',
            [id]
        );

        // Get content count for this client
        const [contentCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM contents WHERE client_id = ?',
            [id]
        );

        res.json({
            success: true,
            data: {
                ...clients[0],
                user_count: userCount[0].count,
                content_count: contentCount[0].count
            }
        });

    } catch (error) {
        console.error('Get client by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Client bilgisi alınırken bir hata oluştu'
        });
    }
};

/**
 * Create Client
 * POST /api/clients
 */
const createClient = async (req, res) => {
    try {
        const { name, domain, wp_api_url, wp_api_key, wp_api_secret, plan, status } = req.body;

        // Validation
        if (!name || !domain) {
            return res.status(400).json({
                success: false,
                message: 'Name ve domain gereklidir'
            });
        }

        // Check if domain already exists
        const [existingClients] = await pool.execute(
            'SELECT id FROM clients WHERE domain = ?',
            [domain]
        );

        if (existingClients.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu domain zaten kayıtlı'
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO clients (name, domain, wp_api_url, wp_api_key, wp_api_secret, plan, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, domain, wp_api_url || null, wp_api_key || null, wp_api_secret || null, plan || 'Basic', status || 'active']
        );

        res.status(201).json({
            success: true,
            message: 'Client başarıyla oluşturuldu',
            clientId: result.insertId
        });

    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({
            success: false,
            message: 'Client oluşturulurken bir hata oluştu'
        });
    }
};

/**
 * Update Client
 * PUT /api/clients/:id
 */
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, domain, wp_api_url, wp_api_key, wp_api_secret, plan, status } = req.body;

        // Check if client exists
        const [existingClients] = await pool.execute(
            'SELECT id FROM clients WHERE id = ?',
            [id]
        );

        if (existingClients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client bulunamadı'
            });
        }

        // Check if domain is taken by another client
        if (domain) {
            const [domainCheck] = await pool.execute(
                'SELECT id FROM clients WHERE domain = ? AND id != ?',
                [domain, id]
            );

            if (domainCheck.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu domain başka bir client tarafından kullanılıyor'
                });
            }
        }

        await pool.execute(
            `UPDATE clients SET 
        name = COALESCE(?, name),
        domain = COALESCE(?, domain),
        wp_api_url = COALESCE(?, wp_api_url),
        wp_api_key = COALESCE(?, wp_api_key),
        wp_api_secret = COALESCE(?, wp_api_secret),
        plan = COALESCE(?, plan),
        status = COALESCE(?, status)
       WHERE id = ?`,
            [name, domain, wp_api_url, wp_api_key, wp_api_secret, plan, status, id]
        );

        res.json({
            success: true,
            message: 'Client başarıyla güncellendi'
        });

    } catch (error) {
        console.error('Update client error:', error);
        res.status(500).json({
            success: false,
            message: 'Client güncellenirken bir hata oluştu'
        });
    }
};

/**
 * Delete Client
 * DELETE /api/clients/:id
 */
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM clients WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Client başarıyla silindi'
        });

    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({
            success: false,
            message: 'Client silinirken bir hata oluştu'
        });
    }
};

/**
 * Get Client Users
 * GET /api/clients/:id/users
 */
const getClientUsers = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await pool.execute(
            'SELECT id, name, email, role, is_active, created_at FROM users WHERE client_id = ?',
            [id]
        );

        res.json({
            success: true,
            data: users,
            count: users.length
        });

    } catch (error) {
        console.error('Get client users error:', error);
        res.status(500).json({
            success: false,
            message: 'Client kullanıcıları alınırken bir hata oluştu'
        });
    }
};

/**
 * Create Client User
 * POST /api/clients/:id/users
 */
const createClientUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password ve role gereklidir'
            });
        }

        // Validate role
        const validRoles = ['client_owner', 'client_editor', 'client_viewer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz rol. Geçerli roller: client_owner, client_editor, client_viewer'
            });
        }

        // Check if client exists
        const [clients] = await pool.execute(
            'SELECT id FROM clients WHERE id = ?',
            [id]
        );

        if (clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client bulunamadı'
            });
        }

        // Check if email already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanımda'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            'INSERT INTO users (client_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
            [id, name, email, password_hash, role]
        );

        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Create client user error:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı oluşturulurken bir hata oluştu'
        });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientUsers,
    createClientUser
};
