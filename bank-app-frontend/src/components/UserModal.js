// import React, { useState } from 'react';
// import axiosInstance from '../api/axiosConfig'; // Import axiosInstance
// import { Dialog } from '@headlessui/react';

// const UserModal = ({ isOpen, onClose, addUser }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');


//   const createUser = async () => {
//     const user = { username, password, email, address };
//     try {
//       const response = await axiosInstance.post('/users/create-user', user);
//       addUser(response.data); // Add new user to the list
//       onClose();
//     } catch (error) {
//       console.error('Error creating user:', error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen">
//         <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
//         <div className="bg-white p-6 rounded shadow-lg z-20">
//           <Dialog.Title>Create User</Dialog.Title>
//           <div className="mt-4">
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full mb-2 p-2 border"
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mb-2 p-2 border"
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mb-2 p-2 border"
//             />
//             <input
//               type="text"
//               placeholder="Address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               className="w-full mb-2 p-2 border"
//             />
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={onClose}
//               className="mr-2 p-2 bg-gray-500 text-white rounded"
//             >
//               Close
//             </button>
//             <button
//               onClick={createUser}
//               className="p-2 bg-green-500 text-white rounded"
//             >
//               Create User
//             </button>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default UserModal;
