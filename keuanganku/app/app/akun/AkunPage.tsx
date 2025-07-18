'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  editAkun,
  getAllAkun,
  tambahAkun
} from '@/actions/akun';
import { ambilTransaksi } from '@/actions/transaksi';
import { format } from 'date-fns';
import AddAccountDialog from '@/components/dialog/TambahAkunDialog';
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi';
import LoadingP from '@/components/LoadingP';
import ErrorPage from '@/components/pages/ErrorPage';

import ListAkunSection from './components/ListAkun';
import TransaksiTerbaruSection from './components/TransaksiTerbaru';
import RingkasanUangSection from './components/RingkasanUang';
import EmptyAkunState from './components/EmptyAkunState';
import Header from './components/HeaderAkun';

import { AkunResponse } from '@/types/akun';
import { TransaksiResponse } from '@/types/transaksi';
import EditAccountDialog from '@/components/dialog/EditNamaAkunDialog';
import DialogTambahTransaksi from '@/components/dialog/DialogTambahTransaksi';
import { tambahTransaksi, TambahTransaksiParams } from '@/actions/transaksi';

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

  const [listPengeluaran, setListPengeluaran] = useState<TransaksiResponse[]>([]);
  const [listPemasukan, setListPemasukan] = useState<TransaksiResponse[]>([]);
  const [transaksiTerbaru, setTransaksiTerbaru] = useState<TransaksiResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const akunOptions = ['semua', ...listAkun.map((a) => a.nama)];

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
    const now = new Date();
    let startDate: string;
    const endDate = format(now, 'dd/MM/yyyy');

    if (filterWaktu === 'hari') {
      startDate = format(now, 'dd/MM/yyyy');
    } else if (filterWaktu === 'minggu') {
      const tujuhHariLalu = new Date(now);
      tujuhHariLalu.setDate(now.getDate() - 6);
      startDate = format(tujuhHariLalu, 'dd/MM/yyyy');
    } else if (filterWaktu === 'bulan') {
      const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = format(awalBulan, 'dd/MM/yyyy');
    } else if (filterWaktu === 'tahun') {
      const awalTahun = new Date(now.getFullYear(), 0, 1);
      startDate = format(awalTahun, 'dd/MM/yyyy');
    } else {
      const defaultAwal = new Date(2000, 0, 1);
      startDate = format(defaultAwal, 'dd/MM/yyyy');
    }

    try {
      const res = await ambilTransaksi({
        startDate,
        endDate,
        jenis: jenisTransaksi === 0 ? undefined : jenisTransaksi,
        idAkun:
          filterAkun !== 'semua'
            ? listAkun.find((a) => a.nama === filterAkun)?.id
            : undefined,
        page,
        size,
        search: searchQuery || '',
      });

      if (!res.success) throw new Error(res.message);

      const result = res.data!;
      const semuaTransaksi: TransaksiResponse[] = result.content;

      const pengeluaran = semuaTransaksi.filter((t) => t.jenisTransaksi === 1);
      const pemasukan = semuaTransaksi.filter((t) => t.jenisTransaksi === 2);

      setTransaksiTerbaru(semuaTransaksi);
      setListPengeluaran(pengeluaran);
      setListPemasukan(pemasukan);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memuat data transaksi');
    }
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
      fetchData(false);
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

  useEffect(() => {
    fetchTransaksi();
  }, [filterWaktu, filterAkun, jenisTransaksi, page, size]);

  useEffect(() => {
    fetchTransaksi();
    setPage(0);
  }, [searchQuery])

  useEffect(() => {
    setPage(0);
  }, [filterWaktu, filterAkun, jenisTransaksi, size]);


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
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery} 
              size={size} 
              setSize={setSize}
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
