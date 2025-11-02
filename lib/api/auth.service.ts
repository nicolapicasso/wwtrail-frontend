// lib/api/auth.service.ts
import apiClient from './client';
import Cookies from 'js-cookie';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Guardar token y usuario en cookies
    Cookies.set(TOKEN_KEY, response.data.token, { expires: 7 }); // 7 días
    Cookies.set(USER_KEY, JSON.stringify(response.data.user), { expires: 7 });
    
    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Guardar token y usuario en cookies
    Cookies.set(TOKEN_KEY, response.data.token, { expires: 7 });
    Cookies.set(USER_KEY, JSON.stringify(response.data.user), { expires: 7 });
    
    return response.data;
  },

  // Logout
  logout(): void {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },

  // Obtener token
  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = Cookies.get(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Verificar token (opcional - llamada al backend)
  async verifyToken(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
