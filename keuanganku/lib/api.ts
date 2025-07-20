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
    FILTER: `${API_BASE_URL}/secure/kategori/filter`,
    POST: `${API_BASE_URL}/secure/kategori`,
    UPDATE: (idKategori: string) => `${API_BASE_URL}/secure/kategori/${idKategori}`
  },

  TRANSAKSI: {
    TAMBAH: `${API_BASE_URL}/secure/transaksi`,
    FILTER: `${API_BASE_URL}/secure/transaksi`,
    PUT: (id: string) => `${API_BASE_URL}/secure/transaksi/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/secure/transaksi/${id}`
  },
  GOAL: {
    POST: `${API_BASE_URL}/secure/goal`,
    GET: `${API_BASE_URL}/secure/goal/filter`,
    HAPUS: (id: string) => `${API_BASE_URL}/secure/goal/${id}`,
    PUT: (id: string) => `${API_BASE_URL}/secure/goal/${id}`,
    PUT_STATUS: (id: string) => `${API_BASE_URL}/secure/goal/${id}/set-status`,
    PUT_TAMBAH_UANG: (id: string) => `${API_BASE_URL}/secure/goal/${id}/tambah-uang`,
    PUT_KURANGI_UANG: (id: string) => `${API_BASE_URL}/secure/goal/${id}/kurangi-uang`
  }
};


// lib/handleApiAction.ts
import toast from 'react-hot-toast';

type ApiActionOptions = {
  action: () => Promise<any>;
  onSuccess?: () => void;
  onFinally?: () => void;
  successMessage?: string;
};

export async function handleApiAction({
  action,
  onSuccess,
  onFinally,
  successMessage,
}: ApiActionOptions) {
  try {
    const response = await action();
    if (!response.success) throw new Error(response.message);
    if (successMessage){
      toast.success(successMessage)
    };
    onSuccess?.();
  } catch (e: any) {
    toast.error(`Error: ${e.message}`);
  } finally {
    onFinally?.();
  }
}
