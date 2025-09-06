import axios from "axios";

// Use environment variables for configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Optional: Set a timeout for mobile network conditions
});

// Log environment in development mode only
if (import.meta.env.DEV) {
  console.log(`API Client initialized with baseURL: ${apiClient.defaults.baseURL}`);
}

export default apiClient;