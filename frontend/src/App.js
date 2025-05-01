import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from "./pages/forgotpassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pass" element={<ForgotPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
