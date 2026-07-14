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
      formatting: {
        note: `${API_BASE_URL}/formatting/note`,
        templates: `${API_BASE_URL}/formatting/templates`,
      },
      notes: {
        list: `${API_BASE_URL}/notes`,
        create: `${API_BASE_URL}/notes`,
        get: (id: string) => `${API_BASE_URL}/notes/${id}`,
        update: (id: string) => `${API_BASE_URL}/notes/${id}`,
        delete: (id: string) => `${API_BASE_URL}/notes/${id}`,
      },
    },
  },
};
