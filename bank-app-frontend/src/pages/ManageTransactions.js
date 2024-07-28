import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig'; // Use axiosInstance for consistent API calls
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineSearch } from 'react-icons/ai'; // Import arrow icons
import FilterModal from '../components/FilterModal';

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountMap, setAccountMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions');
      const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort transactions by date descending
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users/get-all-users');
      setUsers(response.data);

      const userMap = response.data.reduce((acc, user) => {
        acc[user.id] = user.username;
        return acc;
      }, {});
      setUserMap(userMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get('/accounts/get-all-accounts');
      setAccounts(response.data);

      const accountMap = response.data.reduce((acc, account) => {
        acc[account.id] = {
          accountNumber: account.accountNumber,
          userId: account.user.id
        };
        return acc;
      }, {});
      setAccountMap(accountMap);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
    fetchAccounts();
  }, []);

  const handleDateChange = date => {
    setFilterDate(date);
    if (date) {
      const filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date).setHours(0, 0, 0, 0);
        const selectedDate = date.setHours(0, 0, 0, 0);
        return transactionDate === selectedDate;
      });
      setFilteredTransactions(filtered);
    }else{
      setFilteredTransactions(transactions);
    }
    setShowModal(false);
  };

  const clearFilter = () => {
    setFilterDate(null);
    setFilteredTransactions(transactions);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((transaction) => {
        const account = accountMap[transaction.account.id];
        const username = account ? userMap[account.userId] : 'Unknown';
        return username.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setFilteredTransactions(filtered);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-2xl ">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Manage Transactions</h2>
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
      <div className="bg-white rounded-b-2xl shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/12 px-4 py-2 font-bold text-left">Sr.</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Username</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Sender Account Number</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Receiver Account Number</th>
              <th className="w-1/12 px-4 py-2 font-bold text-left">Indicator</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Date</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Description</th>
              <th className="w-1/12 px-4 py-2 font-bold text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">No transactions right now</td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => {
                const account = accountMap[transaction.account.id];
                const username = account ? userMap[account.userId] : 'Unknown';
                return (
                  <tr key={transaction.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2">{username}</td>
                    <td className="border px-4 py-2">{account ? account.accountNumber : 'Unknown'}</td>
                    <td className="border px-4 py-2">{transaction.receiver_account_number}</td>
                    <td className="border px-4 py-2">{transaction.indicator}</td>
                    <td className="border px-4 py-2">{transaction.date}</td>
                    <td className="border px-4 py-2">{transaction.description}</td>
                    <td className="border px-4 py-2 flex items-center">
                      Rs {transaction.amount}
                      {transaction.indicator === 'CR' ? (
                        <AiOutlineArrowUp className="ml-2 text-green-500" />
                      ) : transaction.indicator === 'DB' ? (
                        <AiOutlineArrowDown className="ml-2 text-red-500" />
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Date Picker */}
      <FilterModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        filterDate={filterDate}
        handleDateChange={handleDateChange}
      />
    </div>
  );
};

export default ManageTransactions;
