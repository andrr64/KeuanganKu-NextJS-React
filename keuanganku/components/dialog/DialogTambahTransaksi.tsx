'use client';

import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { AkunResponse } from '@/types/akun';
import { KategoriResponse } from '@/types/kategori';

interface DialogTambahTransaksiProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (data: {
        kategoriId: string;
        akun: AkunResponse;
        jumlah: number;
        tanggal: string;
        catatan?: string;
    }) => void;
    akunOptions: AkunResponse[];
    kategoriOptions: KategoriResponse[];
}

export default function DialogTambahTransaksi({
    isOpen,
    isLoading,
    onClose,
    onSubmit,
    akunOptions,
    kategoriOptions,
}: DialogTambahTransaksiProps) {
    const [kategoriId, setKategoriId] = useState<string>(kategoriOptions[0]?.id || "");
    const [akunId, setAkunId] = useState<string>(akunOptions[0]?.id || '');
    const [jumlah, setJumlah] = useState(0);
    const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 16));
    const [catatan, setCatatan] = useState('');

    const handleSekarang = () => {
        const now = new Date();
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        setTanggal(local.toISOString().slice(0, 16));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const akun = akunOptions.find(a => a.id === akunId);
        if (!akun) return;

        onSubmit({
            kategoriId,
            akun,
            jumlah: jumlah,
            tanggal,
            catatan: catatan.trim() || undefined,
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
                                Tambah Transaksi
                            </DialogTitle>
                            <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Masukkan detail transaksi keuangan.
                            </Description>

                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                {/* Kategori */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Kategori</label>
                                    <select
                                        value={kategoriId}
                                        onChange={e => setKategoriId(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        {kategoriOptions.map(k => (
                                            <option key={k.id} value={k.id}>{k.nama}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Akun */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Akun</label>
                                    <select
                                        value={akunId}
                                        onChange={e => setAkunId(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        {akunOptions.map(a => (
                                            <option key={a.id} value={a.id}>{a.nama}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Jumlah */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Jumlah</label>
                                    <input
                                        type="number"
                                        value={jumlah}
                                        onChange={(e) => setJumlah(parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                {/* Tanggal */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Tanggal</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="datetime-local"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSekarang}
                                            className="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-600 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                                        >
                                            Sekarang
                                        </button>
                                    </div>
                                </div>

                                {/* Catatan */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Catatan (Opsional)</label>
                                    <textarea
                                        rows={2}
                                        value={catatan}
                                        onChange={(e) => setCatatan(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Aksi */}
                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded 
                    bg-gray-200 dark:bg-gray-700 
                    text-gray-700 dark:text-white 
                    hover:bg-gray-300 dark:hover:bg-gray-600 
                    transition-colors duration-200 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded text-white 
                    transition-colors duration-200 
                    ${isLoading
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        Simpan Transaksi
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
