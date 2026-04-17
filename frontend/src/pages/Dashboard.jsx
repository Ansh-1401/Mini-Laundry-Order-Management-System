import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard stats.');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="card">
            <h1>Dashboard</h1>
            
            <div className="dashboard-stats">
                <div className="card stat-card">
                    <h3>{stats?.totalOrders || 0}</h3>
                    <p>Total Orders</p>
                </div>
                <div className="card stat-card">
                    <h3>${stats?.totalRevenue || 0}</h3>
                    <p>Total Revenue</p>
                </div>
            </div>

            <h2>Orders by Status</h2>
            <div className="dashboard-stats">
                {Object.entries(stats?.ordersPerStatus || {}).map(([status, count]) => (
                    <div key={status} className="card stat-card">
                        <h3>{count}</h3>
                        <p>{status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
