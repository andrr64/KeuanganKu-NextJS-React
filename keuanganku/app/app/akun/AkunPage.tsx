'use client';

import { useEffect, useState } from 'react';
import {
  FaPlus,
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaWallet, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import AddAccountDialog from '@/components/dialog/TambahAkunDialog';
import { AkunResponse } from '@/types/akun';
import Loading from '@/components/Loading';
import { getAllAkun, tambahAkun } from '@/actions/akun';
import ErrorPage from '@/components/pages/ErrorPage';
import toast from 'react-hot-toast';
import LoadingP from '@/components/LoadingP';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import ListAkunSection from './components/ListAkun';
import TransaksiTerbaruSection from './components/TransaksiTerbaru';
import { TransaksiResponse } from '@/types/transaksi';
import RingkasanUangSection from './components/RingkasanUang';
import EmptyAkunState from './components/EmptyAkunState';

export default function AkunPage() {
  const [isOpen, setIsOpenModalTambahAkun] = useState(false);
  const [periode, setPeriode] = useState('bulanan');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [listAkun, setListAkun] = useState<AkunResponse[]>([]);
  const [isOpenHapusAkun, setIsOpenModalHapusAkun] = useState(false);
  const [isAkunEmpty, setIsAkunEmpty] = useState(false);

  const fetchData = async () => {
    try {
      setLoadingFetch(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await getAllAkun();

      if (response.data !== undefined) {
        setListAkun(response.data);
        setIsAkunEmpty(response.data.length === 0);

      } else {
        setErrorMessage(response.message || 'Gagal memuat data akun.');
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Terjadi kesalahan saat memuat data akun.');
    } finally {
      setLoadingFetch(false);
    }
  };



  const akunList = [
    { nama: 'Bank BCA', tipe: 'Bank', saldo: 12000000, transaksiBulanIni: 14 },
    { nama: 'OVO', tipe: 'E-Wallet', saldo: 250000, transaksiBulanIni: 5 },
    { nama: 'Dompet Cash', tipe: 'Cash', saldo: 75000, transaksiBulanIni: 2 },
  ];
  const transaksiTerbaru: TransaksiResponse[] = [
    {
      id: '1',
      idAkun: 'akun-1',
      namaKategori: 'Gaji',
      namaAkun: 'Bank BCA',
      jenisTransaksi: 2,
      jumlah: 5000000,
      catatan: 'Gaji Bulanan',
      tanggal: '2025-07-15T09:00:00',
    },
    {
      id: '2',
      idAkun: 'akun-2',
      namaKategori: 'Makanan',
      namaAkun: 'OVO',
      jenisTransaksi: 1,
      jumlah: 75000,
      catatan: 'Bayar Makanan',
      tanggal: '2025-07-14T13:45:00',
    },
    {
      id: '3',
      idAkun: 'akun-3',
      namaKategori: 'Pulsa',
      namaAkun: 'Dompet Cash',
      jenisTransaksi: 1,
      jumlah: 50000,
      catatan: 'Isi Pulsa',
      tanggal: '2025-07-13T20:10:00',
    },
  ];

  const pengeluaranList = [
    { label: 'Makanan', value: 1500000, warna: '#F87171' },
    { label: 'Transportasi', value: 500000, warna: '#FB923C' },
    { label: 'Hiburan', value: 300000, warna: '#FACC15' },
    { label: 'Lainnya', value: 200000, warna: '#34D399' },
  ];

  const pemasukanList = [
    { label: 'Gaji', value: 7500000, warna: '#60A5FA' },
  ];

  const dataChart = [...pengeluaranList, ...pemasukanList];
  const [filterWaktu, setFilterWaktu] = useState('semua');
  const [filterAkun, setFilterAkun] = useState('semua');
  const akunOptions = ['semua', ...akunList.map((a) => a.nama)];
  const [jenisTransaksi, setJenisTransaksi] = useState(0); // 0 = semua, 1 = keluar, 2 = masuk
  const [idAkunHapus, setIdAkunYangInginDihapusu] = useState<string | null>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const handleAkunBaru = async (data: { nama: string; saldoAwal: number }) => {
    if (!data.nama.trim()) {
      toast.error('Nama akun tidak boleh kosong.');
      return;
    }

    if (data.saldoAwal < 0) {
      toast.error('Saldo awal tidak boleh negatif.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await tambahAkun(data.nama.trim(), data.saldoAwal);
      if (response.success) {
        toast.success('Akun berhasil ditambahkan.');
        fetchData();
      } else {
        toast.error(response.message || 'Gagal menambahkan akun.');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleHapusAkun = async (id: string) => {
    console.log(`Menghapus akun dengan ID: ${id}`);
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsOpenModalHapusAkun(false);
      setIdAkunYangInginDihapusu(null);
      toast.success('Akun berhasil dihapus.');
      await fetchData();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (errorMessage) return <ErrorPage message={errorMessage} />;
  if (loadingFetch) return <LoadingP />;
  if (isAkunEmpty) {
    return (
      <>
        <AddAccountDialog
          isOpen={isOpen}
          isLoading={loading}
          onClose={() => setIsOpenModalTambahAkun(false)}
          onSubmit={(data) => handleAkunBaru(data)}
        />
        <EmptyAkunState onTambahClick={() => setIsOpenModalTambahAkun(true)} />
      </>
    );
  }


  return (
    <>
      <ConfirmDialog
        isOpen={isOpenHapusAkun}
        onClose={() => {
          setIsOpenModalHapusAkun(false);
          setIdAkunYangInginDihapusu(null);
        }}
        title='Hapus Akun'
        confirmText='Ya, Hapus Akun'
        description='Anda yakin ingin menghapus akun ini? Semua transaksi akan dihapus dan tindakan ini tidak dapat dibatalkan.'
        onConfirm={() => {
          if (idAkunHapus !== null) {
            handleHapusAkun(idAkunHapus);
          }
        }} />
      <AddAccountDialog
        isOpen={isOpen}
        isLoading={loading}
        onClose={() => setIsOpenModalTambahAkun(false)}
        onSubmit={(data) => handleAkunBaru(data)}
      />
      <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
        <div className="max-w-[1280px] mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-lg font-semibold leading-6 mb-4 sm:mb-0">Akun Saya</h1>
            <button
              onClick={() => setIsOpenModalTambahAkun(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              <FaPlus className="w-4 h-4" />
              Tambah Akun
            </button>
          </header>

          <ListAkunSection
            listAkun={listAkun}
            onHapus={(id) => {
              setIdAkunYangInginDihapusu(id);
              setIsOpenModalHapusAkun(true);
            }}
          />

          {/* Ringkasan dan Transaksi */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransaksiTerbaruSection
              transaksi={transaksiTerbaru}
              filterWaktu={filterWaktu}
              filterAkun={filterAkun}
              jenisTransaksi={jenisTransaksi}
              akunOptions={akunOptions}
              setFilterWaktu={setFilterWaktu}
              setFilterAkun={setFilterAkun}
              setJenisTransaksi={setJenisTransaksi}
            />

            <RingkasanUangSection
              periode={periode}
              setPeriode={setPeriode}
              pengeluaranList={pengeluaranList}
              pemasukanList={pemasukanList}
            />
          </section>
        </div>
      </main>
    </>
  );
}
