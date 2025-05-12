import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from "./pages/forgotpassword";
import Invoice from './pages/orders/AddOrder';
import ViewOrders from './pages/orders/ViewOrders';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pass" element={<ForgotPassword />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/orders" element={<ViewOrders />} />

      </Routes>
    </Router>
  );
}

export default App;
