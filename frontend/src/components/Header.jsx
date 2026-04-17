import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h2>🧺 Mini Laundry CRM</h2>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/orders/new">Create Order</Link>
        <Link to="/orders">Orders List</Link>
      </nav>
    </header>
  );
};

export default Header;
