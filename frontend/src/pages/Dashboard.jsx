import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {user && (
        <div className="user-info">
          <h3>Welcome, {user.username}!</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
      <div className="dashboard-content">
        <p>This is a protected dashboard page that only authenticated users can access.</p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
