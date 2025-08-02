import { API_ROUTES } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { TransaksiResponse } from '@/types/transaksi';

export interface TambahTransaksiParams {
  idKategori: string;
  idAkun: string;
  jumlah: number;
  tanggal: string; 
  catatan?: string;
}

export type RingkasanKategoriResponse = {
  pengeluaran: RingkasanKategoriItem[];
  pemasukan: RingkasanKategoriItem[];
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

export type EditTransaksiParams = {
  id: string;
  idKategori: string;
  idAkun: string;
  jumlah: number;
  tanggal: string;
  catatan?: string;
};

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

export async function updateTransaksi(params: EditTransaksiParams) {
  const { id, ...body } = params;

  return fetcher(API_ROUTES.TRANSAKSI.PUT(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function deleteTransaksi(data: TransaksiResponse) {
  const { id } = data;
  return fetcher(API_ROUTES.TRANSAKSI.DELETE(id), {
    method: 'DELETE'
  })
}

export async function ambilRecentTransaksi() {
  return fetcher<TransaksiResponse[]>(
    API_ROUTES.TRANSAKSI.GET_DATA_TERBARU, {
    method: 'GET'
  }
  )
}

export interface RingkasanKategoriItem {
  label: string;
  value: number;
}


export async function getRingkasan(periode: number) {
  const url = `${API_ROUTES.STATISTIK.GET_TRANSAKSI_TIAP_KATEGORI}?periode=${periode}`;
  return fetcher<RingkasanKategoriResponse>(url, { method: 'GET' });
}

export interface CashflowDataPoint {
  tanggal: string;
  pemasukan: number;
  pengeluaran: number;
}

export async function getCashflowGraph(periode: number) {
  const url = `${API_ROUTES.STATISTIK.GET_CASHFLOW_THD_WAKTU}?periode=${periode}`;
  return fetcher<CashflowDataPoint[]>(url, { method: "GET" });
}

export interface KategoriStatistik {
  namaKategori: string;
  totalPengeluaran: number;
}

export async function getKategoriPengeluaranStatistik() {
  // return fetcher<KategoriStatistik[]>(API_ROUTES.STATISTIK.KATEGORI_BULANAN, {
  //   method: 'GET',
  // });
}