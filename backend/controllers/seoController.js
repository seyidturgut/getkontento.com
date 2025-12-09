const { pool } = require('../config/db');
const { getClientFilter } = require('../middleware/clientScopeMiddleware');

/**
 * Generate SEO Suggestion (Dummy AI for now)
 * POST /api/seo/suggest
 */
const generateSuggestion = async (req, res) => {
    try {
        const { content_id, base_title, base_description, base_keywords } = req.body;

        if (!content_id) {
            return res.status(400).json({
                success: false,
                message: 'content_id gereklidir'
            });
        }

        // Check if content exists and user has access
        const { whereClause, params } = getClientFilter(req.clientScope);
        const [contents] = await pool.execute(
            `SELECT id, title, meta_description FROM contents WHERE id = ? AND ${whereClause}`,
            [content_id, ...params]
        );

        if (contents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'İçerik bulunamadı veya erişim yetkiniz yok'
            });
        }

        const content = contents[0];
        const title = base_title || content.title || '';
        const description = base_description || content.meta_description || '';

        // Dummy AI logic - in production, this would call Gemini/OpenAI API
        const suggested_title = title.length > 0
            ? `${title} | GetKontento SEO`
            : 'Optimize Edilmiş Başlık | GetKontento SEO';

        const suggested_description = description.length > 150
            ? description.substring(0, 147) + '...'
            : description.length > 0
                ? `${description} - SEO optimizasyonu ile daha fazla ziyaretçi kazanın.`
                : 'Bu sayfa için SEO açıklaması eklemeniz önerilir. İyi bir meta açıklama 150-160 karakter arasında olmalıdır.';

        // Generate dummy keywords
        const keywords = base_keywords || title.toLowerCase()
            .split(' ')
            .filter(word => word.length > 3)
            .slice(0, 5);
        const suggested_keywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;

        // Generate suggested H1
        const suggested_h1 = title.length > 0
            ? title.replace(/\s*\|.*$/, '').trim()
            : 'Ana Başlık Ekleyin';

        // Calculate dummy rules passed
        let rules_passed = 0;
        if (title.length >= 30 && title.length <= 60) rules_passed++;
        if (description.length >= 120 && description.length <= 160) rules_passed++;
        if (keywords.length >= 3) rules_passed++;
        if (suggested_h1.length > 0) rules_passed++;
        rules_passed = Math.max(rules_passed, 2); // Minimum 2

        // Save suggestion to database
        const [result] = await pool.execute(
            `INSERT INTO seo_suggestions (content_id, suggested_title, suggested_description, suggested_keywords, suggested_h1, rules_passed)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [content_id, suggested_title, suggested_description, suggested_keywords, suggested_h1, rules_passed]
        );

        // Get the created suggestion
        const [suggestions] = await pool.execute(
            'SELECT * FROM seo_suggestions WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'SEO önerisi başarıyla oluşturuldu',
            data: suggestions[0]
        });

    } catch (error) {
        console.error('Generate suggestion error:', error);
        res.status(500).json({
            success: false,
            message: 'SEO önerisi oluşturulurken bir hata oluştu'
        });
    }
};

/**
 * Get Suggestions for Content
 * GET /api/seo/suggestions/:contentId
 */
const getSuggestionsByContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { whereClause, params } = getClientFilter(req.clientScope);

        // Check if content exists and user has access
        const [contents] = await pool.execute(
            `SELECT id FROM contents WHERE id = ? AND ${whereClause}`,
            [contentId, ...params]
        );

        if (contents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'İçerik bulunamadı veya erişim yetkiniz yok'
            });
        }

        const [suggestions] = await pool.execute(
            'SELECT * FROM seo_suggestions WHERE content_id = ? ORDER BY created_at DESC',
            [contentId]
        );

        res.json({
            success: true,
            data: suggestions,
            count: suggestions.length
        });

    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'SEO önerileri alınırken bir hata oluştu'
        });
    }
};

/**
 * Apply Suggestion to Content
 * POST /api/seo/apply/:suggestionId
 */
const applySuggestion = async (req, res) => {
    try {
        const { suggestionId } = req.params;

        // Get suggestion
        const [suggestions] = await pool.execute(
            'SELECT * FROM seo_suggestions WHERE id = ?',
            [suggestionId]
        );

        if (suggestions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'SEO önerisi bulunamadı'
            });
        }

        const suggestion = suggestions[0];

        // Check if user has access to the content
        const { whereClause, params } = getClientFilter(req.clientScope);
        const [contents] = await pool.execute(
            `SELECT id FROM contents WHERE id = ? AND ${whereClause}`,
            [suggestion.content_id, ...params]
        );

        if (contents.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Bu içeriğe erişim yetkiniz yok'
            });
        }

        // Apply suggestion to content
        await pool.execute(
            `UPDATE contents SET 
        meta_title = ?,
        meta_description = ?,
        seo_score = seo_score + 10,
        needs_update = 0
       WHERE id = ?`,
            [suggestion.suggested_title, suggestion.suggested_description, suggestion.content_id]
        );

        res.json({
            success: true,
            message: 'SEO önerisi başarıyla uygulandı'
        });

    } catch (error) {
        console.error('Apply suggestion error:', error);
        res.status(500).json({
            success: false,
            message: 'SEO önerisi uygulanırken bir hata oluştu'
        });
    }
};

/**
 * Delete Suggestion
 * DELETE /api/seo/suggestions/:id
 */
const deleteSuggestion = async (req, res) => {
    try {
        const { id } = req.params;

        // Get suggestion first to check content access
        const [suggestions] = await pool.execute(
            'SELECT content_id FROM seo_suggestions WHERE id = ?',
            [id]
        );

        if (suggestions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'SEO önerisi bulunamadı'
            });
        }

        // Check if user has access to the content
        const { whereClause, params } = getClientFilter(req.clientScope);
        const [contents] = await pool.execute(
            `SELECT id FROM contents WHERE id = ? AND ${whereClause}`,
            [suggestions[0].content_id, ...params]
        );

        if (contents.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Bu içeriğe erişim yetkiniz yok'
            });
        }

        await pool.execute('DELETE FROM seo_suggestions WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'SEO önerisi başarıyla silindi'
        });

    } catch (error) {
        console.error('Delete suggestion error:', error);
        res.status(500).json({
            success: false,
            message: 'SEO önerisi silinirken bir hata oluştu'
        });
    }
};

module.exports = {
    generateSuggestion,
    getSuggestionsByContent,
    applySuggestion,
    deleteSuggestion
};
