'use client';

import { TransaksiResponse } from '@/types/transaksi';
import { useMemo } from 'react';

interface Props {
  transaksi: TransaksiResponse[];
  filterWaktu: string; // 'semua' | 'hari' | 'minggu' | 'bulan'
  filterAkun: string;  // nama akun / 'semua'
  jenisTransaksi: number; // 0=semua, 1=keluar, 2=masuk
  akunOptions: string[];
  setFilterWaktu: (value: string) => void;
  setFilterAkun: (value: string) => void;
  setJenisTransaksi: (value: number) => void;
}

export default function TransaksiTerbaruSection({
  transaksi,
  filterWaktu,
  filterAkun,
  jenisTransaksi,
  akunOptions,
  setFilterWaktu,
  setFilterAkun,
  setJenisTransaksi,
}: Props) {
  const transaksiTersaring = useMemo(() => {
    const now = new Date();
    const satuHari = 1000 * 60 * 60 * 24;

    return transaksi.filter((trx) => {
      const cocokAkun = filterAkun === 'semua' || trx.namaAkun === filterAkun;

      const trxDate = new Date(trx.tanggal);
      let cocokWaktu = true;

      if (filterWaktu === 'hari') {
        cocokWaktu = trxDate.toDateString() === now.toDateString();
      } else if (filterWaktu === 'minggu') {
        const selisih = (now.getTime() - trxDate.getTime()) / satuHari;
        cocokWaktu = selisih <= 7;
      } else if (filterWaktu === 'bulan') {
        cocokWaktu = trxDate.getMonth() === now.getMonth() && trxDate.getFullYear() === now.getFullYear();
      }

      const cocokJenis =
        jenisTransaksi === 0 ||
        (jenisTransaksi === 1 && trx.jenisTransaksi === 1) ||
        (jenisTransaksi === 2 && trx.jenisTransaksi === 2);

      return cocokAkun && cocokWaktu && cocokJenis;
    });
  }, [transaksi, filterAkun, filterWaktu, jenisTransaksi]);

  return (
    <div className="bg-white h-[512px] dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors w-full">
      <div className="flex flex-col gap-2 mb-4">
        <div>
          <h2 className="text-md font-semibold">Transaksi Terbaru</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Filter berdasarkan waktu, akun & jenis</p>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="filterWaktu" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
              Waktu
            </label>
            <select
              id="filterWaktu"
              value={filterWaktu}
              onChange={(e) => setFilterWaktu(e.target.value)}
              className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
            >
              <option value="semua">Semua Waktu</option>
              <option value="hari">Hari Ini</option>
              <option value="minggu">7 Hari Terakhir</option>
              <option value="bulan">Bulan Ini</option>
            </select>
          </div>

          <div>
            <label htmlFor="filterAkun" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
              Akun
            </label>
            <select
              id="filterAkun"
              value={filterAkun}
              onChange={(e) => setFilterAkun(e.target.value)}
              className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
            >
              {akunOptions.map((a, idx) => (
                <option key={idx} value={a}>
                  {a === 'semua' ? 'Semua Akun' : a}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="jenisTransaksi" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
              Jenis
            </label>
            <select
              id="jenisTransaksi"
              value={jenisTransaksi}
              onChange={(e) => setJenisTransaksi(parseInt(e.target.value))}
              className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
            >
              <option value={0}>Semua Jenis</option>
              <option value={1}>Pengeluaran</option>
              <option value={2}>Pemasukan</option>
            </select>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transaksiTersaring.length === 0 ? (
          <li className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
            Tidak ada transaksi.
          </li>
        ) : (
          transaksiTersaring.map((trx) => (
            <li key={trx.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{trx.catatan}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {trx.namaAkun} •{' '}
                  {new Date(trx.tanggal).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div
                className={`text-sm font-semibold ${
                  trx.jenisTransaksi === 2 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trx.jenisTransaksi === 2 ? '+' : '-'} Rp {trx.jumlah.toLocaleString('id-ID')}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
