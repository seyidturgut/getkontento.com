const express = require('express');
const router = express.Router();
const {
    getAllContents,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    syncContents,
    getContentStats
} = require('../controllers/contentController');

// Stats endpoint
router.get('/stats', getContentStats);

// Sync endpoint
router.post('/sync', syncContents);

// Content CRUD
router.get('/', getAllContents);
router.post('/', createContent);
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;
