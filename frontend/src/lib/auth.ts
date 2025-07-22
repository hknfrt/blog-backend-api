import { apiClient } from './api';
import { AuthResponse, LoginData, RegisterData, User } from '@/types';

export const authApi = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<{ user: User; message: string }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};