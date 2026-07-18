// client/src/services/api/client.ts

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Build base URL from environment, with a fallback to relative path.
// In Vite, import.meta.env.VITE_API_URL is available.
const BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor to add auth token if needed
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // You can add an auth token here if required
        // const token = localStorage.getItem('authToken');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        // Log error or show global toast
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Expose HTTP methods
  async get<T = any>(url: string, config = {}): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data = {}, config = {}): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data = {}, config = {}): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T = any>(url: string, config = {}): Promise<T> {
    return this.client.delete(url, config);
  }

  // For direct axios instance access (if needed)
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
