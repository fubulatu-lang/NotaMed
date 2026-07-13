// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://notamed-api.up.railway.app/api/v1";

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        me: `${API_BASE_URL}/auth/me`,
        logout: `${API_BASE_URL}/auth/logout`,
      },
      recordings: {
        upload: `${API_BASE_URL}/recordings/audio`,
        status: `${API_BASE_URL}/recordings/status`,
        result: `${API_BASE_URL}/recordings/result`,
      },
      formatting: {
        note: `${API_BASE_URL}/formatting/note`,
        templates: `${API_BASE_URL}/formatting/templates`,
      },
      history: {
        list: `${API_BASE_URL}/history`,
        detail: `${API_BASE_URL}/history`,
      },
      health: `${API_BASE_URL}/health`,
    },
  },
};

export default config;
