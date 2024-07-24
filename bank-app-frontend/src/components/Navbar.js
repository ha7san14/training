import React from 'react';

const Navbar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { name: 'Manage Users', view: 'manageUsers' },
    { name: 'Manage Transactions', view: 'manageTransactions' },
    { name: 'Manage Balance', view: 'manageBalance' },
  ];

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-center">
      <ul className="flex space-x-8">
        {navItems.map((item) => (
          <li key={item.view} className="relative">
            <button
              onClick={() => setCurrentView(item.view)}
              className={`${
                currentView === item.view
                  ? 'border-b-2 border-white'
                  : 'hover:border-b-2 hover:border-gray-400'
              } pb-2`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
