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
import toast from 'react-hot-toast';
import { getAllKategori } from '@/actions/kategori';
import LoadingP from '../LoadingP';
import { TambahTransaksiParams } from '@/actions/transaksi';
import { formatTanggalMMDDYYYY } from '@/lib/utils';

interface DialogTambahTransaksiProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (data: TambahTransaksiParams) => void;
    akunOptions: AkunResponse[];
}

export default function DialogTambahTransaksi({
    isOpen,
    isLoading,
    onClose,
    onSubmit,
    akunOptions,
}: DialogTambahTransaksiProps) {
    const [kategoriId, setKategoriId] = useState<string>("");
    const [akunId, setAkunId] = useState<string>(akunOptions[0]?.id || '');
    const [jumlah, setJumlah] = useState(0);
    const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 16));
    const [catatan, setCatatan] = useState('');
    const [jenisTransaksi, setJenisTransaksi] = useState<1 | 2>(1); // 1 = pengeluaran, 2 = pemasukan
    const [error, setError] = useState<string | null>(null);
    const [isLoadingKategori, setIsLoadingKategori] = useState(true);
    const [listKategoriPengeluaran, setKategoriPengeluaran] = useState<KategoriResponse[]>([]);
    const [listKategoriPemasukan, setKategoriPemasukan] = useState<KategoriResponse[]>([]);

    useEffect(() => {
        const fetchKategori = async () => {
            setIsLoadingKategori(true);
            try {
                const response = await getAllKategori();
                if (response.success && response.data) {
                    const semuaKategori: KategoriResponse[] = response.data;
                    const pengeluaran = semuaKategori.filter(k => k.jenis == 1);
                    const pemasukan = semuaKategori.filter(k => k.jenis == 2);
                    console.log(response.data);
                    setKategoriPengeluaran(pengeluaran);
                    setKategoriPemasukan(pemasukan);

                    // Set default kategori berdasarkan jenis transaksi pertama
                    if (jenisTransaksi === 1 && pengeluaran.length > 0) {
                        setKategoriId(pengeluaran[0].id);
                    } else if (jenisTransaksi === 2 && pemasukan.length > 0) {
                        setKategoriId(pemasukan[0].id);
                    }
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
    }, [isOpen, jenisTransaksi]);

    // Update kategoriId ketika jenis transaksi berubah
    useEffect(() => {
        if (jenisTransaksi === 1 && listKategoriPengeluaran.length > 0) {
            setKategoriId(listKategoriPengeluaran[0].id);
        } else if (jenisTransaksi === 2 && listKategoriPemasukan.length > 0) {
            setKategoriId(listKategoriPemasukan[0].id);
        }
    }, [jenisTransaksi, listKategoriPengeluaran, listKategoriPemasukan]);

    const handleSekarang = () => {
        const now = new Date();
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        setTanggal(local.toISOString().slice(0, 16));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const akun = akunOptions.find(a => a.id === akunId);
        if (!akun) {
            toast.error("Akun tidak valid!");
            return;
        }
        if (!kategoriId) {
            toast.error("Silakan pilih kategori.");
            return;
        }

        // 🔥 Konversi tanggal ke format MM/dd/yyyy HH:mm
        const parsedDate = new Date(tanggal);
        const formattedTanggal = formatTanggalMMDDYYYY(parsedDate);

        onSubmit({
            idKategori: kategoriId,
            idAkun: akun.id,
            jumlah: jumlah,
            tanggal: formattedTanggal, // kirim yang udah diubah
            catatan: catatan
        });
    };


    if (error) {
        toast.error(`Error: ${error}`);
        setError(null);
        onClose();
        return null;
    }

    const currentKategoriList = jenisTransaksi === 1 ? listKategoriPengeluaran : listKategoriPemasukan;

    return (
        <>
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

                                    {/* Jenis Transaksi */}
                                    <div>
                                        <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">
                                            Jenis Transaksi
                                        </label>
                                        <select
                                            value={jenisTransaksi}
                                            onChange={e => setJenisTransaksi(Number(e.target.value) as 1 | 2)}
                                            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                            disabled={isLoading || isLoadingKategori}
                                            className={`px-4 py-2 rounded text-white 
                                            transition-colors duration-200 
                                            ${isLoading || isLoadingKategori
                                                    ? 'bg-blue-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}