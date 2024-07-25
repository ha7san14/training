import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure you have axios installed

const ViewAccountInfo = () => {
  const [userData, setUserData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user ID from local storage or other state management
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`/api/users/${userId}`);
        setUserData(userResponse.data);

        // Fetch account details using user ID
        const accountResponse = await axios.get(`/api/accounts/user/${userId}`);
        setAccountData(accountResponse.data);

        // Fetch balance details using account ID
        if (accountResponse.data) {
          const balanceResponse = await axios.get(`/api/balances/${accountResponse.data.id}`);
          setBalanceData(balanceResponse.data);
        }

        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Account Information</h2>
      {userData && accountData && balanceData ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <strong>Username:</strong> {userData.username}
          </div>
          <div className="mb-4">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="mb-4">
            <strong>Account Number:</strong> {accountData.accountNumber}
          </div>
          <div className="mb-4">
            <strong>Balance Amount:</strong> ${balanceData.amount}
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default ViewAccountInfo;
