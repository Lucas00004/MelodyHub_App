import axios from 'axios';

const BASE_URL = "http://10.0.2.2:3000/api"; // ✅ Định nghĩa biến trước
// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để log requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor để log responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  },
);

export default api;
