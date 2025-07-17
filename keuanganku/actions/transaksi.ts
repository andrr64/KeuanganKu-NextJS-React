import { API_ROUTES } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';

export interface TambahTransaksiParams {
  idKategori: string;
  idAkun: string;
  jumlah: number;
  tanggal: string; // Format: 'dd/MM/yyyy HH:mm'
  catatan?: string;
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