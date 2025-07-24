import { makeSecureRoute } from "./routeBuilder";

const API_BASE_URL = 'http://localhost:8080/api';

// builder per modul
const akun_route = makeSecureRoute('akun');
const kategori_route = makeSecureRoute('kategori');
const transaksi_route = makeSecureRoute('transaksi');
const statistik_route = makeSecureRoute('statistik');
const goal_route = makeSecureRoute('goal');
const dashboard_route = makeSecureRoute('dashboard');
const pengguna_route = makeSecureRoute('pengguna');

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    UPDATE: pengguna_route(),
    ME: pengguna_route('me'),
  },

  AKUN: {
    BASE: akun_route(),
    POST: akun_route(),
    GET: akun_route(),
    UPDATE_NAMA: (id: string) => akun_route(`update-nama/${id}`),
    HAPUS: (id: string) => akun_route(id),
  },

  KATEGORI: {
    BASE: kategori_route(),
    GET_ALL: kategori_route(),
    POST: kategori_route(),
    GET_PENGELUARAN: kategori_route('1'),
    GET_PEMASUKAN: kategori_route('2'),
    UPDATE: (id: string) => kategori_route(id),
  },

  TRANSAKSI: {
    BASE: transaksi_route(),
    TAMBAH: transaksi_route(),
    FILTER: transaksi_route(),
    UPDATE: (id: string) => transaksi_route(id),
    DELETE: (id: string) => transaksi_route(id),
    GET_DATA_TERBARU: transaksi_route('data-terbaru'),
    GRAFIK_CASHFLOW: transaksi_route('grafik-cashflow'),
  },

  STATISTIK: {
    TRANSAKSI_PER_KATEGORI: statistik_route('data-transaksi-terhadap-kategori'),
    RINGKASAN_BULAN_INI: statistik_route('data-ringkasan-bulan-ini'),
    CASHFLOW_PER_WAKTU: statistik_route('data-cashflow-terhadap-waktu'),
  },

  DASHBOARD: {
    GET_RECENT_INFO: dashboard_route(),
  },

  GOAL: {
    BASE: goal_route(),
    POST: goal_route(),
    GET: goal_route('filter'),
    GET_V2: goal_route('v2'),
    HAPUS: (id: string) => goal_route(id),
    PUT: (id: string) => goal_route(id),
    SET_STATUS: (id: string) => goal_route(`${id}/set-status`),
    TAMBAH_UANG: (id: string) => goal_route(`${id}/tambah-uang`),
    KURANGI_UANG: (id: string) => goal_route(`${id}/kurangi-uang`),
  },
};
