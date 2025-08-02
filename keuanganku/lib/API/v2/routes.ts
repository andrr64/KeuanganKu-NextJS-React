const IP = 'localhost:8080';
const protocol = 'http';
const BASE = `${protocol}://${IP}/api`;

const makeSecureRoute = (route: string) => `${BASE}/secure/${route}`;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
    LOGOUT: `${BASE}/auth/logout`,
  },

  KATEGORI: {
    BASE: makeSecureRoute('kategori'),
    BY_ID: (id: string) => makeSecureRoute(`kategori/${id}`),
  },

  TRANSAKSI: {
    BASE: makeSecureRoute('transaksi'),
    BY_ID: (id: string) => makeSecureRoute(`transaksi/${id}`),
    RECENT: makeSecureRoute('transaksi/data-terbaru'),
  },

  STATISTIK: {
    CASHFLOW: makeSecureRoute('statistik/data-cashflow-terhadap-waktu'),
    KATEGORI: makeSecureRoute('statistik/data-transaksi-terhadap-kategori'),
    RINGKASAN_BULAN_INI: makeSecureRoute('statistik/data-ringkasan-bulan-ini'),
  },

  PENGGUNA: {
    ME: makeSecureRoute('pengguna/me'),
    UPDATE: makeSecureRoute('pengguna'),
  },

  GOAL: {
    BASE: makeSecureRoute('goal'),
    BY_ID: (id: string) => makeSecureRoute(`goal/${id}`),
    PATCH: (id: string, action: string) => makeSecureRoute(`goal/${id}`) + `?action=${action}`,
  },

  AKUN: {
    BASE: makeSecureRoute('akun'),
    UPDATE_NAMA: (id: string) => makeSecureRoute(`akun/update-nama/${id}`),
    DELETE: (id: string) => makeSecureRoute(`akun/${id}`),
  },
};
