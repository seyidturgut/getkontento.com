const { pool } = require('../config/db');
const { getClientFilter } = require('../middleware/clientScopeMiddleware');

/**
 * Get All Contents
 * GET /api/contents
 */
const getAllContents = async (req, res) => {
    try {
        const { search, needs_update, min_score, max_score, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { whereClause, params } = getClientFilter(req.clientScope);

        let query = `SELECT c.*, cl.name as client_name 
                 FROM contents c 
                 LEFT JOIN clients cl ON c.client_id = cl.id 
                 WHERE ${whereClause}`;

        if (search) {
            query += ' AND (c.title LIKE ? OR c.slug LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (needs_update !== undefined) {
            query += ' AND c.needs_update = ?';
            params.push(needs_update);
        }

        if (min_score !== undefined) {
            query += ' AND c.seo_score >= ?';
            params.push(parseInt(min_score));
        }

        if (max_score !== undefined) {
            query += ' AND c.seo_score <= ?';
            params.push(parseInt(max_score));
        }

        // Get total count
        const countQuery = query.replace('SELECT c.*, cl.name as client_name', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        // Add pagination
        query += ' ORDER BY c.updated_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [contents] = await pool.execute(query, params);

        res.json({
            success: true,
            data: contents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get contents error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerikler alınırken bir hata oluştu'
        });
    }
};

/**
 * Get Single Content with SEO Suggestions
 * GET /api/contents/:id
 */
const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { whereClause, params } = getClientFilter(req.clientScope);

        // Get content
        const [contents] = await pool.execute(
            `SELECT c.*, cl.name as client_name, cl.domain as client_domain
       FROM contents c 
       LEFT JOIN clients cl ON c.client_id = cl.id 
       WHERE c.id = ? AND ${whereClause}`,
            [id, ...params]
        );

        if (contents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'İçerik bulunamadı veya erişim yetkiniz yok'
            });
        }

        // Get SEO suggestions for this content
        const [suggestions] = await pool.execute(
            'SELECT * FROM seo_suggestions WHERE content_id = ? ORDER BY created_at DESC',
            [id]
        );

        // Get related tasks
        const [tasks] = await pool.execute(
            'SELECT id, title, status, created_at FROM tasks WHERE content_id = ? ORDER BY created_at DESC',
            [id]
        );

        res.json({
            success: true,
            data: {
                ...contents[0],
                seo_suggestions: suggestions,
                tasks
            }
        });

    } catch (error) {
        console.error('Get content by id error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerik bilgisi alınırken bir hata oluştu'
        });
    }
};

/**
 * Create Content
 * POST /api/contents
 */
const createContent = async (req, res) => {
    try {
        const { wp_post_id, title, slug, meta_title, meta_description, seo_score, needs_update } = req.body;

        // Determine client_id
        const client_id = req.clientScope.isAdmin
            ? (req.body.client_id || req.clientScope.clientId)
            : req.clientScope.clientId;

        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'client_id gereklidir'
            });
        }

        if (!wp_post_id || !title) {
            return res.status(400).json({
                success: false,
                message: 'wp_post_id ve title gereklidir'
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO contents (client_id, wp_post_id, title, slug, meta_title, meta_description, seo_score, needs_update)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [client_id, wp_post_id, title, slug || null, meta_title || null, meta_description || null, seo_score || 0, needs_update || 0]
        );

        res.status(201).json({
            success: true,
            message: 'İçerik başarıyla oluşturuldu',
            contentId: result.insertId
        });

    } catch (error) {
        console.error('Create content error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerik oluşturulurken bir hata oluştu'
        });
    }
};

/**
 * Update Content
 * PUT /api/contents/:id
 */
const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, meta_title, meta_description, seo_score, needs_update } = req.body;
        const { whereClause, params } = getClientFilter(req.clientScope);

        // Check if content exists and user has access
        const [contents] = await pool.execute(
            `SELECT id FROM contents WHERE id = ? AND ${whereClause}`,
            [id, ...params]
        );

        if (contents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'İçerik bulunamadı veya erişim yetkiniz yok'
            });
        }

        await pool.execute(
            `UPDATE contents SET 
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        meta_title = COALESCE(?, meta_title),
        meta_description = COALESCE(?, meta_description),
        seo_score = COALESCE(?, seo_score),
        needs_update = COALESCE(?, needs_update)
       WHERE id = ?`,
            [title, slug, meta_title, meta_description, seo_score, needs_update, id]
        );

        res.json({
            success: true,
            message: 'İçerik başarıyla güncellendi'
        });

    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerik güncellenirken bir hata oluştu'
        });
    }
};

