const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define API routes
router.post('/orders', orderController.createOrder);
router.put('/orders/:id/status', orderController.updateOrderStatus);
router.get('/orders', orderController.getOrders);
router.get('/dashboard', orderController.getDashboard);

module.exports = router;
