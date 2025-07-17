'use client';

import { FaPlus } from 'react-icons/fa';

interface HeaderProps {
  onTambahAkunClick: () => void;
  fetchData: (param: boolean) => void;
  onTambahTransaksiClick: () => void;
}

export default function Header({ 
  onTambahAkunClick: onTambahClick, 
  fetchData: fetchDataCallback,
  onTambahTransaksiClick
}: HeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-col sm:items-start sm:justify-between gap-4">
        <h1 className="text-lg font-semibold leading-6">Akun Saya</h1>

        <div className="flex flex-wrap gap-3">
          {/* Tambah Transaksi */}
          <button
            onClick={() => onTambahTransaksiClick()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Transaksi
          </button>

          {/* Export */}
          <button
            onClick={() => console.log('Export')}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            📤 Export
          </button>

          {/* Refresh */}
          <button
            onClick={() => fetchDataCallback(true)}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            🔄 Refresh
          </button>

          {/* Tambah Akun */}
          <button
            onClick={onTambahClick}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Akun
          </button>
        </div>
      </div>
    </header>

  );
}
