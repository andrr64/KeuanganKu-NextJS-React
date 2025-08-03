export interface TransaksiDariKategori {
    label: string;
    value: number;
}

export type StatistikTransaksiTiapKategori = {
    pengeluaran: TransaksiDariKategori[];
    pemasukan: TransaksiDariKategori[];
}

export type StatistikRingkasanBulanIni = {
    totalSaldo: number;
    totalPemasukanBulanIni: number;
    totalPengeluaranBulanIni: number;
    cashflowBulanIni: number;
}