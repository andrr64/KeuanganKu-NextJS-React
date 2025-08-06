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

export type StatistikCashflow = {
    tanggal: string;
    pemasukan: number;
    pengeluaran: number;    
}