// ViewAccountInfo.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const ViewAccountInfo = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [error, setError] = useState(null);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setError('User ID not found.');
          return;
        }

        // Fetch account information
        const accountResponse = await axiosInstance.get(`/accounts/user/${userId}`);
        if (accountResponse.data) {
          setAccountInfo(accountResponse.data);

          // Fetch balance information using the accountId from accountInfo
          const accountId = accountResponse.data.id;
          const balanceResponse = await axiosInstance.get(`/balances/account/${accountId}`);
          setBalanceInfo(balanceResponse.data);
        } else {
          setError('Account not found for the current user.');
        }
      } catch (err) {
        setError('Error fetching account information.');
      }
    };

    fetchAccountInfo();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!accountInfo || !balanceInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Account Information</h2>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 w-1/3">Username:</span>
              <span className="text-gray-900">{accountInfo.user.username}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 w-1/3">Email:</span>
              <span className="text-gray-900">{accountInfo.user.email}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 w-1/3">Address:</span>
              <span className="text-gray-900">{accountInfo.user.address}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 w-1/3">Account Number:</span>
              <span className="text-gray-900">{accountInfo.accountNumber}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 w-1/3">Balance:</span>
              <span className="text-gray-900">{balanceInfo.amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAccountInfo;
