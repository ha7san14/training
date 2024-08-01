import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import FilterModal from "../../components/filtermodal/FilterModal";

const ViewTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.id : null;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }

        const accountResponse = await axiosInstance.get(
          `/accounts/user/${userId}`
        );
        if (!accountResponse.data) {
          setError("Account not found for the current user.");
          setLoading(false);
          return;
        }

        const accountId = accountResponse.data.id;

        const transactionsResponse = await axiosInstance.get(
          `/transactions/account/${accountId}`
        );

        const sortedTransactions = transactionsResponse.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
        setLoading(false);
      } catch (err) {
        setError("Error fetching transactions.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleDateChange = (date) => {
    setFilterDate(date);
    if (date) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date).setHours(0, 0, 0, 0);
        const selectedDate = date.setHours(0, 0, 0, 0);
        return transactionDate === selectedDate;
      });
      setFilteredTransactions(filtered);
    }
    setShowModal(false);
  };

  const clearFilter = () => {
    setFilterDate(null);
    setFilteredTransactions(transactions);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Transaction History</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Filter by Date
            </button>
            <button
              onClick={clearFilter}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-b-2xl shadow-md overflow-hidden mt-4">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/12 px-4 py-2 font-bold text-left">Sr.</th>
              {/* <th className="w-2/12 px-4 py-2 font-bold text-left">Sender Account Number</th> */}
              <th className="w-2/12 px-4 py-2 font-bold text-left">
                Receiver Account Number
              </th>
              <th className="w-1/12 px-4 py-2 font-bold text-left">
                Indicator
              </th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Date</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">
                Description
              </th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No transactions right now
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  {/* <td className="border px-4 py-2">{transaction.senderAccountNumber}</td> */}
                  <td className="border px-4 py-2">
                    {transaction.receiverAccountNumber}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.indicator}
                    {transaction.indicator === "CR" ? (
                      <AiOutlineArrowUp className="inline ml-2 text-green-500" />
                    ) : transaction.indicator === "DB" ? (
                      <AiOutlineArrowDown className="inline ml-2 text-red-500" />
                    ) : null}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {transaction.description}
                  </td>
                  <td className="border px-4 py-2 flex items-center">
                    {transaction.amount}
                    {transaction.indicator === "CR" ? (
                      <AiOutlineArrowUp className="ml-2 text-green-500" />
                    ) : transaction.indicator === "DB" ? (
                      <AiOutlineArrowDown className="ml-2 text-red-500" />
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <FilterModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        filterDate={filterDate}
        handleDateChange={handleDateChange}
      />
    </div>
  );
};

export default ViewTransactionHistory;
