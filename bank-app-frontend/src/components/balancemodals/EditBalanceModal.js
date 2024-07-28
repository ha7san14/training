import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosInstance from "../../api/axiosConfig";

Modal.setAppElement('#root');

const EditBalanceModal = ({ isOpen, onRequestClose, balance, onBalanceUpdated }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      alert('Please enter a valid amount.');
      return;
    }

    const updatedBalance = {
      ...balance,
      amount: balance.amount + parsedAmount, 
    };

    try {
      const response = await axiosInstance.put(`/balances/${balance.id}`, updatedBalance);
      onBalanceUpdated(response.data);
    } catch (error) {
      console.error("Error updating balance:", error);
      alert("Failed to update balance. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Balance"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg z-50">
        <h2 className="text-2xl mb-4 font-bold">Edit Balance</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">Balance Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 text-sm"
            placeholder='Please Enter the Balance Amount!'
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm"
          >
            Save
          </button>
          <button
            onClick={onRequestClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBalanceModal;
