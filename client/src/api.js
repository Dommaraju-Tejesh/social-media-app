import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚫 Global banned-user handler
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.message === "Account banned"
    ) {
      window.location.href = "/banned";
    }

    return Promise.reject(error);
  },
);

export default api;
