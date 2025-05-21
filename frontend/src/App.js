import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/common/Dashboard';
import ForgotPassword from "./pages/forgotpassword";
import Invoice from './pages/orders/AddOrder';
import ViewOrders from './pages/orders/ViewOrders';
import Signup from './pages/SignupInitial';
import Signin from './pages/Signin';
import Profile from './pages/profile/profile';

// mock
import Mos from './mock/EmployeeSignup';
import Mol from './mock/EmployeeLogin';


//Admin
import AllEmp from './admin/allEmployee';
import AdminDashboard from './admin/AdminDashboard';


function App() {
  // ProtectedRoute defined inside App.js
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('username');
    return isAuthenticated ? children : <Navigate to="/mol" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Mol />} />
        <Route path="/mos" element={<Mos />} />
        <Route path="/pass" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sign" element={<Signin />} />


        {/* Admin routes */}
        <Route path="/all" element={<AllEmp />} />
        <Route path="/admin" element={<AdminDashboard />} />



        {/* Protected routes */}
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
