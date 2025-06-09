import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from "./pages/forgotpassword";
import Invoice from './pages/orders/AddOrder';
import ViewOrders from './pages/orders/ViewOrders';
import Signup from './pages/auth/SignupInitial';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pass" element={<ForgotPassword />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/orders" element={<ViewOrders />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add more routes as needed */}

      </Routes>
    </Router>
  );
}

export default App;
