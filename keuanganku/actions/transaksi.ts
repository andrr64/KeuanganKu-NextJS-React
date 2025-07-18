import { API_ROUTES } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { TransaksiResponse } from '@/types/transaksi';

export interface TambahTransaksiParams {
  idKategori: string;
  idAkun: string;
  jumlah: number;
  tanggal: string; // Format: 'dd/MM/yyyy HH:mm'
  catatan?: string;
}

export interface AmbilTransaksiParams {
  startDate?: string;
  endDate?: string;
  jenis?: number;
  idAkun?: string;
  page?: number;
  size?: number;
  search?: string;
}

export interface DataGetTransaksi {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  content: TransaksiResponse[]
  success: boolean;
}

export async function tambahTransaksi(params: TambahTransaksiParams) {
  return fetcher(
    API_ROUTES.TRANSAKSI.TAMBAH,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idKategori: params.idKategori,
        idAkun: params.idAkun,
        jumlah: params.jumlah,
        tanggal: params.tanggal,
        catatan: params.catatan || undefined,
      }),
    }
  );
}

export async function ambilTransaksi(params: AmbilTransaksiParams) {
  const url = new URL(API_ROUTES.TRANSAKSI.FILTER);

  if (params.startDate) url.searchParams.set("startDate", params.startDate);
  if (params.endDate) url.searchParams.set("endDate", params.endDate);
  if (params.jenis) url.searchParams.set("jenis", String(params.jenis));
  if (params.idAkun) url.searchParams.set("idAkun", params.idAkun);
  if (params.page !== undefined) url.searchParams.set("page", String(params.page));
  if (params.size !== undefined) url.searchParams.set("size", String(params.size));
  if (params.search) url.searchParams.set("keyword", params.search);

  return fetcher<DataGetTransaksi | null>(url.toString(), {
    method: "GET"
  });
}
