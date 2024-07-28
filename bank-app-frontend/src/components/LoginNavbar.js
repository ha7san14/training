import React from 'react';
import logo from '../assets/logo.svg'; // Ensure this path is correct

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-center items-center">
      <div className="flex items-center">
        <img src={logo} alt="Bank Application Logo" className="h-10 w-10 mr-2" />
        <h1 className="text-2xl font-bold">Bank Application</h1>
      </div>
    </nav>
  );
};

export default Navbar;
