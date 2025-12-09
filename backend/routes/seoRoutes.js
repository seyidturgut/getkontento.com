const express = require('express');
const router = express.Router();
const {
    generateSuggestion,
    getSuggestionsByContent,
    applySuggestion,
    deleteSuggestion
} = require('../controllers/seoController');

// Generate SEO suggestion
router.post('/suggest', generateSuggestion);

// Get suggestions for a content
router.get('/suggestions/:contentId', getSuggestionsByContent);

// Apply suggestion to content
router.post('/apply/:suggestionId', applySuggestion);

// Delete suggestion
router.delete('/suggestions/:id', deleteSuggestion);

module.exports = router;
