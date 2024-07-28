import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axiosInstance from "../../api/axiosConfig";

Modal.setAppElement("#root");

const UserModal = ({ isOpen, onRequestClose, onUserCreated }) => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setNewUser({
        username: "",
        password: "",
        email: "",
        address: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateUser = async () => {
    const { username, password, email, address } = newUser;
    const validationErrors = {};

    if (!username) validationErrors.username = "Username is required";
    if (!password) validationErrors.password = "Password is required";
    if (password.length > 0 && password.length < 6)
      validationErrors.password = "Password must be at least 6 characters long";
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      validationErrors.email = "Invalid email address";
    }
    if (!address) validationErrors.address = "Address is required";

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.get("/users/get-all-users");
        const users = response.data;

        const usernameExists = users.some((user) => user.username === username);
        if (usernameExists) {
          validationErrors.username = "Username is already taken";
        }

        const emailExists = users.some((user) => user.email === email);
        if (emailExists) {
          validationErrors.email = "Email is already in use";
        }

        if (Object.keys(validationErrors).length === 0) {
          try {
            const response = await axiosInstance.post(
              "/users/create-user",
              newUser
            );
            onUserCreated(response.data);
            onRequestClose();
          } catch (error) {
            console.error("Error creating user:", error);
          }
        } else {
          setErrors(validationErrors);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create New User"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-bold">Create New User</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={newUser.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCreateUser}
              className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm"
            >
              Create User
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

export default UserModal;
