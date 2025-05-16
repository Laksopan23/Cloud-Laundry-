import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear localStorage items set during login
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserType');

    // Show logout success message
    alert('Logout successful');

    // Redirect to login page
    navigate('/mol');
  };

  return logout;
};

export default useLogout;