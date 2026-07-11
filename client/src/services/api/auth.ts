import { apiClient } from './client';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface UserResponse {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
}

class AuthService {
  async register(data: { email: string; password: string; fullName?: string }) {
    const response = await apiClient.post<UserResponse>('/auth/register', {
      email: data.email,
      password: data.password,
      full_name: data.fullName || null,
    });
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    // Store tokens
    localStorage.setItem('auth_tokens', JSON.stringify({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    }));
    
    return response;
  }

  async getCurrentUser() {
    return apiClient.get<UserResponse>('/auth/me');
  }

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    localStorage.setItem('auth_tokens', JSON.stringify({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    }));
    
    return response;
  }
}

export const authService = new AuthService();
