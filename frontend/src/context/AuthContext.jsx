import { createContext, useState, useEffect, useContext } from 'react';
import { saveToken, removeToken, getToken, isAuthenticated } from '../utils/authUtils';
import { loginUser, registerUser, getUserProfile } from '../utils/api';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          // If token is invalid, remove it
          removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      saveToken(data.access_token);
      const userData = await getUserProfile();
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setError(null);
    try {
      await registerUser(username, email, password);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
