export interface TransaksiDariKategori {
    label: string;
    value: number;
}

export type StatistikTransaksiTiapKategoriResponse = {
    pengeluaran: TransaksiDariKategori[];
    pemasukan: TransaksiDariKategori[];
}

