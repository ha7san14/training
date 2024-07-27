import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageTransactions from './pages/ManageTransactions';
import ManageBalance from './pages/ManageBalance';
import SendTransaction from './pages/SendTransaction';
import ViewAccountInfo from './pages/ViewAccountInfo';
import ViewTransactionHistory from './pages/ViewTransactionHistory';

function App() {
  const token = localStorage.getItem('jwtToken');
  const role = localStorage.getItem('userRole');

  const ProtectedRoute = ({ children, roleRequired }) => {
    console.log(token,role);
    if (!token) {
      return <Navigate to="/" />;
    }
    if (role !== roleRequired) {
      return <Navigate to="/unauthorized" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute roleRequired="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-dashboard" element={
            <ProtectedRoute roleRequired="ACCOUNTHOLDER">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard/manage-users" element={<ManageUsers />} />
          <Route path="/admin-dashboard/manage-transactions" element={<ManageTransactions />} />
          <Route path="/admin-dashboard/manage-balance" element={<ManageBalance />} />
          {/* Add routes for user-specific pages */}
          <Route path="/user-dashboard/view-account-info" element={<ViewAccountInfo />} />
          <Route path="/user-dashboard/view-transaction-history" element={<ViewTransactionHistory />} />
          <Route path="/user-dashboard/send-transaction" element={<SendTransaction />} />
          <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
          <Route path="/" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
