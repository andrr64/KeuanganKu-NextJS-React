'use client';

import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { AkunResponse } from '@/types/akun';
import { KategoriResponse } from '@/types/kategori';
import { TransaksiResponse } from '@/types/transaksi';
import toast from 'react-hot-toast';
import { getAllKategori } from '@/actions/kategori';
import LoadingP from '../LoadingP';
import { EditTransaksiParams } from '@/actions/transaksi';

interface DialogEditTransaksiProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (data: EditTransaksiParams) => void;
    akunOptions: AkunResponse[];
    transaksiData: TransaksiResponse | null;
}

function formatDateForInput(date: Date): string {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
}

function formatDateForAPI(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function parseDateFromAPI(dateString: string): Date {
    if (dateString.includes('T')) {
        return new Date(dateString);
    }
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    let hours = 0, minutes = 0;
    if (timePart) {
        [hours, minutes] = timePart.split(':').map(Number);
    }
    return new Date(year, month - 1, day, hours, minutes);
}

export default function DialogEditTransaksi({
    isOpen,
    isLoading,
    onClose,
    onSubmit,
    akunOptions,
    transaksiData,
}: DialogEditTransaksiProps) {
    const [kategoriId, setKategoriId] = useState<string>("");
    const [akunId, setAkunId] = useState<string>(akunOptions[0]?.id || '');
    const [jumlah, setJumlah] = useState(0);
    const [tanggal, setTanggal] = useState(() => formatDateForInput(new Date()));
    const [catatan, setCatatan] = useState('');
    const [jenisTransaksi, setJenisTransaksi] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingKategori, setIsLoadingKategori] = useState(true);
    const [listKategoriPengeluaran, setKategoriPengeluaran] = useState<KategoriResponse[]>([]);
    const [listKategoriPemasukan, setKategoriPemasukan] = useState<KategoriResponse[]>([]);

    useEffect(() => {
        if (transaksiData) {
            setAkunId(transaksiData.idAkun);
            setJenisTransaksi(transaksiData.kategori.jenis);
            setKategoriId(transaksiData.kategori.id);
            setJumlah(transaksiData.jumlah);
            try {
                const parsedDate = parseDateFromAPI(transaksiData.tanggal);
                setTanggal(formatDateForInput(parsedDate));
            } catch (e) {
                console.error('Failed to parse date:', e);
                setTanggal(formatDateForInput(new Date()));
            }
            setCatatan(transaksiData.catatan || '');
        }
    }, [transaksiData]);

    useEffect(() => {
        const fetchKategori = async () => {
            setIsLoadingKategori(true);
            try {
                const response = await getAllKategori();
                if (response.success && response.data) {
                    const semuaKategori: KategoriResponse[] = response.data;
                    setKategoriPengeluaran(semuaKategori.filter(k => k.jenis === 1));
                    setKategoriPemasukan(semuaKategori.filter(k => k.jenis === 2));
                } else {
                    throw new Error("Terjadi kesalahan ketika mengambil data kategori");
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoadingKategori(false);
            }
        };

        if (isOpen) {
            fetchKategori();
        }
    }, [isOpen]);
    useEffect(() => {
        // Hanya saat mode tambah dan kategori sudah selesai dimuat
        if (isLoadingKategori || transaksiData) return;

        const listBaru = jenisTransaksi === 1 ? listKategoriPengeluaran : listKategoriPemasukan;
        if (listBaru.length > 0) {
            setKategoriId(listBaru[0].id);
        } else {
            setKategoriId("");
        }
    }, [isLoadingKategori, jenisTransaksi, listKategoriPengeluaran, listKategoriPemasukan, transaksiData]);

    const handleSekarang = () => {
        setTanggal(formatDateForInput(new Date()));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaksiData) {
            toast.error("Data transaksi tidak valid!");
            return;
        }

        const akun = akunOptions.find(a => a.id === akunId);
        if (!akun) {
            toast.error("Akun tidak valid!");
            return;
        }

        if (!kategoriId) {
            toast.error("Silakan pilih kategori.");
            return;
        }

        try {
            const parsedDate = new Date(tanggal);
            if (isNaN(parsedDate.getTime())) throw new Error("Invalid date");

            onSubmit({
                id: transaksiData.id,
                idKategori: kategoriId,
                idAkun: akun.id,
                jumlah: jumlah,
                tanggal: formatDateForAPI(parsedDate),
                catatan: catatan
            });
        } catch (e) {
            toast.error("Format tanggal tidak valid!");
        }
    };

    if (error) {
        toast.error(`Error: ${error}`);
        setError(null);
        onClose();
        return null;
    }

    const currentKategoriList = jenisTransaksi === 1 ? listKategoriPengeluaran : listKategoriPemasukan;

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
                                Edit Transaksi
                            </DialogTitle>
                            <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Edit detail transaksi keuangan.
                            </Description>

                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                {/* Akun */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Akun</label>
                                    <select
                                        value={akunId}
                                        onChange={e => setAkunId(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                                        required
                                    >
                                        {akunOptions.map(a => (
                                            <option key={a.id} value={a.id}>{a.nama}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Jenis Transaksi */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Jenis Transaksi</label>
                                    <select
                                        value={jenisTransaksi}
                                        onChange={e => setJenisTransaksi(Number(e.target.value) as 1 | 2)}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                                        required
                                    >
                                        <option value={1}>Pengeluaran</option>
                                        <option value={2}>Pemasukan</option>
                                    </select>
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Kategori</label>
                                    {isLoadingKategori ? (
                                        <div className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                            <LoadingP />
                                        </div>
                                    ) : (
                                        <select
                                            value={kategoriId}
                                            onChange={e => setKategoriId(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            {currentKategoriList.map(k => (
                                                <option key={k.id} value={k.id}>{k.nama}</option>
                                            ))}
                                            {currentKategoriList.length === 0 && (
                                                <option value="" disabled>Tidak ada kategori tersedia</option>
                                            )}
                                        </select>
                                    )}
                                </div>

                                {/* Jumlah */}
                                <div>
                                    <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">Jumlah</label>
                                    <input
                                        type="number"
                                        value={jumlah}
                                        min={0}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                setJumlah(0);
                                                toast.error("Jumlah tidak boleh kosong");
                                                return;
                                            }
                                            const parsed = parseFloat(val);
                                            if (isNaN(parsed)) {
                                                setJumlah(0);
                                                toast.error("Jumlah tidak valid");
                                                return;
                                            }
                                            setJumlah(parsed);
                                        }}
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                                            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSekarang}
                                            className="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-600 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
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
                                        className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 resize-none"
                                    />
                                </div>

                                {/* Aksi */}
                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || isLoadingKategori}
                                        className={`px-4 py-2 rounded text-white ${isLoading || isLoadingKategori ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
