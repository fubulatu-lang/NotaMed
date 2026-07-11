import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api/auth';

interface User {
  id: number;
  email: string;
  fullName: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; fullName?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        const userData = await authService.getCurrentUser();
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          isActive: userData.is_active,
          isVerified: userData.is_verified,
          createdAt: userData.created_at,
          lastLogin: userData.last_login,
        });
      }
    } catch (error) {
      localStorage.removeItem('auth_tokens');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: { email: string; password: string }) => {
    await authService.login(credentials);
    await checkAuth();
  };

  const register = async (data: { email: string; password: string; fullName?: string }) => {
    await authService.register(data);
    await authService.login({ email: data.email, password: data.password });
    await checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('auth_tokens');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
