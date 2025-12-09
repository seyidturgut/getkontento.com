const { pool } = require('../config/db');
const { getClientFilter } = require('../middleware/clientScopeMiddleware');

/**
 * Get All Tasks
 * GET /api/tasks
 */
const getAllTasks = async (req, res) => {
    try {
        const { status, assigned_to, content_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { whereClause, params } = getClientFilter(req.clientScope);

        let query = `SELECT t.*, 
                        c.name as client_name,
                        u.name as assigned_to_name,
                        cnt.title as content_title
                 FROM tasks t 
                 LEFT JOIN clients c ON t.client_id = c.id
                 LEFT JOIN users u ON t.assigned_to = u.id
                 LEFT JOIN contents cnt ON t.content_id = cnt.id
                 WHERE ${whereClause.replace('client_id', 't.client_id')}`;

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }

        if (assigned_to) {
            query += ' AND t.assigned_to = ?';
            params.push(assigned_to);
        }

        if (content_id) {
            query += ' AND t.content_id = ?';
            params.push(content_id);
        }

        // Get total count
        const countQuery = query.replace(
            /SELECT t\.\*,[\s\S]*?FROM tasks t/,
            'SELECT COUNT(*) as total FROM tasks t'
        );
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        // Add pagination
        query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [tasks] = await pool.execute(query, params);

        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Görevler alınırken bir hata oluştu'
        });
    }
};

/**
 * Get Single Task
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { whereClause, params } = getClientFilter(req.clientScope);

        const [tasks] = await pool.execute(
            `SELECT t.*, 
              c.name as client_name,
              u.name as assigned_to_name,
              cnt.title as content_title,
              cnt.slug as content_slug
       FROM tasks t 
       LEFT JOIN clients c ON t.client_id = c.id
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN contents cnt ON t.content_id = cnt.id
       WHERE t.id = ? AND ${whereClause.replace('client_id', 't.client_id')}`,
            [id, ...params]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Görev bulunamadı veya erişim yetkiniz yok'
            });
        }

        res.json({
            success: true,
            data: tasks[0]
        });

    } catch (error) {
        console.error('Get task by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Görev bilgisi alınırken bir hata oluştu'
        });
    }
};

/**
 * Create Task
 * POST /api/tasks
 */
const createTask = async (req, res) => {
    try {
        const { title, description, assigned_to, content_id, status } = req.body;

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

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'title gereklidir'
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO tasks (client_id, assigned_to, content_id, title, description, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [client_id, assigned_to || null, content_id || null, title, description || null, status || 'pending']
        );

        res.status(201).json({
            success: true,
            message: 'Görev başarıyla oluşturuldu',
            taskId: result.insertId
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Görev oluşturulurken bir hata oluştu'
        });
    }
};

/**
 * Update Task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assigned_to, content_id, status } = req.body;
        const { whereClause, params } = getClientFilter(req.clientScope);

        // Check if task exists and user has access
        const [tasks] = await pool.execute(
            `SELECT id FROM tasks WHERE id = ? AND ${whereClause}`,
            [id, ...params]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Görev bulunamadı veya erişim yetkiniz yok'
            });
        }

        await pool.execute(
            `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        assigned_to = COALESCE(?, assigned_to),
        content_id = COALESCE(?, content_id),
        status = COALESCE(?, status)
       WHERE id = ?`,
            [title, description, assigned_to, content_id, status, id]
        );

        res.json({
            success: true,
            message: 'Görev başarıyla güncellendi'
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Görev güncellenirken bir hata oluştu'
        });
    }
};

/**
 * Delete Task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { whereClause, params } = getClientFilter(req.clientScope);

        const [result] = await pool.execute(
            `DELETE FROM tasks WHERE id = ? AND ${whereClause}`,
            [id, ...params]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Görev bulunamadı veya erişim yetkiniz yok'
            });
        }

        res.json({
            success: true,
            message: 'Görev başarıyla silindi'
        });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Görev silinirken bir hata oluştu'
        });
    }
};

/**
 * Get Task Stats
 * GET /api/tasks/stats
 */
const getTaskStats = async (req, res) => {
    try {
        const { whereClause, params } = getClientFilter(req.clientScope);

        const [stats] = await pool.execute(
            `SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
       FROM tasks WHERE ${whereClause}`,
            params
        );

        res.json({
            success: true,
            data: {
                total_tasks: stats[0].total_tasks || 0,
                pending_count: stats[0].pending_count || 0,
                in_progress_count: stats[0].in_progress_count || 0,
                completed_count: stats[0].completed_count || 0
            }
        });

    } catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Görev istatistikleri alınırken bir hata oluştu'
        });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
};
