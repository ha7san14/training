import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/LoginNavbar";
import CryptoJS from "crypto-js";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    let hashedPassword = password
    if(username!== "admin"){
      hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    }
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          username,
          password: hashedPassword,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userRole", user.roles);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.roles === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (user.roles === "ACCOUNTHOLDER") {
        navigate("/user-dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "Incorrect username or password!"
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex justify-center items-center flex-grow">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl">
          <div className="bg-gray-800 text-white py-2 rounded-t-md">
            <h1 className="text-2xl font-bold text-center">Login</h1>
          </div>
          <div className="p-6">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={username}
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-md shadow-sm hover:bg-primary-dark"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
