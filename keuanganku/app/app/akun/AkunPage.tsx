'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  editAkun,
  getAllAkun,
  tambahAkun
} from '@/actions/akun';

import AddAccountDialog from '@/components/dialog/TambahAkunDialog';
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi';
import Loading from '@/components/Loading';
import LoadingP from '@/components/LoadingP';
import ErrorPage from '@/components/pages/ErrorPage';

import ListAkunSection from './components/ListAkun';
import TransaksiTerbaruSection from './components/TransaksiTerbaru';
import RingkasanUangSection from './components/RingkasanUang';
import EmptyAkunState from './components/EmptyAkunState';
import Header from './components/Header';

import { AkunResponse } from '@/types/akun';
import { TransaksiResponse } from '@/types/transaksi';
import EditAccountDialog from '@/components/dialog/EditNamaAkunDialog';
import DialogTambahTransaksi from '@/components/dialog/DialogTambahTransaksi';
import { tambahTransaksi, TambahTransaksiParams } from '@/actions/transaksi';

// Dummy Data (bisa kamu ganti saat integrasi backend)
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

export default function AkunPage() {
  const [listAkun, setListAkun] = useState<AkunResponse[]>([]);
  const [isAkunEmpty, setIsAkunEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isOpenTambahAkun, setIsOpenTambahAkun] = useState(false);
  const [isOpenHapusAkun, setIsOpenHapusAkun] = useState(false);
  const [isOpenEditNamaAkun, setIsOpenEditAKun] = useState(false);
  const [idAkunHapus, setIdAkunHapus] = useState<string | null>(null);
  const [isOpenTambahTransaksi, setIsOpenTambahTransaksi] = useState(false);

  const [periode, setPeriode] = useState('bulanan');
  const [filterWaktu, setFilterWaktu] = useState('semua');
  const [filterAkun, setFilterAkun] = useState('semua');
  const [jenisTransaksi, setJenisTransaksi] = useState(0); // 0 = semua, 1 = keluar, 2 = masuk
  const [akunYangDiedit, setAkunYangDiedit] = useState<AkunResponse | null>(null);

  const akunOptions = ['semua', ...listAkun.map((a) => a.nama)];
  const dataChart = [...pengeluaranList, ...pemasukanList];

  // Fungsi khusus untuk ambil data akun aja (tanpa set state)
  const fetchAkun = async () => {
    const response = await getAllAkun();
    if (response.data) {
      setIsAkunEmpty(response.data.length === 0);
      setListAkun(response.data);
    } else {
      setErrorMessage(response.message || 'Gagal memuat data akun.');
    }
  };

  const fetchTransaksi = async () => {

  };

  const fetchData = async (first: boolean = false) => {
    try {
      setLoadingFetch(first);
      await new Promise((res) => setTimeout(res, 500));
      await fetchAkun();
      await fetchTransaksi();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoadingFetch(false);
    }
  };


  const handleAkunBaru = async (data: { nama: string; saldoAwal: number }) => {
    if (!data.nama.trim()) return toast.error('Nama akun tidak boleh kosong.');
    if (data.saldoAwal < 0) return toast.error('Saldo awal tidak boleh negatif.');

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

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
    } finally {
      setIsOpenTambahAkun(false);
      setLoading(false);
    }
  };

  const handleEditNamaAkun = async (id: string, namaBaru: String) => {
    if (!namaBaru.trim()) return toast.error('Nama akun tidak boleh kosong.');

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    try {
      const response = await editAkun(id, namaBaru);

      if (response.success) {
        setIsOpenEditAKun(false);
        toast.success('Akun berhasil ditambahkan.');
        fetchData(false);
      } else {
        toast.error(response.message || 'Gagal menambahkan akun.');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleHapusAkun = async (id: string) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    try {
      setIsOpenHapusAkun(false);
      setIdAkunHapus(null);
      toast.success('Akun berhasil dihapus.');
      fetchData();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTambahTransaksi = async (data: TambahTransaksiParams) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await tambahTransaksi(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      setIsOpenTambahTransaksi(false);
      toast.success("Transaksi berhasil ditambahkan");
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
      fetchData();
    }
  }

  useEffect(() => {
    fetchData(true);
  }, []);

  if (errorMessage) return <ErrorPage message={errorMessage} />;
  if (loadingFetch) return <LoadingP />;

  if (isAkunEmpty) {
    return (
      <>

        <AddAccountDialog
          isOpen={isOpenTambahAkun}
          isLoading={loading}
          onClose={() => setIsOpenTambahAkun(false)}
          onSubmit={handleAkunBaru}
        />
        <EmptyAkunState onTambahClick={() => setIsOpenTambahAkun(true)} />
      </>
    );
  }

  return (
    <>
      {/* Modal */}
      <ConfirmDialog
        isOpen={isOpenHapusAkun}
        onClose={() => {
          setIsOpenHapusAkun(false);
          setIdAkunHapus(null);
        }}
        title="Hapus Akun"
        confirmText="Ya, Hapus Akun"
        description="Anda yakin ingin menghapus akun ini? Semua transaksi akan dihapus dan tindakan ini tidak dapat dibatalkan."
        onConfirm={() => idAkunHapus && handleHapusAkun(idAkunHapus)}
      />
      <DialogTambahTransaksi
        isOpen={isOpenTambahTransaksi}
        isLoading={loading}
        onClose={() => setIsOpenTambahTransaksi(false)}
        onSubmit={(data) => {
          handleTambahTransaksi(data);
        }}
        akunOptions={listAkun}
      />
      <EditAccountDialog
        isOpen={isOpenEditNamaAkun}
        isLoading={loading}
        akun={akunYangDiedit}
        onClose={() => {
          setAkunYangDiedit(null);
          setIsOpenEditAKun(false);
        }}
        onSubmit={(idAkun: string, namaBaru: string) => {
          handleEditNamaAkun(idAkun, namaBaru);
        }} />

      <AddAccountDialog
        isOpen={isOpenTambahAkun}
        isLoading={loading}
        onClose={() => setIsOpenTambahAkun(false)}
        onSubmit={handleAkunBaru}
      />

      {/* Halaman */}
      <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
        <div className="max-w-[1280px] mx-auto">
          <Header
            fetchData={() => fetchData(false)}
            onTambahTransaksiClick={() => {
              setIsOpenTambahTransaksi(true)
            }}
            onTambahAkunClick={() => setIsOpenTambahAkun(true)}
          />

          <ListAkunSection
            listAkun={listAkun}
            onEdit={(akun) => {
              setAkunYangDiedit(akun);
              setIsOpenEditAKun(true);
            }}
            onHapus={(id) => {
              setIdAkunHapus(id);
              setIsOpenHapusAkun(true);
            }}
          />
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
