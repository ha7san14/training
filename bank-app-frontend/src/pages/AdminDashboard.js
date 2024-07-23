import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/admin-dashboard/manage-users" element={<ManageUsers />} />
            {/* Add routes for other pages */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
