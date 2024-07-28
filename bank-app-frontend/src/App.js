import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTransactions from "./pages/admin/ManageTransactions";
import ManageBalance from "./pages/admin/ManageBalance";
import SendTransaction from "./pages/user/SendTransaction";
import ViewAccountInfo from "./pages/user/ViewAccountInfo";
import ViewTransactionHistory from "./pages/user/ViewTransactionHistory";
import bgImage from "./assets/bg.png";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Unauthorized</h1>
        <p className="text-xl">
          You do not have permission to view this page. Please contact your
          administrator for access.
        </p>
      </div>
    </div>
  );
};
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
      <div className="App relative">
        <div
          className="absolute inset-0 h-screen w-screen bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="relative z-10">
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
              element={
                <ProtectedRoute roleRequired="ADMIN">
                  <ManageTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/manage-balance"
              element={
                <ProtectedRoute roleRequired="ADMIN">
                  <ManageBalance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard/view-account-info"
              element={
                <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                  <ViewAccountInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard/view-transaction-history"
              element={
                <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                  <ViewTransactionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard/send-transaction"
              element={
                <ProtectedRoute roleRequired="ACCOUNTHOLDER">
                  <SendTransaction />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
