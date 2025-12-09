const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Self-Registration - Kullanıcı kendi domain'i ile kayıt olur
 * POST /api/auth/self-register
 */
const selfRegister = async (req, res) => {
    try {
        const { name, email, password, company_name, domain } = req.body;

        // Validation
        if (!name || !email || !password || !company_name || !domain) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanlar gereklidir'
            });
        }

        // Email validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz email adresi'
            });
        }

        // Domain validasyonu - önce temizle
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;

        if (!domainRegex.test(cleanDomain)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz domain adresi'
            });
        }

        // Şifre uzunluğu kontrolü
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Şifre en az 6 karakter olmalıdır'
            });
        }

        // Email'in kullanımda olup olmadığını kontrol et
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

        // Domain'in kullanımda olup olmadığını kontrol et
        const [existingClients] = await pool.execute(
            'SELECT id FROM clients WHERE domain = ?',
            [cleanDomain]
        );

        if (existingClients.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu domain zaten kayıtlı'
            });
        }

        // Transaction başlat
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Client oluştur
            const [clientResult] = await connection.execute(
                `INSERT INTO clients (name, domain, plan, status) VALUES (?, ?, ?, ?)`,
                [company_name, cleanDomain, 'Basic', 'active']
            );

            const clientId = clientResult.insertId;

            // 2. Şifreyi hashle
            const password_hash = await bcrypt.hash(password, 10);

            // 3. Client owner kullanıcı oluştur
            const [userResult] = await connection.execute(
                `INSERT INTO users (client_id, name, email, password_hash, role, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [clientId, name, email, password_hash, 'client_owner', 1]
            );

            const userId = userResult.insertId;

            // Transaction'ı commit et
            await connection.commit();
            connection.release();

            // JWT token oluştur
            const tokenPayload = {
                id: userId,
                role: 'client_owner',
                client_id: clientId
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });

            // Başarılı response
            res.status(201).json({
                success: true,
                message: 'Kayıt başarılı! Giriş yapılıyor...',
                token,
                user: {
                    id: userId,
                    name,
                    email,
                    role: 'client_owner',
                    client_id: clientId,
                    client_name: company_name,
                    client_domain: cleanDomain
                }
            });

        } catch (error) {
            // Transaction'ı geri al
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error('Self register error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt işlemi sırasında bir hata oluştu'
        });
    }
};

/**
 * Login - Kullanıcı girişi
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email ve şifre gereklidir'
            });
        }

        // Find user by email with client info
        const [users] = await pool.execute(
            `SELECT u.id, u.client_id, u.name, u.email, u.password_hash, u.role, u.is_active,
              c.name as client_name, c.domain as client_domain
       FROM users u
       LEFT JOIN clients c ON u.client_id = c.id
       WHERE u.email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        const user = users[0];

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız devre dışı bırakılmış'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Generate JWT token
        const tokenPayload = {
            id: user.id,
            role: user.role,
            client_id: user.client_id
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Return response
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                client_id: user.client_id,
                client_name: user.client_name,
                client_domain: user.client_domain
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş işlemi sırasında bir hata oluştu'
        });
    }
};

/**
 * Register - Yeni kullanıcı kaydı (sadece admin)
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role, client_id } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password ve role gereklidir'
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

        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (client_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
            [client_id || null, name, email, password_hash, role]
        );

        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt işlemi sırasında bir hata oluştu'
        });
    }
};

/**
 * Me - Mevcut kullanıcı bilgilerini getir
 * POST /api/auth/me
 */
const me = async (req, res) => {
    try {
        const [users] = await pool.execute(
            `SELECT u.id, u.client_id, u.name, u.email, u.role, u.is_active, u.created_at,
              c.name as client_name, c.domain as client_domain
       FROM users u
       LEFT JOIN clients c ON u.client_id = c.id
       WHERE u.id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const user = users[0];

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                client_id: user.client_id,
                client_name: user.client_name,
                client_domain: user.client_domain,
                is_active: user.is_active,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgileri alınırken bir hata oluştu'
        });
    }
};

/**
 * Change Password
 * POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Mevcut şifre ve yeni şifre gereklidir'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Yeni şifre en az 6 karakter olmalıdır'
            });
        }

        // Get current user password hash
        const [users] = await pool.execute(
            'SELECT password_hash FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, users[0].password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Mevcut şifre hatalı'
            });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.execute(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [newPasswordHash, req.user.id]
        );

        res.json({
            success: true,
            message: 'Şifre başarıyla değiştirildi'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Şifre değiştirme sırasında bir hata oluştu'
        });
    }
};

module.exports = {
    selfRegister,
    login,
    register,
    me,
    changePassword
};
