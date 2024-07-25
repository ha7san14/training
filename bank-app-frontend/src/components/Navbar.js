import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to get the current route

const Navbar = ({ currentView, setCurrentView }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Define navigation items based on role
  const adminNavItems = [
    { name: 'Manage Users', view: 'manageUsers' },
    { name: 'Manage Balance', view: 'manageBalance' },
    { name: 'Manage Transactions', view: 'manageTransactions'},
  ];

  const userNavItems = [
    { name: 'View Account Information', view: 'viewAccountInfo' },
    { name: 'View Transaction History', view: 'viewTransactionHistory' },
    { name: 'Send Transaction', view: 'sendTransaction'},
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center ml-4">
        <h1 className="text-2xl font-bold">Bank Application</h1>
      </div>
      <ul className="flex space-x-8">
        {navItems.map((item) => (
          <li key={item.view} className="relative">
            <button
              onClick={() => {
                setCurrentView(item.view);
                navigate(item.path);
              }}
              className={`pb-2 ${
                currentView === item.view || location.pathname === item.path
                  ? 'border-b-2 border-white'
                  : 'hover:border-b-2 hover:border-gray-400'
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 mr-4 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
