import { KategoriResponse } from "./kategori";

export interface TransaksiResponse {
    id: string;
    idAkun: string;
    namaKategori: string;
    namaAkun: string;
    jenisTransaksi: number; // 1 untuk penngeluaran, 2 untuk pemasukan
    jumlah: number;
    catatan: string;
    tanggal: string;
    kategori: KategoriResponse;
}