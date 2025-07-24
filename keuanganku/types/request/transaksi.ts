export interface PostTransaksiBody {
  idKategori: string;
  idAkun: string;
  jumlah: number;
  tanggal: string; 
  catatan?: string;
}

export interface GetTransaksiParams {
  startDate?: string;
  endDate?: string;
  jenis?: number;
  idAkun?: string;
  page?: number;
  size?: number;
  search?: string;
}

export type PutTransaksiBody = {
  id: string;
  idKategori: string;
  idAkun: string;
  jumlah: number;
  tanggal: string;
  catatan?: string;
};
