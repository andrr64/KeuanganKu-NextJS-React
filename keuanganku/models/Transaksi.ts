import { KategoriModel } from "./Kategori";

export interface TransaksiModel {
    id: string;
    idAkun: string;
    namaKategori: string;
    namaAkun: string;
    jenisTransaksi: number; 
    jumlah: number;
    catatan: string;
    tanggal: string;
    kategori: KategoriModel;
}