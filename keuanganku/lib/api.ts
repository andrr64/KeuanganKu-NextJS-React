const API_BASE_URL = 'http://localhost:8080/api';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  // tambahin lainnya kalau perlu
};