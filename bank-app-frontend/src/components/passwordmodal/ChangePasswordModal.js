import React, { useState, useEffect } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    if (!isOpen) {
      resetFields();
    }
  }, [isOpen]);

  const resetFields = () => {
    setOldPassword("");
    setNewPassword("");
    setPasswordError("");
    setNewPasswordError("");
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else {
      setNewPassword(value);
      validateNewPassword(value);
    }
  };

  const validateNewPassword = (password) => {
    if (password.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long.");
    } else if (!/\d/.test(password)) {
      setNewPasswordError("Password must contain at least one number.");
    } else if (!/[\W_]/.test(password)) {
      setNewPasswordError("Password must contain at least one special character.");
    } else {
      setNewPasswordError("");
    }
  };

  const validatePassword = () => {
    if (newPassword === oldPassword) {
      return "New password cannot be the same as the old password.";
    } else if (newPassword.length < 8) {
      return "Password must be at least 8 characters long.";
    } else if (!passwordRegex.test(newPassword)) {
      return "Password must contain at least one number and one special character.";
    }
    return "";
  };

  const handleSave = () => {
    const validationError = validatePassword();
    if (validationError) {
      setPasswordError(validationError);
    } else {
      onSave(oldPassword, newPassword, setPasswordError);
      resetFields();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Change Password"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <input
          type="password"
          name="oldPassword"
          className="border p-2 w-full mb-4"
          placeholder="Old Password"
          value={oldPassword}
          onChange={handleChange}
        />
        <input
          type="password"
          name="newPassword"
          className="border p-2 w-full mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={handleChange}
        />
        {newPasswordError && (
          <div className="text-red-500 mb-4">{newPasswordError}</div>
        )}
        {passwordError && (
          <div className="text-red-500 mb-4">{passwordError}</div>
        )}
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
