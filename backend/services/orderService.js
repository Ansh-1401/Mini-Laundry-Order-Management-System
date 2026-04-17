const { v4: uuidv4 } = require('uuid');
const OrderModel = require('../models/orderModel');
const { STATUS_ENUM, VALID_STATUSES } = require('../constants/status');

const GARMENT_PRICES = {
    Shirt: 20,
    Pants: 30,
    Saree: 50
};

const createOrder = async (data) => {
    const { customerName, phone, items } = data;

    // Validate inputs
    if (!customerName || !customerName.trim()) {
        throw new Error('customerName is required and cannot be empty.');
    }
    if (!phone || !phone.trim()) {
        throw new Error('phone is required and cannot be empty.');
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('items must be a non-empty array.');
    }

    let totalAmount = 0;

    // Validate items and calculate total amount
    items.forEach(item => {
        if (!item.type || !item.quantity || item.quantity <= 0) {
            throw new Error('Each item must have a valid type and a quantity > 0.');
        }

        const price = GARMENT_PRICES[item.type];
        if (!price) {
            throw new Error(`Invalid item type '${item.type}'. Allowed types are: ${Object.keys(GARMENT_PRICES).join(', ')}`);
        }

        totalAmount += price * item.quantity;
    });

    // Calculate Estimated Delivery Date (3 days from now)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

    const newOrder = {
        id: uuidv4(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        items,
        totalAmount,
        status: STATUS_ENUM.RECEIVED,
        createdAt: new Date(),
        estimatedDeliveryDate
    };

    return await OrderModel.create(newOrder);
};

const updateOrderStatus = async (id, status) => {
    if (!VALID_STATUSES.includes(status)) {
        throw new Error(`Invalid status. Allowed statuses are: ${VALID_STATUSES.join(', ')}`);
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, { status });
    if (!updatedOrder) {
        throw new Error('Order not found.');
    }

    return updatedOrder;
};

const getOrders = async (status, search) => {
    let orders = await OrderModel.find();

    // Filter by status
    if (status) {
        orders = orders.filter(o => o.status === status);
    }

    // Filter by search string (name or phone)
    if (search) {
        const searchLower = search.toLowerCase();
        orders = orders.filter(o => 
            o.customerName.toLowerCase().includes(searchLower) ||
            o.phone.includes(searchLower)
        );
    }

    // Sort by newest first
    orders.sort((a, b) => b.createdAt - a.createdAt);

    return orders;
};

const getDashboardStats = async () => {
    const orders = await OrderModel.find();

    let totalOrders = orders.length;
    let totalRevenue = 0;
    
    // Initialize status counts
    const ordersPerStatus = {
        [STATUS_ENUM.RECEIVED]: 0,
        [STATUS_ENUM.PROCESSING]: 0,
        [STATUS_ENUM.READY]: 0,
        [STATUS_ENUM.DELIVERED]: 0
    };

    orders.forEach(order => {
        totalRevenue += order.totalAmount;
        if (ordersPerStatus[order.status] !== undefined) {
             ordersPerStatus[order.status]++;
        }
    });

    return {
        totalOrders,
        totalRevenue,
        ordersPerStatus
    };
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getOrders,
    getDashboardStats
};
