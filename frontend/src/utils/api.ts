import axios from "axios";

let rawBaseUrl = import.meta.env.VITE_API_URL || "/api";
if (rawBaseUrl.startsWith("http") && !rawBaseUrl.match(/\/api\/?$/)) {
  rawBaseUrl = rawBaseUrl.endsWith("/") ? `${rawBaseUrl}api` : `${rawBaseUrl}/api`;
}

const api = axios.create({
  baseURL: rawBaseUrl,
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eaglesync_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We will setup response interceptor inside AuthContext to trigger logout on 401
export default api;
