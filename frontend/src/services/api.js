import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createOrder = async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data.data;
};

export const getOrders = async (status, search) => {
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await axios.get(`${API_URL}/orders`, { params });
    return response.data.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
    return response.data.data;
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data.data;
};
