import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";

const SendTransaction = () => {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userId = getUserId();
        if (!userId) throw new Error("User ID not found.");

        const accountResponse = await axiosInstance.get(
          `/accounts/user/${userId}`
        );
        if (!accountResponse.data)
          throw new Error("Account not found for the current user.");

        const accountId = accountResponse.data.id;

        const balanceResponse = await axiosInstance.get(
          `/balances/account/${accountId}`
        );
        setCurrentBalance(balanceResponse.data.amount);
      } catch (err) {
        setError("Error fetching account balance.");
        console.error(err);
      }
    };

    fetchBalance();
  }, []);

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.id : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!receiverAccountNumber || !description || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (amount > currentBalance) {
      setError("Insufficient balance.");
      return;
    }

    const transactionDate = new Date();
    try {
      const userId = getUserId();
      if (!userId) throw new Error("User ID not found.");

      const senderAccountResponse = await axiosInstance.get(
        `/accounts/user/${userId}`
      );
      if (!senderAccountResponse.data)
        throw new Error("Sender account not found.");

      const senderAccountId = senderAccountResponse.data.id;

      const transactionResponse = await axiosInstance.post(
        "/transactions/create-transaction",
        {
          account: {
            id: senderAccountId,
            accountNumber: receiverAccountNumber,
          },
          receiver_account_number: receiverAccountNumber,
          description,
          amount,
          indicator: "DB",
          date: transactionDate,
        }
      );

      if (transactionResponse.data) {
        setSuccess("Transaction successful!");
        setError(null);
        setReceiverAccountNumber("");
        setDescription("");
        setAmount("");
        setCurrentBalance(currentBalance - parseFloat(amount));
      }
    } catch (err) {
      console.error(err);

      const errorMessage =
        err.response && err.response.data
          ? err.response.data
          : "Error processing transaction.";
      setError(errorMessage);
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Send Transaction</h1>
        <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
          <span className="font-bold">Current Balance:</span> <br></br>{" "}
          <span className="font-semibold">
            Rs{" "}
            {currentBalance !== null ? currentBalance.toFixed(2) : "Loading..."}
          </span>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div>
          <label
            htmlFor="receiver"
            className="block text-sm font-medium text-gray-700"
          >
            Receiver Account Number
          </label>
          <input
            id="receiver"
            type="text"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            placeholder="Enter receiver's account number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for the transaction"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="block w-full border border-gray-300 rounded sm:text-sm px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded-xl w-full"
        >
          Send Transaction
        </button>
      </form>
    </div>
  );
};

export default SendTransaction;
