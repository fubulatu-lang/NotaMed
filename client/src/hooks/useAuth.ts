import { useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, login, register, logout } from '../api/auth';

interface User {
  id: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Optionally validate token with backend
      // For now, we'll just set a mock user or fetch user info
      setUser({ id: '1', email: 'user@example.com' }); // Replace with actual user fetch
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await login(email, password);
    setUser({ id: data.user_id, email });
    return data;
  };

  const signUp = async (email: string, password: string) => {
    const data = await register(email, password);
    setUser({ id: data.user_id, email });
    return data;
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return { user, loading, signIn, signUp, signOut };
};
