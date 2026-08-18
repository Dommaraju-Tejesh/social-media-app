import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://social-media-server-qki3.onrender.com/api",
  withCredentials: true,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global response handler
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // JWT expired / invalid / unauthorized
    if (status === 401) {
      console.log("Session expired. Redirecting to login...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Prevent redirect loop if already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Banned user
    if (status === 403 && message === "Account banned") {
      window.location.href = "/banned";
    }

    return Promise.reject(error);
  }
);

export default api;