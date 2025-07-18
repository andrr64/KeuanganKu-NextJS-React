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
    HAPUS: (idAkun: string) => `${API_BASE_URL}/secure/akun/${idAkun}`, // DELETE
  },

  KATEGORI: {
    GET_PENGELUARAN: `${API_BASE_URL}/secure/kategori/1`,
    GET_PEMASUKAN: `${API_BASE_URL}/secure/kategori/2`,
    GET_ALLL: `${API_BASE_URL}/secure/kategori`,
    FILTERE: `${API_BASE_URL}/secure/kategori/filter`,
  },

  TRANSAKSI: {
    TAMBAH: `${API_BASE_URL}/secure/transaksi`,
    FILTER: `${API_BASE_URL}/secure/transaksi`
  }
};