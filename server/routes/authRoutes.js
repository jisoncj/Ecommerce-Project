const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (requires token)
router.get('/profile', authMiddleware, authController.getProfile);

// Admin only routes
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers);

module.exports = router;
