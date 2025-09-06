import apiClient from './apiClient';

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login user
const login = async (credentials) => {
  try {
    const response = await apiClient.post('/api/users/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Refresh token
const refreshToken = async () => {
  try {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const response = await apiClient.post('/api/users/refresh-token', { refreshToken: tokens.refreshToken });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Token refresh failed' };
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('tokens');
};

const authService = {
  login,
  refreshToken,
  logout
};

export default authService;