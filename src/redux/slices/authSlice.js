import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Load state from localStorage if available
const loadState = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    const serializedTokens = localStorage.getItem('tokens');
    
    if (serializedUser && serializedTokens) {
      const user = JSON.parse(serializedUser);
      const tokens = JSON.parse(serializedTokens);
      return {
        ...initialState,
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true
      };
    }
  } catch (err) {
    console.error('Error loading auth state from localStorage:', err);
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadState(),
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('tokens', JSON.stringify({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      }));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
      
      // Reset state
      return initialState;
    },
    refreshTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      // Update localStorage
      const tokens = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
      localStorage.setItem('tokens', JSON.stringify(tokens));
    }
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout,
  refreshTokens 
} = authSlice.actions;

export default authSlice.reducer;