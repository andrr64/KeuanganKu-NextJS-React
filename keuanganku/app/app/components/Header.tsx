'use client';

import { FaPlus, FaBullseye, FaListAlt, FaWallet } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { BiRefresh, BiExport } from 'react-icons/bi';

interface HeaderDashboardProps {
    onTambahAkun: () => void;
    onTambahTransaksi: () => void;
    onTambahGoal: () => void;
    onTambahKategori: () => void;
    onRefresh: () => void;
}

export default function HeaderDashboard({
    onTambahAkun,
    onTambahTransaksi,
    onTambahGoal,
    onTambahKategori,
    onRefresh
}: HeaderDashboardProps) {
    return (
        <header>
            <div className="flex flex-col sm:justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard Keuangan
                </h1>

                <div className="flex flex-wrap gap-3">
                    {/* Tambah Transaksi */}
                    <button
                        onClick={onTambahTransaksi}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        <FaWallet className="w-4 h-4" />
                        Tambah Transaksi
                    </button>

                    {/* Tambah Akun */}
                    <button
                        onClick={onTambahAkun}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        <FaPlus className="w-4 h-4" />
                        Tambah Akun
                    </button>

                    {/* Tambah Goal */}
                    <button
                        onClick={onTambahGoal}
                        className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition"
                    >
                        <FaBullseye className="w-4 h-4" />
                        Tambah Goal
                    </button>

                    {/* Tambah Kategori */}
                    <button
                        onClick={onTambahKategori}
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
                    >
                        <MdCategory className="w-5 h-5" />
                        Tambah Kategori
                    </button>

                    {/* Export */}
                    {/* <button
                        onClick={onExport}
                        className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <BiExport className="w-5 h-5" />
                        Export
                    </button> */}

                    {/* Refresh */}
                    <button
                        onClick={onRefresh}
                        className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <BiRefresh className="w-5 h-5" />
                        Refresh
                    </button>
                </div>
            </div>
        </header>
    );
}
