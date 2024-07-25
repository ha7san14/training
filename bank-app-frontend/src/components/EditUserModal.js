import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Ensure this import works after installation
import axiosInstance from '../api/axiosConfig';

Modal.setAppElement('#root');

const EditUserModal = ({ isOpen, onRequestClose, user, onUserUpdated }) => {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setUpdatedUser(user);
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateUser = async () => {
    const { username, email, address } = updatedUser;
    const validationErrors = {};

    if (!username) validationErrors.username = 'Username is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!address) validationErrors.address = 'Address is required';
    

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.put(`/users/${updatedUser.id}`, updatedUser);
        onUserUpdated(response.data);
        onRequestClose();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit User"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-bold">Edit User</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={updatedUser.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={updatedUser.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleUpdateUser}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditUserModal;
