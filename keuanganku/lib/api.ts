const API_BASE_URL = 'http://localhost:8080/api';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  AKUN: {
    TAMBAH: `${API_BASE_URL}/secure/akun`, // POST
    GET_SEMUA: `${API_BASE_URL}/secure/akun`, // GET
    UPDATE_NAMA: (idAkun: string) => `${API_BASE_URL}/secure/akun/update-nama/${idAkun}`, // PUT
    HAPUS:(idAkun: string) => `${API_BASE_URL}/secure/akun/${idAkun}`, // DELETE
  },
};