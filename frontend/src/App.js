import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from "./pages/forgotpassword";
import Invoice from './pages/Invoice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pass" element={<ForgotPassword />} />
        <Route path="/invoice" element={<Invoice />} />

      </Routes>
    </Router>
  );
}

export default App;
