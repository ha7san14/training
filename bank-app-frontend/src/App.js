import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageTransactions from "./pages/ManageTransactions";
import ManageBalance from "./pages/ManageBalance";
import SendTransaction from "./pages/SendTransaction";
import ViewAccountInfo from "./pages/ViewAccountInfo";
import ViewTransactionHistory from "./pages/ViewTransactionHistory";

function App() {
  const ProtectedRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("userRole");
    console.log(token, role);
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
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roleRequired="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/manage-users"
            element={
              <ProtectedRoute roleRequired="ADMIN">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/manage-transactions"
            element={ <ProtectedRoute roleRequired="ADMIN">
                <ManageTransactions />
              </ProtectedRoute>}
          />
          <Route
            path="/admin-dashboard/manage-balance"
            element={ <ProtectedRoute roleRequired="ADMIN">
                <ManageBalance />
              </ProtectedRoute>}
          />
          <Route
            path="/user-dashboard/view-account-info"
            element={ <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                <ViewAccountInfo />
              </ProtectedRoute>}
          />
          <Route
            path="/user-dashboard/view-transaction-history"
            element={ <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                <ViewTransactionHistory />
              </ProtectedRoute>}
          />
          <Route
            path="/user-dashboard/send-transaction"
            element={ <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                <SendTransaction />
              </ProtectedRoute>}
          />
          <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
          <Route path="/" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
