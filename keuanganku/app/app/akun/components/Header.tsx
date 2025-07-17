'use client';

import { FaPlus } from 'react-icons/fa';

interface HeaderProps {
  onTambahClick: () => void;
}

export default function Header({ onTambahClick }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 className="text-lg font-semibold leading-6 mb-4 sm:mb-0">Akun Saya</h1>
      <button
        onClick={onTambahClick}
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
      >
        <FaPlus className="w-4 h-4" />
        Tambah Akun
      </button>
    </header>
  );
}
