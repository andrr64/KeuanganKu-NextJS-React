'use client';

import { FaPlus, FaWallet } from 'react-icons/fa';

export default function EmptyAkunState({ onTambahClick }: { onTambahClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] px-4 text-center">
      <FaWallet className="w-14 h-14 sm:w-16 sm:h-16 text-indigo-500 mb-5" />
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
        Belum Ada Akun
      </h2>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mb-6">
        Untuk mulai mencatat keuangan, kamu perlu menambahkan akun terlebih dahulu.
      </p>
      <button
        onClick={onTambahClick}
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
      >
        <FaPlus className="w-4 h-4" />
        Tambah Akun
      </button>
    </div>
  );
}
