import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// ✅ HARDCODEADO - Ruta específica para API v2
// No depende de variables de entorno para evitar conflictos
const apiClientV2 = axios.create({
  baseURL: 'http://localhost:3001/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add token
apiClientV2.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClientV2.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          'http://localhost:3001/api/v1/auth/refresh',
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        // Save new token
        Cookies.set('accessToken', accessToken, {
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClientV2(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClientV2;