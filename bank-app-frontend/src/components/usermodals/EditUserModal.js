import React, { useState, useEffect } from "react";
import Modal from "react-modal"; 
import axiosInstance from "../../api/axiosConfig";

Modal.setAppElement("#root");

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

    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const validationErrors = { ...errors };

    if (name === "email") {
      if (!value) {
        validationErrors.email = "Email is required";
      } else if (!isValidEmail(value)) {
        validationErrors.email = "Invalid email address";
      } else {
        delete validationErrors.email; 
      }
    }

    if (name === "username") {
      if (!value) {
        validationErrors.username = "Username is required";
      } else {
        delete validationErrors.username; 
      }
    }

    if (name === "address") {
      if (!value) {
        validationErrors.address = "Address is required";
      } else {
        delete validationErrors.address; 
      }
    }

    setErrors(validationErrors);
  };

  const checkUserExistence = async (name, value) => {
    if (value === user[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", 
      }));
      return;
    }

    try {
      const response = await axiosInstance.get("/users/get-all-users");
      const users = response.data;

      if (name === "email") {
        const emailExists = users.some((existingUser) => existingUser.email === value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: emailExists ? "Email is already in use" : "", 
        }));
      } else if (name === "username") {
        const usernameExists = users.some((existingUser) => existingUser.username === value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: usernameExists ? "Username is already taken" : "", 
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "username") {
      checkUserExistence(name, value);
    }
  };

  const handleUpdateUser = async () => {
    const { username, email, address } = updatedUser;
    const validationErrors = {};

    if (!username) validationErrors.username = "Username is required";
    if (!email) validationErrors.email = "Email is required";
    if (!address) validationErrors.address = "Address is required";

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.put(
          `/users/${updatedUser.id}`,
          updatedUser
        );
        onUserUpdated(response.data);
        onRequestClose();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit User"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-bold">Edit User</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={updatedUser.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={updatedUser.address}
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
              onClick={handleUpdateUser}
              className="bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm"
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
