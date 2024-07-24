import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ManageUsers from './ManageUsers';
import ManageBalance from './ManageBalance';
import ManageTransactions from './ManageTransactions';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('manageUsers');

  const renderContent = () => {
    switch (currentView) {
      case 'manageUsers':
        return <ManageUsers />;
      case 'manageBalance':
        return <ManageBalance />;
      case 'manageTransactions':
        return <ManageTransactions />;
      default:
        return <ManageUsers />;
    }
  };

  return (
    <div>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
