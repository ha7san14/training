import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-700 text-white min-h-screen p-4">
      <ul>
        <li className="mb-4">
          <Link to="/admin-dashboard/manage-users">Manage Users</Link>
        </li>
        <li className="mb-4">
          <Link to="/manage-transactions">Manage Transactions</Link>
        </li>
        <li className="mb-4">
          <Link to="/manage-balance">Manage Balance</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
