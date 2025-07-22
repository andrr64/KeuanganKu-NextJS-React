'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  editAkun,
  getAllAkun,
  hapusAkun,
  tambahAkun
} from '@/actions/akun';
import { ambilTransaksi, deleteTransaksi, EditTransaksiParams, getRingkasan, RingkasanKategoriItem, RingkasanKategoriResponse, updateTransaksi } from '@/actions/transaksi';
import { format } from 'date-fns';
import AddAccountDialog from '@/components/dialog/TambahAkunDialog';
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi';
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
import DialogEditTransaksi from '@/components/dialog/DialogEditTransaksi';
import { handleApiAction } from '@/lib/api';
import { getColors } from '@/lib/utils';

type RingkasanKategoriItemWithColor = RingkasanKategoriItem & { warna: string };


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

  const [periode, setPeriode] = useState<number>(1);
  const [filterWaktu, setFilterWaktu] = useState('semua');
  const [filterAkun, setFilterAkun] = useState('semua');
  const [jenisTransaksi, setJenisTransaksi] = useState(0); // 0 = semua, 1 = keluar, 2 = masuk
  const [akunYangDiedit, setAkunYangDiedit] = useState<AkunResponse | null>(null);

  const [ringkasanListPengeluaran, setRingkasanListPengeluaran] = useState<RingkasanKategoriItemWithColor[]>([]);
  const [ringkasanListPemasukan, setRingkasanListPemasukan] = useState<RingkasanKategoriItemWithColor[]>([]);
  const [transaksiTerbaru, setTransaksiTerbaru] = useState<TransaksiResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogEditTrx, setDialogEditTrx] = useState(false);
  const [dialogHapusTrx, setDialogHapusTrx] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState<TransaksiResponse | null>(null);

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


  const fetchRingkasan = async () => {
    setLoading(true);
    await handleApiAction<RingkasanKategoriResponse>({
      action: () => getRingkasan(periode),
      onSuccess: (data) => {
        const warnaPengeluaran = getColors(data.pengeluaran.length);
        const warnaPemasukan = getColors(data.pemasukan.length);
        setRingkasanListPengeluaran(
          data.pengeluaran.map((e, i) => ({
            ...e,
            warna: warnaPengeluaran[i],
          }))
        );
        setRingkasanListPemasukan(
          data.pemasukan.map((e, i) => ({
            ...e,
            warna: warnaPemasukan[i],
          }))
        );
      },
      onFinally: () => setLoading(false),
    });
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

      setTransaksiTerbaru(semuaTransaksi);
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
      await fetchRingkasan();
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
    handleApiAction({
      action: () => hapusAkun(id),
      successMessage: 'Akun berhasil dihapus',
      onSuccess: async () => {
        await fetchData();
        setIsOpenHapusAkun(false);
        setIdAkunHapus(null);
      },
      onFinally: () => setLoading(false)
    })
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

  const handleEditTransaksi = async (data: EditTransaksiParams) => {
    setLoading(true);
    console.log(data);
    await handleApiAction({
      action: () => updateTransaksi(data),
      successMessage: 'Transaksi berhasil diperbarui',
      onSuccess: () => {
        fetchData();
        setSelectedTrx(null);
        setDialogEditTrx(false);
      },
      onFinally: () => setLoading(false),
    });
  };

  const handleDeleteTransaksi = async (data: TransaksiResponse) => {
    setLoading(true);
    await handleApiAction({
      action: () => deleteTransaksi(data),
      successMessage: 'Transaksi berhasil dihapus',
      onSuccess: async () => {
        await fetchData();
        setDialogHapusTrx(false);
        setSelectedTrx(null);
      },
      onFinally: () => setLoading(false),
    });
  }


  useEffect(() => {
    fetchRingkasan();
  }, [periode])

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
          isLoading={false}
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
      <DialogEditTransaksi
        isOpen={dialogEditTrx}
        isLoading={false}
        onSubmit={(data) => handleEditTransaksi(data)} // ✅ ini menerima hasil input
        onClose={() => setDialogEditTrx(false)}
        akunOptions={listAkun}
        transaksiData={selectedTrx}
      />

      <ConfirmDialog
        isOpen={dialogHapusTrx}
        onClose={() => setDialogHapusTrx(false)}
        title='Hapus transaksi'
        description='Data yang dihapus tidak akan bisa dikembalikan!'
        confirmText='Ya, hapus!'
        onConfirm={() => {
          if (selectedTrx) {
            handleDeleteTransaksi(selectedTrx)
          }
        }}
      />
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
        isLoading={false}
        onClose={() => setIsOpenTambahTransaksi(false)}
        onSubmit={(data) => {
          handleTambahTransaksi(data);
        }}
        akunOptions={listAkun}
      />
      <EditAccountDialog
        isOpen={isOpenEditNamaAkun}
        isLoading={false}
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
        isLoading={false}
        onClose={() => setIsOpenTambahAkun(false)}
        onSubmit={handleAkunBaru}
      />

      {/* Halaman */}
      <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
        <div className='max-w-[1280px] flex flex-col gap-8 mx-auto md:mx-0'>
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransaksiTerbaruSection
              onClickTrx={(trx) => {
                setSelectedTrx(trx);
                setDialogEditTrx(true);
              }}
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
              onDelete={(trx) => {
                setSelectedTrx(trx);
                setDialogHapusTrx(true);
              }}
            />
            <RingkasanUangSection
              periode={periode}
              setPeriode={(e) => {setPeriode(e)}}
              pengeluaranList={ringkasanListPengeluaran}
              pemasukanList={ringkasanListPemasukan}
            />
          </section>
        </div>
      </main>
    </>
  );
}
