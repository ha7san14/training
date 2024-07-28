import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSearch,
} from "react-icons/ai";
import UserModal from "../../components/usermodals/UserModal";
import DeleteModal from "../../components/usermodals/DeleteModal";
import EditUserModal from "../../components/usermodals/EditUserModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userAccountMap, setUserAccountMap] = useState({});
  const [accountNumberMap, setAccountNumberMap] = useState({});
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-all-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get("/accounts/get-all-accounts");
      setAccounts(response.data);

      const userAccountIdMap = response.data.reduce((acc, account) => {
        acc[account.user.id] = account.id;
        return acc;
      }, {});

      const userAccountNumberMap = response.data.reduce((acc, account) => {
        acc[account.user.id] = account.accountNumber;
        return acc;
      }, {});

      setUserAccountMap(userAccountIdMap);
      setAccountNumberMap(userAccountNumberMap);
    } catch (error) {
      console.error(
        "Error fetching accounts:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAccounts();
  }, []);

  const handleCreateUser = async (user) => {
    try {
      const response = await axiosInstance.post("/users/create-user", user);
      setUsers([...users, response.data]);
      fetchUsers();
      await fetchAccounts();
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserToEdit(response.data);
      setEditModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching user details for edit:", error);
    }
  };
  const handleUpdateUser = async (user) => {
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, user);
      console.log(response);
      setUsers(users.map((u) => (u.id === user.id ? response.data : u)));
      fetchUsers();
      setEditModalIsOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const accountId = userAccountMap[userId];

      if (accountId) {
        await axiosInstance.delete(`/accounts/${accountId}`);

        setUsers(users.filter((user) => user.id !== userId));
        setDeleteModalIsOpen(false);
      } else {
        console.error("Account ID not found for user:", userId);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setUserToDelete(null);
  };

  const displayedUsers = users
    .slice(1)
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-2xl ">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Manage Users</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by username"
              className="w-full px-4 py-2 border rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: "black" }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AiOutlineSearch className="text-gray-500" />
            </div>
          </div>
          <button
            onClick={() => setModalIsOpen(true)}
            className="bg-green-500 text-white py-2 px-4"
          >
            Create New User
          </button>
        </div>
      </div>
      <div className="bg-white rounded-b-2xl shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/12 px-4 py-2 font-bold text-left ">Sr.</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">Username</th>
              <th className="w-3/12 px-4 py-2 font-bold text-left">Email</th>
              <th className="w-3/12 px-4 py-2 font-bold text-left">Address</th>
              <th className="w-2/12 px-4 py-2 font-bold text-left">
                Account Number
              </th>
              <th className="w-1/12 px-4 py-2 font-bold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users right now
                </td>
              </tr>
            ) : (
              displayedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                >
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.address}</td>
                  <td className="border px-4 py-2">
                    {accountNumberMap[user.id] || "No account"}
                  </td>
                  <td className="border px-4 py-2 flex justify-around">
                    <AiOutlineEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEditUser(user.id)}
                      size={24}
                    />
                    <AiOutlineDelete
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleOpenDeleteModal(user)}
                      size={24}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <UserModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onUserCreated={handleCreateUser}
      />
      {userToDelete && (
        <DeleteModal
          isOpen={deleteModalIsOpen}
          onRequestClose={handleCloseDeleteModal}
          onDelete={() => handleDeleteUser(userToDelete.id)}
          userName={userToDelete.username}
        />
      )}
      {userToEdit && (
        <EditUserModal
          isOpen={editModalIsOpen}
          onRequestClose={() => setEditModalIsOpen(false)}
          user={userToEdit}
          onUserUpdated={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;
