import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [statusUpdating, setStatusUpdating] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders(statusFilter, searchQuery);
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Simple debounce for search
        const delayDebounce = setTimeout(() => {
            fetchOrders();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [statusFilter, searchQuery]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            setStatusUpdating(id);
            await updateOrderStatus(id, newStatus);
            // Re-fetch to get updated list
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        } finally {
            setStatusUpdating(null);
        }
    };

    return (
        <div className="card">
            <h1>Orders List</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <input 
                        type="text" 
                        placeholder="Search by customer name or phone..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="RECEIVED">RECEIVED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="READY">READY</option>
                        <option value="DELIVERED">DELIVERED</option>
                    </select>
                </div>
            </div>

            {loading && orders.length === 0 ? (
                <div>Loading orders...</div>
            ) : error ? (
                <div className="error-text">{error}</div>
            ) : orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Est. Delivery</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td><small>{order.id.split('-')[0]}</small></td>
                                    <td>{order.customerName}</td>
                                    <td>{order.phone}</td>
                                    <td>
                                        {order.items.map((item, idx) => (
                                            <div key={idx}><small>{item.quantity}x {item.type}</small></div>
                                        ))}
                                    </td>
                                    <td>${order.totalAmount}</td>
                                    <td>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={statusUpdating === order.id}
                                            style={{
                                                padding: '0.25rem',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc'
                                            }}
                                        >
                                            <option value="RECEIVED">RECEIVED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="READY">READY</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                        {statusUpdating === order.id && <small style={{display: 'block', color: 'gray'}}>updating...</small>}
                                    </td>
                                    <td>
                                        <small>{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</small>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderList;
