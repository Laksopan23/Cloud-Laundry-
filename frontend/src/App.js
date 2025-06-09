import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/common/Dashboard';
import ForgotPassword from "./pages/forgotpassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import Invoice from './pages/orders/AddOrder';
import ViewOrders from './pages/orders/ViewOrders';

import Profile from './pages/profile/profile';
import SignUp from './pages/Auth/Employee/EmployeeSignup';
import Login from './pages/Auth/Employee/EmployeeLogin';


//Admin
import AllEmp from './admin/allEmployee';
import AdminDashboard from './admin/AdminDashboard';
import AdminSignUp from './pages/Auth/Admin/sign';
import AdminLogin from './pages/Auth/Admin/login';




function App() {
  // ProtectedRoute defined inside App.js
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('username');
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pass" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-success" element={<PasswordResetSuccess />} />

     {/* Protected routes */}
        
        {/* Admin routes */}
        <Route
          path="/all"
          element={
            <ProtectedRoute>
              <AllEmp />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/admin-signup"
          element={
            <ProtectedRoute>
              <AdminSignUp />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin-login"
          element={
            <ProtectedRoute>
              <AdminLogin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dash"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <ViewOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prof"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
