'use client';

import { FaPlus, FaFileImport } from 'react-icons/fa';

interface HeaderKategoriProps {
    onTambahKategoriClick: () => void;
    fetchData: (refresh: boolean) => void;
}

export default function HeaderKategori({
    onTambahKategoriClick,
    fetchData
}: HeaderKategoriProps) {
    return (
        <header className="mb-6">
            <div className="flex flex-col sm:items-start sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">Kategori</h1>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => onTambahKategoriClick}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        <FaPlus className="w-4 h-4" />
                        Tambah Kategori
                    </button>
                    {/* Import Kategori (aksi dummy) */}
                    <button
                        onClick={() => console.log('Import Kategori')}
                        className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <FaFileImport className="w-4 h-4" />
                        Import
                    </button>

                    {/* Refresh */}
                    <button
                        onClick={() => fetchData(true)}
                        className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>
        </header>
    );
}
