import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const Dashboard = lazy(() => import("./pages/common/Dashboard"));
const ForgotPassword = lazy(() => import("./pages/forgotpassword"));
const OTPVerification = lazy(() => import("./pages/OTPVerification"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PasswordResetSuccess = lazy(() => import("./pages/PasswordResetSuccess"));
const Invoice = lazy(() => import("./pages/orders/AddOrder"));
const ViewOrders = lazy(() => import("./pages/orders/ViewOrders"));

const Profile = lazy(() => import("./pages/profile/profile"));
const SignUp = lazy(() => import("./pages/Auth/Employee/EmployeeSignup"));
const Login = lazy(() => import("./pages/Auth/Employee/EmployeeLogin"));

//Admin
const AllEmp = lazy(() => import("./admin/allEmployee"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminSignUp = lazy(() => import("./pages/Auth/Admin/sign"));
const AdminLogin = lazy(() => import("./pages/Auth/Admin/login"));

function App() {
  // ProtectedRoute defined inside App.js
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("username");
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pass" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password-success"
            element={<PasswordResetSuccess />}
          />

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
      </Suspense>
    </Router>
  );
}

export default App;
