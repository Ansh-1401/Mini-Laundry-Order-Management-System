import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';

const CreateOrder = () => {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [items, setItems] = useState([{ type: 'Shirt', quantity: 1 }]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const garmentTypes = ['Shirt', 'Pants', 'Saree'];

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { type: 'Shirt', quantity: 1 }]);
    };

    const removeItem = (index) => {
        if (items.length <= 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Transform quantity to numbers
            const formattedItems = items.map(item => ({
                ...item,
                quantity: Number(item.quantity)
            }));

            await createOrder({ customerName, phone, items: formattedItems });
            setCustomerName('');
            setPhone('');
            setItems([{ type: 'Shirt', quantity: 1 }]);
            alert('Order created successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while creating the order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h1>Create New Order</h1>
            
            {error && <div className="error-text">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Customer Name *</label>
                    <input 
                        type="text" 
                        required 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        placeholder="John Doe"
                    />
                </div>
                
                <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                        type="text" 
                        required 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="123-456-7890"
                    />
                </div>

                <h3>Laundry Items</h3>
                <div className="card" style={{ background: '#f8fafc' }}>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                                <label>Garment Type</label>
                                <select 
                                    value={item.type} 
                                    onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                >
                                    {garmentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label>Quantity</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    required
                                    value={item.quantity} 
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                                />
                            </div>
                            {items.length > 1 && (
                                <button type="button" className="btn btn-secondary" onClick={() => removeItem(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    
                    <button type="button" className="btn btn-secondary" onClick={addItem} style={{ marginTop: '0.5rem' }}>
                        + Add Another Item
                    </button>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                        {loading ? 'Creating...' : 'Create Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrder;
