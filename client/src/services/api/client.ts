// client/src/services/api/client.ts

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://notamed-api.up.railway.app/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => config,
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

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

  async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  }

  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
