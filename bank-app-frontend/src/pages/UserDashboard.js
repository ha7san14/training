import React, { useState } from 'react';
import UserNavbar from '../components/Navbar'; 
import ViewAccountInfo from './ViewAccountInfo';
import ViewTransactionHistory from './ViewTransactionHistory';
import SendTransaction from './SendTransaction';

const UserDashboard = () => {
  const [currentView, setCurrentView] = useState('viewAccountInfo');

  const renderContent = () => {
    switch (currentView) {
      case 'viewAccountInfo':
        return <ViewAccountInfo />;
      case 'viewTransactionHistory':
        return <ViewTransactionHistory />;
      case 'sendTransaction':
        return <SendTransaction />;
      default:
        return <ViewAccountInfo />;
    }
  };

  return (
    <div>
      <UserNavbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDashboard;
