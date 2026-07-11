import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '../../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Hardcoded backend URL - change this to your actual backend URL
    const BASE_URL = 'https://medivoice-bckend.vercel.app/api/v1';
    
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use(
      (config) => {
        const tokens = localStorage.getItem('auth_tokens');
        if (tokens) {
          try {
            const { accessToken } = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${accessToken}`;
          } catch (e) {
            // Invalid tokens in storage
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };

        if (error.response?.status === 401) {
          localStorage.removeItem('auth_tokens');
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File | Blob, fieldName = 'audio_file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
    
    return response.data;
  }
}

export const apiClient = new ApiClient();
