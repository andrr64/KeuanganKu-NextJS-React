import { AkunResponse } from "./akun";


export interface AkunTransfer {
    nama: string;
    id: string;
}

export interface TransferResponse {
    id: string;
    dataDariAkun: AkunTransfer;
    dataKeAkun: AkunTransfer;
    jumlah: number;
    tanggal: string;
    catatan: string;
}