/**
 * Delete Content
 * DELETE /api/contents/:id
 */
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { whereClause, params } = getClientFilter(req.clientScope);

        const [result] = await pool.execute(
            `DELETE FROM contents WHERE id = ? AND ${whereClause}`,
            [id, ...params]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'İçerik bulunamadı veya erişim yetkiniz yok'
            });
        }

        res.json({
            success: true,
            message: 'İçerik başarıyla silindi'
        });

    } catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerik silinirken bir hata oluştu'
        });
    }
};

/**
 * Sync Contents from WordPress (Dummy for now)
 * POST /api/contents/sync
 */
const syncContents = async (req, res) => {
    try {
        const { posts } = req.body;

        // Determine client_id
        const client_id = req.clientScope.isAdmin
            ? (req.body.client_id || req.clientScope.clientId)
            : req.clientScope.clientId;

        if (!client_id) {
            return res.status(400).json({
                success: false,
                message: 'client_id gereklidir'
            });
        }

        if (!posts || !Array.isArray(posts)) {
            return res.status(400).json({
                success: false,
                message: 'posts array gereklidir'
            });
        }

        const insertedIds = [];
        const updatedIds = [];

        for (const post of posts) {
            // Check if content already exists
            const [existing] = await pool.execute(
                'SELECT id FROM contents WHERE client_id = ? AND wp_post_id = ?',
                [client_id, post.wp_post_id]
            );

            if (existing.length > 0) {
                // Update existing
                await pool.execute(
                    `UPDATE contents SET 
            title = ?, slug = ?, meta_title = ?, meta_description = ?, needs_update = 1
           WHERE id = ?`,
                    [post.title, post.slug, post.meta_title, post.meta_description, existing[0].id]
                );
                updatedIds.push(existing[0].id);
            } else {
                // Insert new
                const [result] = await pool.execute(
                    `INSERT INTO contents (client_id, wp_post_id, title, slug, meta_title, meta_description, seo_score, needs_update)
           VALUES (?, ?, ?, ?, ?, ?, 0, 1)`,
                    [client_id, post.wp_post_id, post.title, post.slug, post.meta_title || null, post.meta_description || null]
                );
                insertedIds.push(result.insertId);
            }
        }

        res.json({
            success: true,
            message: 'İçerikler senkronize edildi',
            stats: {
                inserted: insertedIds.length,
                updated: updatedIds.length,
                insertedIds,
                updatedIds
            }
        });

    } catch (error) {
        console.error('Sync contents error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerikler senkronize edilirken bir hata oluştu'
        });
    }
};

/**
 * Get Content Stats
 * GET /api/contents/stats
 */
const getContentStats = async (req, res) => {
    try {
        const { whereClause, params } = getClientFilter(req.clientScope);

        const [stats] = await pool.execute(
            `SELECT 
        COUNT(*) as total_contents,
        SUM(CASE WHEN needs_update = 1 THEN 1 ELSE 0 END) as needs_update_count,
        AVG(seo_score) as avg_seo_score,
        SUM(CASE WHEN seo_score >= 80 THEN 1 ELSE 0 END) as good_seo_count,
        SUM(CASE WHEN seo_score >= 50 AND seo_score < 80 THEN 1 ELSE 0 END) as medium_seo_count,
        SUM(CASE WHEN seo_score < 50 THEN 1 ELSE 0 END) as poor_seo_count
       FROM contents WHERE ${whereClause}`,
            params
        );

        res.json({
            success: true,
            data: {
                total_contents: stats[0].total_contents || 0,
                needs_update_count: stats[0].needs_update_count || 0,
                avg_seo_score: Math.round(stats[0].avg_seo_score || 0),
                good_seo_count: stats[0].good_seo_count || 0,
                medium_seo_count: stats[0].medium_seo_count || 0,
                poor_seo_count: stats[0].poor_seo_count || 0
            }
        });

    } catch (error) {
        console.error('Get content stats error:', error);
        res.status(500).json({
            success: false,
            message: 'İçerik istatistikleri alınırken bir hata oluştu'
        });
    }
};

module.exports = {
    getAllContents,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    syncContents,
    getContentStats
};
