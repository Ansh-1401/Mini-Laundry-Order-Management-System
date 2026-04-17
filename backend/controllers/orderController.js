const OrderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const order = await OrderService.createOrder(req.body);
        res.status(201).json({ success: true, message: 'Order created successfully', data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedOrder = await OrderService.updateOrderStatus(id, status);
        res.status(200).json({ success: true, message: 'Order status updated', data: updatedOrder });
    } catch (error) {
        if (error.message === 'Order not found.') {
            return res.status(404).json({ success: false, message: error.message, data: null });
        }
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

const getOrders = async (req, res) => {
    try {
        const { status, search } = req.query;
        const orders = await OrderService.getOrders(status, search);
        res.status(200).json({ success: true, message: 'Orders fetched successfully', data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

const getDashboard = async (req, res) => {
    try {
        const dashboardData = await OrderService.getDashboardStats();
        res.status(200).json({ success: true, message: 'Dashboard stats fetched successfully', data: dashboardData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getOrders,
    getDashboard
};
