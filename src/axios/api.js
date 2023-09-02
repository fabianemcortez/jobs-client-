import axios from "axios";

const api = axios.create({
  baseURL: "https://job-server.cyclic.cloud",
});

/* ...http://localhost:4000 -> quando em DEV */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
