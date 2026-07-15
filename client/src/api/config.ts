export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://notamed-api.up.railway.app/api/v1";

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      formatting: {
        note: `${API_BASE_URL}/formatting/note`,
        templates: `${API_BASE_URL}/formatting/templates`,
      },
    },
  },
};