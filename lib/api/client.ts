// lib/api/client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ApiError } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Añadir token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Añadir idioma del usuario
    const language = Cookies.get('language') || 'es';
    if (config.headers) {
      config.headers['Accept-Language'] = language;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Error de red
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Error de conexión. Verifica tu conexión a internet.',
        statusCode: 0,
      });
    }

    // Error del servidor
    const apiError: ApiError = {
      message: error.response.data?.message || 'Error desconocido',
      statusCode: error.response.status,
      errors: error.response.data?.errors,
    };

    // Token expirado o inválido (401)
    if (error.response.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      
      // Redirigir a login solo si no estamos ya en login/register
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Forbidden (403)
    if (error.response.status === 403) {
      apiError.message = 'No tienes permisos para realizar esta acción';
    }

    // Not Found (404)
    if (error.response.status === 404) {
      apiError.message = 'Recurso no encontrado';
    }

    // Server Error (500)
    if (error.response.status >= 500) {
      apiError.message = 'Error del servidor. Inténtalo más tarde.';
    }

    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

export default apiClient;
