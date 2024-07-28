import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig"; // Ensure this is correctly configured
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSearch,
} from "react-icons/ai";
import FilterModal from "../components/FilterModal"; // Import the date filter modal component
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles

const ManageBalance = () => {
  const [balances, setBalances] = useState([]);
  const [filteredBalances, setFilteredBalances] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountNumberMap, setAccountNumberMap] = useState({}); // Maps accountId to accountNumber
  const [usernameMap, setUsernameMap] = useState({}); // Maps accountId to username
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBalances = async () => {
    try {
      const response = await axiosInstance.get("/balances"); // Adjust the endpoint as necessary
      const sortedBalances = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
      setBalances(sortedBalances);
      setFilteredBalances(sortedBalances); // Initialize filteredBalances
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get("/accounts/get-all-accounts"); // Adjust endpoint
      setAccounts(response.data);

      // Create maps for accountId and accountNumber
      const accountNumberMap = response.data.reduce((acc, account) => {
        acc[account.id] = account.accountNumber; // Map accountId to accountNumber
        return acc;
      }, {});

      // Create a map for username using account data
      const usernameMap = response.data.reduce((acc, account) => {
        acc[account.id] = account.user.username; // Map accountId to username
        return acc;
      }, {});

      setAccountNumberMap(accountNumberMap);
      setUsernameMap(usernameMap);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchBalances();
    fetchAccounts();
  }, []);

  const handleDateChange = (date) => {
    setFilterDate(date);
    if (date) {
      const filtered = balances.filter((balance) => {
        const balanceDate = new Date(balance.date).setHours(0, 0, 0, 0);
        const selectedDate = date.setHours(0, 0, 0, 0);
        return balanceDate === selectedDate;
      });
      setFilteredBalances(filtered);
      setFilterModalIsOpen(false);
    }
  };

  const clearFilter = () => {
    setFilterDate(null);
    setFilteredBalances(balances);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredBalances(balances);
    } else {
      const filtered = balances.filter((balance) =>
        usernameMap[balance.account.id]
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setFilteredBalances(filtered);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Manage Balance</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-4 pr-10 py-2 rounded-2xl border border-gray-300"
              style={{ color: "black" }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AiOutlineSearch className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterModalIsOpen(true)}
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
      <div className="bg-white rounded-b-2xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/12 px-4 py-2 font-bold text-left">Sr.</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Username</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">
                Account Number
              </th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Date</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredBalances.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No balances right now
                </td>
              </tr>
            ) : (
              filteredBalances.map((balance, index) => (
                <tr
                  key={balance.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {usernameMap[balance.account.id] || "Unknown"}
                  </td>
                  <td className="border px-4 py-2">
                    {accountNumberMap[balance.account.id] || "Unknown"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(balance.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">Rs {balance.amount || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <FilterModal
        isOpen={filterModalIsOpen}
        onRequestClose={() => setFilterModalIsOpen(false)}
        filterDate={filterDate}
        handleDateChange={handleDateChange}
      />
    </div>
  );
};

export default ManageBalance;
