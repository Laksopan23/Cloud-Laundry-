import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/common/Dashboard';
import ForgotPassword from "./pages/forgotpassword";
import Invoice from './pages/orders/AddOrder';
import ViewOrders from './pages/orders/ViewOrders';
import Signup from './pages/SignupInitial';

// mock
import Mos from './mock/EmployeeSignup';
import Mol from './mock/EmployeeLogin';

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
        <Route path="/mol" element={<Mol />} />
        <Route path="/mos" element={<Mos />} />
        <Route path="/pass" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
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
      </Routes>
    </Router>
  );
}

export default App;
