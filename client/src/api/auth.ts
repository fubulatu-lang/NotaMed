import { config } from './config';

export const getAuthToken = (): string | null => {
  // Check if we have a stored token (e.g., in localStorage)
  const token = localStorage.getItem('access_token');
  return token || null;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
};

export const login = async (email: string, password: string) => {
  const res = await fetch(config.api.endpoints.auth.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  setAuthToken(data.access_token);
  return data;
};

export const register = async (email: string, password: string) => {
  const res = await fetch(config.api.endpoints.auth.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  const data = await res.json();
  setAuthToken(data.access_token);
  return data;
};

export const logout = () => {
  removeAuthToken();
};
