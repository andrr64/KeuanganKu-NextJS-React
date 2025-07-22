// File: app/dashboard/DashboardPage.tsx
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ambilRecentTransaksi,
  EditTransaksiParams,
  getKategoriPengeluaranStatistik,
  KategoriStatistik,
  tambahTransaksi,
  TambahTransaksiParams,
  updateTransaksi
} from '@/actions/transaksi';
import {
  DashboardRingkasanStatistikResponse,
  getRecentDashboard
} from '@/actions/dashboard';
import {
  getAllAkun,
  tambahAkun,
  editAkun,
  hapusAkun
} from '@/actions/akun';
import { getFilteredGoal, GetGoalResponse, tambahGoal } from '@/actions/goal';
import { handleApiAction } from '@/lib/api';
import { TransaksiResponse } from '@/types/transaksi';
import { AkunResponse } from '@/types/akun';
import { GoalResponse } from '@/types/goal';

// Komponen
import HeaderDashboard from './components/Header';
import ListAkunSection from './akun/components/ListAkun';
import CashflowChartSection from './components/CashflowChart';
import StatistikRingkasSection from './components/StatistikRingkasan';
import TransaksiTerakhirSection from './components/TransaksiTerakhir';
import DialogEditTransaksi from '@/components/dialog/DialogEditTransaksi';
import DialogTambahGoal from '@/components/dialog/DialogTambahGoal';
import DialogTambahKategori from '@/components/dialog/DialogTambahKategori';
import DialogTambahTransaksi from '@/components/dialog/DialogTambahTransaksi';
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi';
import AddAccountDialog from '@/components/dialog/TambahAkunDialog';
import RingkasanGoalSection from './components/RingkasanGoal';
import KategoriStatistikSection from './components/KategoriStatistikSection';
import EditAccountDialog from '@/components/dialog/EditNamaAkunDialog';

