'use client';

import { TransaksiResponse } from '@/types/transaksi';
import { useEffect, useState } from 'react';

interface Props {
  transaksi: TransaksiResponse[];
  filterWaktu: string;
  filterAkun: string;
  jenisTransaksi: number;
  akunOptions: string[];
  setFilterWaktu: (value: string) => void;
  setFilterAkun: (value: string) => void;
  setJenisTransaksi: (value: number) => void;
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  size: number;
  setSize: (s: number) => void;
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
  page,
  setPage,
  totalPages,
  searchQuery,
  setSearchQuery,
  size,
  setSize
}: Props) {

  return (
    <div className="max-h-[1080px] bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors w-full flex flex-col">
      <div className="flex flex-col gap-2 mb-4">
        <div>
          <h2 className="text-md font-semibold">Transaksi Terbaru</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Filter berdasarkan waktu, akun, jenis & pencarian
          </p>
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
              <option value="tahun">Tahun Ini</option>
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
            <div className="grid grid-cols-2 gap-2">
              {/* Jenis Transaksi */}
              <div>
                <label
                  htmlFor="jenisTransaksi"
                  className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block"
                >
                  Jenis Transaksi
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

              {/* Jumlah Data per Page */}
              <div>
                <label
                  htmlFor="jumlahData"
                  className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block"
                >
                  Jumlah Data
                </label>
                <select
                  id="jumlahData"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
                >
                  <option value={1}>1 data</option>
                  <option value={5}>5 data</option>
                  <option value={10}>10 data</option>
                  <option value={25}>25 data</option>
                  <option value={50}>50 data</option>
                </select>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="search" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
              Cari Transaksi
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Cari transaksi..."
                value={searchQuery ?? ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 pr-10 rounded-md border border-gray-300 dark:border-gray-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
        {transaksi.length === 0 ? (
          <li className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
            Tidak ada transaksi.
          </li>
        ) : (
          transaksi.map((trx) => (
            <li key={trx.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{trx.namaKategori}</p>
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
                className={`text-sm font-semibold ${trx.jenisTransaksi === 2 ? 'text-green-500' : 'text-red-500'}`}
              >
                {trx.jenisTransaksi === 2 ? '+' : '-'} Rp {trx.jumlah.toLocaleString('id-ID')}
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="mt-4 flex justify-end items-center gap-2 text-sm">
        <button
          onClick={() => page > 0 && setPage(page - 1)}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span>
          Halaman {page + 1} dari {totalPages}
        </span>
        <button
          onClick={() => page < totalPages - 1 && setPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
