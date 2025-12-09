const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middleware/authMiddleware');
const {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientUsers,
    createClientUser
} = require('../controllers/clientController');

// All routes require admin role
router.use(adminOnly);

// Client CRUD
router.get('/', getAllClients);
router.post('/', createClient);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

// Client users
router.get('/:id/users', getClientUsers);
router.post('/:id/users', createClientUser);

module.exports = router;