export default function DashboardPage() {
  const [selectedTrx, setSelectedTrx] = useState<TransaksiResponse | null>(null);
  const [dialogEditTrx, setDialogEditTrx] = useState(false);
  const [dialogHapusTrx, setDialogHapusTrx] = useState(false);
  const [loading, setLoading] = useState(false);

  const [listAkun, setListAkun] = useState<AkunResponse[]>([]);
  const [recentTransaksi, setRecentTransaksi] = useState<TransaksiResponse[]>([]);
  const [statistikRingkas, setStatistikRingkas] = useState<DashboardRingkasanStatistikResponse | null>(null);
  const [recentGoal, setGoalList] = useState<GoalResponse[]>([]);

  const [isOpenTambahGoal, setIsOpenTambahGoal] = useState(false);
  const [isOpenTambahKategori, setIsOpenTambahKategori] = useState(false);
  const [isOpenTambahTransaksi, setIsOpenTambahTransaksi] = useState(false);
  const [isOpenTambahAkun, setIsOpenTambahAkun] = useState(false);
  const [isOpenEditAkun, setIsOpenEditAkun] = useState(false);

  const [akunYangDiedit, setAkunYangDiedit] = useState<AkunResponse | null>(null);
  const [akunYangDihapus, setAkunYangDihapus] = useState<AkunResponse | null>(null);
  const [dialogKonfirmasiHapusAkun, setDialogKonfirmasiHapusAkun] = useState(false);

  const [dataStatistik, setDataStatistik] = useState<KategoriStatistik[]>([]);

  const fetchAkun = () => {
    setLoading(true);
    handleApiAction<AkunResponse[]>({
      action: getAllAkun,
      onSuccess: setListAkun,
      onFinally: () => setLoading(false),
    });
  };

  const fetchGoal = () => {
    handleApiAction<GetGoalResponse>({
      action: () => getFilteredGoal({ page: 0, size: 5, tercapai: false }),
      onSuccess: (data) => setGoalList(data.content),
    });
  };

  const fetchRecentTransaksi = () => {
    handleApiAction<TransaksiResponse[]>({
      action: ambilRecentTransaksi,
      onSuccess: setRecentTransaksi,
    });
  };

  const fetchStatistikRingkasna = () => {
    handleApiAction<DashboardRingkasanStatistikResponse>({
      action: getRecentDashboard,
      onSuccess: setStatistikRingkas,
    });
  };

  const fetchStatistikKategoriPengeluaran = async () => {
    setLoading(true);
    handleApiAction({
      action: () => getKategoriPengeluaranStatistik(),
      onSuccess: setDataStatistik,
      onFinally: () => setLoading(false),
    });
  };

  const fetchData = () => {
    fetchAkun();
    fetchGoal();
    fetchRecentTransaksi();
    fetchStatistikRingkasna();
    fetchStatistikKategoriPengeluaran();
  };

  const handleTambahAkun = async (data: { nama: string; saldoAwal: number }) => {
    if (!data.nama.trim()) return toast.error('Nama akun tidak boleh kosong.');
    if (data.saldoAwal < 0) return toast.error('Saldo awal tidak boleh negatif.');

    await handleApiAction({
      action: () => tambahAkun(data.nama.trim(), data.saldoAwal),
      successMessage: 'Akun berhasil ditambahkan',
      onSuccess: fetchData,
      onFinally: () => setIsOpenTambahAkun(false),
    });
  };

  const handleEditNamaAkun = async (id: string, namaBaru: string) => {
    if (!namaBaru.trim()) return toast.error('Nama akun tidak boleh kosong.');

    await handleApiAction({
      action: () => editAkun(id, namaBaru),
      successMessage: 'Nama akun berhasil diubah',
      onSuccess: fetchData,
      onFinally: () => setIsOpenEditAkun(false),
    });
  };

  const handleHapusAkun = async (id: string) => {
    await handleApiAction({
      action: () => hapusAkun(id),
      successMessage: 'Akun berhasil dihapus',
      onSuccess: fetchData,
    });
  };

  const handleTambahTransaksi = async (data: TambahTransaksiParams) => {
    setLoading(true);
    try {
      const response = await tambahTransaksi(data);
      if (!response.success) throw new Error(response.message);

      toast.success("Transaksi berhasil ditambahkan");
      setIsOpenTambahTransaksi(false);
      fetchData();
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaksi = async (data: EditTransaksiParams) => {
    console.log(data);
    setLoading(true);
    await handleApiAction({
      action: () => updateTransaksi(data),
      successMessage: 'Transaksi berhasil diperbarui',
      onSuccess: fetchData,
      onFinally: () => {
        setDialogEditTrx(false);
        setSelectedTrx(null);
        setLoading(false);
      },
    });
  };
  const handleTambahGoal = (nama: string, target: number, tanggalTarget: string) => {
    setLoading(true)
    handleApiAction({
      action: () => tambahGoal({ nama, target, tanggalTarget }),
      successMessage: 'Goal berhasil ditambahkan',
      onSuccess: () => {
        setIsOpenTambahGoal(false)
        fetchData()
      },
      onFinally: () => setLoading(false),
    })
  }


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        <HeaderDashboard
          onTambahAkun={() => setIsOpenTambahAkun(true)}
          onTambahTransaksi={() => setIsOpenTambahTransaksi(true)}
          onTambahGoal={() => setIsOpenTambahGoal(true)}
          onTambahKategori={() => setIsOpenTambahKategori(true)}
          onRefresh={fetchData}
        />

        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-3">Daftar Akun</h2>
          <ListAkunSection
            listAkun={listAkun}
            onEdit={(akun) => {
              setAkunYangDiedit(akun);
              setIsOpenEditAkun(true);
            }}
            onHapus={(id) => {
              const akun = listAkun.find(a => a.id === id);
              if (akun) {
                setAkunYangDihapus(akun);
                setDialogKonfirmasiHapusAkun(true);
              }
            }}
          />
        </section>

        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-3">Statistik Ringkasan Bulan Ini</h2>
          <StatistikRingkasSection
            totalSaldo={statistikRingkas?.totalSaldo ?? 0}
            totalPemasukan={statistikRingkas?.totalPemasukanBulanIni ?? 0}
            totalPengeluaran={statistikRingkas?.totalPengeluaranBulanIni ?? 0}
            netCashflow={statistikRingkas?.cashflowBulanIni ?? 0}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CashflowChartSection />
          <KategoriStatistikSection data={dataStatistik} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RingkasanGoalSection goals={recentGoal} />
          <TransaksiTerakhirSection
            data={recentTransaksi}
            loading={loading}
            onClickTrx={(trx) => {
              setSelectedTrx(trx);
              setDialogEditTrx(true);
            }}
            onDelete={(trx) => {
              setSelectedTrx(trx);
              setDialogHapusTrx(true);
            }}
          />
        </section>
      </div>

      {/* Dialog Tambah */}
      <DialogTambahTransaksi
        isOpen={isOpenTambahTransaksi}
        isLoading={false}
        akunOptions={listAkun}
        onClose={() => setIsOpenTambahTransaksi(false)}
        onSubmit={handleTambahTransaksi}
      />
      <DialogTambahGoal
        isOpen={isOpenTambahGoal}
        isLoading={false}
        onClose={() => setIsOpenTambahGoal(false)}
        onSubmit={(nama, target, tanggalTarget) => {
          handleTambahGoal(nama, target, tanggalTarget);
          fetchData();
        }}
      />
      <DialogTambahKategori
        isOpen={isOpenTambahKategori}
        isLoading={false}
        onClose={() => setIsOpenTambahKategori(false)}
        onSubmit={(nama, jenis) => {
          console.log("Tambah kategori:", { nama, jenis });
          setIsOpenTambahKategori(false);
          fetchData();
        }}
      />
      <AddAccountDialog
        isOpen={isOpenTambahAkun}
        isLoading={false}
        onClose={() => setIsOpenTambahAkun(false)}
        onSubmit={handleTambahAkun}
      />
      <EditAccountDialog
        isOpen={isOpenEditAkun}
        isLoading={false}
        akun={akunYangDiedit}
        onClose={() => {
          setIsOpenEditAkun(false);
          setAkunYangDiedit(null);
        }}
        onSubmit={(id, namaBaru) => {
          handleEditNamaAkun(id, namaBaru);
        }}
      />

      {/* Dialog Edit & Hapus Transaksi */}
      <DialogEditTransaksi
        isOpen={dialogEditTrx}
        isLoading={false}
        transaksiData={selectedTrx}
        akunOptions={listAkun}
        onClose={() => {
          setDialogEditTrx(false);
          setSelectedTrx(null);
        }}
        onSubmit={handleEditTransaksi}
      />
      <ConfirmDialog
        isOpen={dialogHapusTrx}
        onClose={() => {
          setDialogHapusTrx(false);
          setSelectedTrx(null);
        }}
        title="Hapus transaksi"
        description="Data yang dihapus tidak dapat dikembalikan!"
        confirmText="Ya, hapus"
        onConfirm={() => {
          console.log("Transaksi dihapus:", selectedTrx);
          setDialogHapusTrx(false);
          fetchData();
        }}
      />
      <ConfirmDialog
        isOpen={dialogKonfirmasiHapusAkun}
        onClose={() => {
          setDialogKonfirmasiHapusAkun(false);
          setAkunYangDihapus(null);
        }}
        title="Hapus Akun"
        description={`Akun "${akunYangDihapus?.nama}" akan dihapus beserta seluruh transaksi terkait. Lanjutkan?`}
        confirmText="Ya, hapus akun"
        onConfirm={async () => {
          if (!akunYangDihapus) return;
          await handleHapusAkun(akunYangDihapus.id);
          setDialogKonfirmasiHapusAkun(false);
          setAkunYangDihapus(null);
        }}
      />
    </main>
  );
}
