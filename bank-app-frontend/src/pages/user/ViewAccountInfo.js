import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import ChangePasswordModal from "../../components/passwordmodal/ChangePasswordModal";
import { AiOutlineCheck } from "react-icons/ai";

const ViewAccountInfo = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.id : null;
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setError("User ID not found.");
          return;
        }

        const accountResponse = await axiosInstance.get(`/accounts/user/${userId}`);
        if (accountResponse.data) {
          setAccountInfo(accountResponse.data);
          const accountId = accountResponse.data.id;
          const balanceResponse = await axiosInstance.get(`/balances/account/${accountId}`);
          setBalanceInfo(balanceResponse.data);
        } else {
          setError("Account not found for the current user.");
        }
      } catch (err) {
        setError("Error fetching account information.");
      }
    };

    fetchAccountInfo();
  }, []);

  const handlePasswordChange = async (newPassword) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found.");
      }

      await axiosInstance.put(`/users/update-password/${userId}`, null, {
        params: {
          newPassword: newPassword
        }
      });

      setIsModalOpen(false);
      setSuccessMessage("Password updated successfully");
      // Optionally, clear the message after a few seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating password.", err);
      setError("Error updating password.");
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!accountInfo || !balanceInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-2 border-b pb-4 bg-gray-800 text-white rounded-t-lg">
          <div className="h-16 w-16 rounded-full mt-4 bg-gray-300 flex items-center justify-center">
            <span className="text-2xl">
              {accountInfo.user.username.charAt(0)}
            </span>
          </div>
          <div className="text-center">
            <div className="font-medium">{accountInfo.user.username}</div>
            <div className="text-gray-400">{accountInfo.user.email}</div>
          </div>
        </div>
        <div className="grid gap-4 p-6">
          <div className="grid gap-1">
            <label htmlFor="address" className="font-semibold text-gray-700">
              Address
            </label>
            <div className="text-gray-900">{accountInfo.user.address}</div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="account-number" className="font-semibold text-gray-700">
              Account Number
            </label>
            <div className="text-gray-900">{accountInfo.accountNumber}</div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="balance" className="font-semibold text-gray-700">
              Current Balance
            </label>
            <div className="text-gray-900">Rs {balanceInfo.amount}</div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </button>
        </div>
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <AiOutlineCheck className="text-xl mr-2" />
            {successMessage}
          </div>
        )}
      </div>
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handlePasswordChange}
      />
    </div>
  );
};

export default ViewAccountInfo;
