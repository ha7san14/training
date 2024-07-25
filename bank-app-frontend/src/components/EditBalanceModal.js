import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const EditBalanceModal = ({ isOpen, onRequestClose, balance, onBalanceUpdated }) => {
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      alert('Please enter a valid amount.');
      return;
    }

    const updatedBalance = {
      ...balance,
      amount: balance.amount + parsedAmount, // Adjust the amount correctly
    };

    onBalanceUpdated(updatedBalance);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Balance"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
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
