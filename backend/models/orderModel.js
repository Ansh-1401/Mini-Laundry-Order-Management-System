// In-memory data store
let orders = [];

// Simulating a database model structure so we can easily swap to Mongoose later
const OrderModel = {
    // Return all orders
    find: async () => {
        return orders;
    },

    // Return a single order by ID
    findById: async (id) => {
        return orders.find(order => order.id === id);
    },

    // Create a new order
    create: async (orderData) => {
        orders.push(orderData);
        return orderData;
    },

    // Update an existing order by ID
    findByIdAndUpdate: async (id, updateData) => {
        const orderIndex = orders.findIndex(order => order.id === id);
        if (orderIndex === -1) return null;

        orders[orderIndex] = { ...orders[orderIndex], ...updateData };
        return orders[orderIndex];
    }
};

module.exports = OrderModel;
