import axios from "axios";

const API = axios.create({
  baseURL: "https://swiftcart-backend-hu6y.onrender.com/api", // Make sure this matches your Spring Boot port!
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // ⚠️ IMPORTANT: It MUST have "Bearer " with a space!
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Only redirect if not already on login page to avoid loops
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;