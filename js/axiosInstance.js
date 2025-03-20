import axios from "axios";

const API_BASE_URL = "https://collegium-api-production.up.railway.app";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // تایم‌اوت ۱۰ ثانیه‌ای
  headers: { "Content-Type": "application/json" }
});

// export default axiosInstance;
window.axiosInstance = axiosInstance;