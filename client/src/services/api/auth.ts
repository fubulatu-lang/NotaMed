import { apiClient } from './client';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '../../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>('/auth/login', credentials);
  }

  async register(data: RegisterData): Promise<User> {
    return apiClient.post<User>('/auth/register', data);
  }

  async getCurrentUser(token: string): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken });
  }
}

export const authService = new AuthService();
