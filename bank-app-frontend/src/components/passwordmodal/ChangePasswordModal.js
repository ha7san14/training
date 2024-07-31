import React, { useState } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSave = () => {
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      onSave(newPassword);
      setNewPassword("");
      setPasswordError("");
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
          className="border p-2 w-full mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
