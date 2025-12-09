require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contentRoutes = require('./routes/contentRoutes');
const seoRoutes = require('./routes/seoRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import middleware
const { authMiddleware } = require('./middleware/authMiddleware');
const { clientScopeMiddleware } = require('./middleware/clientScopeMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

// ========================
// MIDDLEWARE
// ========================

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// JSON parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ========================
// HEALTH CHECK
// ========================

app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({
            success: true,
            message: 'GetKontento API is running',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'GetKontento API is running but database connection failed',
            database: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

// ========================
// ROUTES
// ========================

// Auth routes (public login, protected routes inside)
app.use('/api/auth', authRoutes);

// Client routes (admin only)
app.use('/api/clients', authMiddleware, clientRoutes);

// Content routes (authenticated + client scope)
app.use('/api/contents', authMiddleware, clientScopeMiddleware, contentRoutes);

// SEO routes (authenticated + client scope)
app.use('/api/seo', authMiddleware, clientScopeMiddleware, seoRoutes);

// Task routes (authenticated + client scope)
app.use('/api/tasks', authMiddleware, clientScopeMiddleware, taskRoutes);

// ========================
// ERROR HANDLING
// ========================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı',
        path: req.url
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası oluştu',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========================
// SERVER START
// ========================

const startServer = async () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                  GetKontento SEO Platform                ║');
    console.log('║                      Backend API                         ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.log('');
        console.log('⚠️  Veritabanı bağlantısı başarısız!');
        console.log('   Lütfen .env dosyasındaki veritabanı bilgilerini kontrol edin.');
        console.log('   API veritabanı olmadan çalışmaya devam edecek...');
        console.log('');
    }

    app.listen(PORT, () => {
        console.log(`🚀 GetKontento API running on port ${PORT}`);
        console.log(`📍 Local:   http://localhost:${PORT}`);
        console.log(`📍 Health:  http://localhost:${PORT}/api/health`);
        console.log('');
        console.log('📚 Available endpoints:');
        console.log('   POST   /api/auth/login');
        console.log('   GET    /api/auth/me');
        console.log('   GET    /api/clients');
        console.log('   GET    /api/contents');
        console.log('   POST   /api/seo/suggest');
        console.log('   GET    /api/tasks');
        console.log('');
    });
};

startServer();
