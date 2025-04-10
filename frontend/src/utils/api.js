import axios from 'axios';
import { getToken } from './authUtils';

// Create an axios instance with base URL
const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const loginUser = async (email, password) => {
  try {
    // Use URLSearchParams to create form-encoded data
    const formData = new URLSearchParams();
    // The backend expects 'username' for OAuth2 compatibility, even though it's an email
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch user profile');
  }
};

// Account API calls
export const getAccounts = async () => {
  try {
    const response = await api.get('/accounts');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch accounts');
  }
};

export const getAccount = async (id) => {
  try {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch account');
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await api.post('/accounts', accountData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create account');
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update account');
  }
};

export const deleteAccount = async (id) => {
  try {
    await api.delete(`/accounts/${id}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete account');
  }
};

// Trading Plan API calls
export const getTradingPlans = async () => {
  try {
    const response = await api.get('/trading-plans');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch trading plans');
  }
};

export const getTradingPlan = async (id) => {
  try {
    const response = await api.get(`/trading-plans/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch trading plan');
  }
};

export const createTradingPlan = async (planData) => {
  try {
    const response = await api.post('/trading-plans', planData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create trading plan');
  }
};

export const updateTradingPlan = async (id, planData) => {
  try {
    const response = await api.put(`/trading-plans/${id}`, planData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update trading plan');
  }
};

export const deleteTradingPlan = async (id) => {
  try {
    await api.delete(`/trading-plans/${id}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete trading plan');
  }
};

export const toggleTradingPlanStatus = async (id) => {
  try {
    const response = await api.patch(`/trading-plans/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to toggle trading plan status');
  }
};

// Trading Daily Book API calls
export const getTradingDailyBooks = async () => {
  try {
    const response = await api.get('/trading-daily-books');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch trading daily books');
  }
};

export const getTradingDailyBook = async (id) => {
  try {
    const response = await api.get(`/trading-daily-books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch trading daily book');
  }
};

export const getAccountsWithBalance = async () => {
  try {
    const response = await api.get('/trading-daily-books/accounts');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch accounts');
  }
};

export const createTradingDailyBook = async (bookData) => {
  try {
    const response = await api.post('/trading-daily-books', bookData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create trading daily book');
  }
};

export const updateTradingDailyBook = async (id, bookData) => {
  try {
    const response = await api.put(`/trading-daily-books/${id}`, bookData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update trading daily book');
  }
};

export const deleteTradingDailyBook = async (id) => {
  try {
    await api.delete(`/trading-daily-books/${id}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete trading daily book');
  }
};

export default api;
