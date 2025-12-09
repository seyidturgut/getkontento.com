const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
} = require('../controllers/taskController');

// Stats endpoint
router.get('/stats', getTaskStats);

// Task CRUD
router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
