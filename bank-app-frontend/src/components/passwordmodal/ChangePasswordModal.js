import React, { useState } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

const ChangePasswordModal = ({ isOpen, onClose, onSave, currentPassword }) => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleSave = () => {
    if (newPassword === currentPassword) {
      setPasswordError("New password cannot be the same as the current password.");
    } else if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!passwordRegex.test(newPassword)) {
      setPasswordError("Password must contain at least one number and one special character.");
    } else {
      onSave(newPassword);
      setNewPassword("");
      setPasswordError("");
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setPasswordError(
      value === currentPassword
        ? "New password cannot be the same as the current password."
        : value.length < 8
        ? "Password must be at least 8 characters long."
        : !passwordRegex.test(value)
        ? "Password must contain at least one number and one special character."
        : ""
    );
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
          className="border p-2 w-full mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={handleChange}
        />
        {passwordError && <div className="text-red-500 mb-4">{passwordError}</div>}
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
