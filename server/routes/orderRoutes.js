const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// User protected routes
router.post('/', authMiddleware, orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

// Admin / Access-restricted route
router.get('/:id', authMiddleware, orderController.getOrderById);

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
