// import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// // API client configured for FastAPI backend
// const apiClient = axios.create({
//   baseURL: 'http://localhost:8000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // JWT Token interceptor - reads from localStorage
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling auth errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // Clear token and redirect to login
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth-specific request for form-urlencoded login
// export const authClient = axios.create({
//   baseURL: 'http://localhost:8000',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// });

// export default apiClient;
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:8000';

// 1. General API client (for Customers, Orders, etc.)
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
// apiClient.interceptors.request.use((config) => {
//   if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
//     config.url += '/';
//   } else if (config.url && config.url.includes('?') && !config.url.split('?')[0].endsWith('/')) {
//     // Adds slash before query params: /orders?a=1 becomes /orders/?a=1
//     const [path, query] = config.url.split('?');
//     config.url = `${path}/?${query}`;
//   }
//   return config;
// });
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 2. Auth-specific client
// We remove the hardcoded Content-Type here so individual requests 
// (Login vs Signup) can set their own.
export const authClient = axios.create({
  baseURL: BASE_URL,
});

export default apiClient;