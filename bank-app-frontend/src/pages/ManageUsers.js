import React, { useState, useEffect } from 'react';
import UserModal from '../components/UserModal'; // Ensure this path is correct
import axiosInstance from '../api/axiosConfig'; // Use axiosInstance for consistent API calls

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  //const [isModalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users/get-all-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get('/accounts/get-all-accounts'); // Adjust the endpoint as necessary
      console.log("Successs")
      setAccounts(response.data);
    } catch (error) {
        console.log("Its an error")
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    // Optionally, load users when the component mounts
    fetchUsers();
    fetchAccounts();
  }, []);

  const userAccountMap = accounts.reduce((acc, account) => {
    acc[account.user.id] = account.accountNumber;
    return acc;
  }, {});

  const handleCreateUser = async (user) => {
    try {
      const response = await axiosInstance.post('/users/create-user', user);
      setUsers([...users, response.data]); // Update users list with the new user
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Slice users to exclude the 0th index
  const displayedUsers = users.slice(1);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Manage Users</h2>
      {displayedUsers.length === 0 ? (
        <p>No users right now</p>
      ) : (
        <ul>
          {displayedUsers.map((user, index) => (
            <li key={index}>
              {user.username} - {user.email} - {user.address} - {user.accountNumber}  - {userAccountMap[user.id] || 'No account'}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          fetchUsers(); // Fetch users when button is clicked
          //setModalOpen(true);
        }}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        +
      </button>
      {/* <UserModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} addUser={handleCreateUser} /> */}
    </div>
  );
};

export default ManageUsers;
