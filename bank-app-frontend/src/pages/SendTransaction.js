import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig'; // Import your axios instance

const SendTransaction = () => {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userId = getUserId();
        if (!userId) throw new Error('User ID not found.');

        // Fetch account information
        const accountResponse = await axiosInstance.get(`/accounts/user/${userId}`);
        if (!accountResponse.data) throw new Error('Account not found for the current user.');

        const accountId = accountResponse.data.id;

        // Fetch balance using the accountId
        const balanceResponse = await axiosInstance.get(`/balances/account/${accountId}`);
        setCurrentBalance(balanceResponse.data.amount);
      } catch (err) {
        setError('Error fetching account balance.');
        console.error(err); // Log error for debugging
      }
    };

    fetchBalance();
  }, []);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!receiverAccountNumber || !description || !amount) {
        setError('Please fill in all fields.');
        return;
    }

    if (amount <= 0) {
        setError('Amount must be greater than zero.');
        return;
    }

    if (amount > currentBalance) {
        setError('Insufficient balance.');
        return;
    }

    const transactionDate = new Date(); // Current date in ISO format

    try {
        const userId = getUserId();
        if (!userId) throw new Error('User ID not found.');

        const senderAccountResponse = await axiosInstance.get(`/accounts/user/${userId}`);
        if (!senderAccountResponse.data) throw new Error('Sender account not found.');

        const senderAccountId = senderAccountResponse.data.id;

        const transactionResponse = await axiosInstance.post('/transactions/create-transaction', {
            account: { id: senderAccountId, accountNumber: receiverAccountNumber },
            receiver_account_number: receiverAccountNumber,
            description,
            amount,
            indicator: 'DB', // Debit for sender
            date: transactionDate // Add date to payload
        });

        if (transactionResponse.data) {
            setSuccess('Transaction successful!');
            setReceiverAccountNumber('');
            setDescription('');
            setAmount('');
            setCurrentBalance(currentBalance - parseFloat(amount)); // Update the current balance locally
        }
    } catch (err) {
        console.error(err); // Log error for debugging

        // Extract and set error message from the response if available
        const errorMessage = err.response && err.response.data ? err.response.data : 'Error processing transaction.';
        setError(errorMessage);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-2xl">
        <h2 className="text-2xl">Send Transaction</h2>
      </div>
      <div className="bg-white rounded-b-2xl shadow-md p-6 mt-4">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Current Balance:</label>
            <div className="text-gray-900 font-semibold">Rs {currentBalance !== null ? currentBalance.toFixed(2) : 'Loading...'}</div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Receiver Account Number:</label>
            <input
              type="text"
              value={receiverAccountNumber}
              onChange={(e) => setReceiverAccountNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount:</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendTransaction;
