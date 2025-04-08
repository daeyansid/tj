// Authentication utility functions

// Save token to local storage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Get token from local storage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};
