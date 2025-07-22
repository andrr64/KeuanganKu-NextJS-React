const API_BASE_URL = 'http://localhost:8080/api';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    UPDATE: `${API_BASE_URL}/secure/pengguna`,
    ME: `${API_BASE_URL}/secure/pengguna/detail-pengguna`
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
    FILTER: `${API_BASE_URL}/secure/kategori/filter`,
    POST: `${API_BASE_URL}/secure/kategori`,
    UPDATE: (idKategori: string) => `${API_BASE_URL}/secure/kategori/${idKategori}`
  },

  TRANSAKSI: {
    TAMBAH: `${API_BASE_URL}/secure/transaksi`,
    FILTER: `${API_BASE_URL}/secure/transaksi`,
    PUT: (id: string) => `${API_BASE_URL}/secure/transaksi/${id}`,
    GET_RECENT: `${API_BASE_URL}/secure/transaksi/recent`,
    DELETE: (id: string) => `${API_BASE_URL}/secure/transaksi/${id}`,
    GRAFIK_CASHFLOW: `${API_BASE_URL}/secure/transaksi/grafik-cashflow`,
    RINGKASAN: `${API_BASE_URL}/secure/transaksi/ringkasan`, 
  },
  DASHBOARD: {
    GET_RECENT_INFO: `${API_BASE_URL}/secure/dashboard`
  },
  GOAL: {
    POST: `${API_BASE_URL}/secure/goal`,
    GET: `${API_BASE_URL}/secure/goal/filter`,
    HAPUS: (id: string) => `${API_BASE_URL}/secure/goal/${id}`,
    PUT: (id: string) => `${API_BASE_URL}/secure/goal/${id}`,
    PUT_STATUS: (id: string) => `${API_BASE_URL}/secure/goal/${id}/set-status`,
    PUT_TAMBAH_UANG: (id: string) => `${API_BASE_URL}/secure/goal/${id}/tambah-uang`,
    PUT_KURANGI_UANG: (id: string) => `${API_BASE_URL}/secure/goal/${id}/kurangi-uang`,
    GET_V2: `${API_BASE_URL}/secure/goal/v2`,
  },
    STATISTIK: {
    KATEGORI_BULANAN: `${API_BASE_URL}/secure/transaksi/by-kategori-month`,
  },
};


// lib/handleApiAction.ts
import toast from 'react-hot-toast';

export interface ApiActionOptions<T> {
  action: () => Promise<{ success: boolean; message?: string; data?: T }>;
  onSuccess?: (data: T) => void;
  onFinally?: () => void;
  successMessage?: string;
}

export async function handleApiAction<T>({
  action,
  onSuccess,
  onFinally,
  successMessage,
}: ApiActionOptions<T>): Promise<T | null> {
  try {
    const response = await action();

    if (!response.success) throw new Error(response.message);

    if (successMessage) {
      toast.success(successMessage);
    }

    if (response.data !== undefined) {
      onSuccess?.(response.data);
      return response.data;
    } else {
      onSuccess?.(undefined as T); // fallback kalo data undefined
      return null;
    }
  } catch (e: any) {
    toast.error(`Error: ${e.message}`);
    return null;
  } finally {
    onFinally?.();
  }
}
