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
  RingkasanBulanIniResponse,
  getRecentDashboard
} from '@/actions/dashboard';
import {
  getAllAkun,
} from '@/actions/akun';
import { handleApiAction } from '@/lib/api';

// Komponen
import HeaderDashboard from './components/Header';
import ListAkunSection from './akun/components/ListAkun';
import CashflowChartSection from './components/CashflowChart';
import StatistikRingkasSection from './components/StatistikRingkasan';
import TransaksiTerakhirSection from './components/TransaksiTerakhir';
import DialogEditTransaksi from '@/components/dialog/transaksi/DialogEditTransaksi';
import DialogTambahGoal from '@/components/dialog/goal/DialogTambahGoal';
import DialogTambahKategori from '@/components/dialog/kategori/DialogTambahKategori';
import DialogTambahTransaksi from '@/components/dialog/transaksi/DialogTambahTransaksi';
import DialogTambahAkun from '@/components/dialog/akun/DialogTambahAkun';
import RingkasanGoalSection from './components/RingkasanGoal';
import KategoriStatistikSection from './components/KategoriStatistikSection';
import DialogEditAkun from '@/components/dialog/akun/DialogEditAkun';
import { confirmDialog } from '@/lib/confirm-dialog';
import { handler_DeleteAkun, handler_GetAkun } from '@/actions/v2/handlers/akun';
import { handler_GetGoal, handler_PostGoal } from '@/actions/v2/handlers/goal';
import { PostGoalParams } from '@/actions/goal';
import { useDialog } from '@/hooks/dialog';
import { handler_GetTransaksi_terbaru } from '@/actions/v2/handlers/transaksi';
import { TransaksiModel } from '@/types/model/Transaksi';
import { AkunModel } from '@/types/model/akun';
import { GoalModel } from '@/types/model/Goal';
import { handler_GetStatistik_ringkasan } from '@/actions/v2/handlers/statistik';

export default function DashboardPage() {
  const [selectedTrx, setSelectedTrx] = useState<TransaksiModel | null>(null);
  const [loading, setLoading] = useState(false);

  const [listAkun, setListAkun] = useState<AkunModel[]>([]);
  const [recentTransaksi, setRecentTransaksi] = useState<TransaksiModel[]>([]);
  const [statistikRingkas, setStatistikRingkas] = useState<RingkasanBulanIniResponse | null>(null);
  const [recentGoal, setGoalList] = useState<GoalModel[]>([]);

  const dialogEditAkun = useDialog();
  const dialogEditTransaksi = useDialog();

  const dialogTambahAkun = useDialog();
  const dialogTambahTransaksi = useDialog();
  const dialogTambahGoal = useDialog();
  const dialogTambahKategori = useDialog();

  const [akunYangDiedit, setAkunYangDiedit] = useState<AkunModel | null>(null);

  const fetchAkun = () => {
    handler_GetAkun(
      {
        whenSuccess: setListAkun
      }
    )
  };

  const fetchGoal = () => {
    handler_GetGoal(
      {
        whenSuccess: (data) => {
          setGoalList(data.content)
        }
      },
      { page: 0, size: 10, tercapai: false }
    )
  };

  const fetchRecentTransaksi = () => {
    handler_GetTransaksi_terbaru(
      {
        whenSuccess: (data) => {
          setRecentTransaksi(data)
        }
      }
    )
  };

  const fetchDataRingkasanBulanIni = () => {
    handler_GetStatistik_ringkasan(
      {
        whenSuccess: (data) => setStatistikRingkas(data)
      }
    )
  };

  const fetchData = () => {
    fetchAkun();
    fetchGoal();
    fetchRecentTransaksi();
    fetchDataRingkasanBulanIni();
  };

  const handleHapusAkun = (akun: AkunModel) => {
    confirmDialog.show(
      {
        title: "Hapus Akun",
        description: "Anda yakin? SEMUA DATA TRANSAKSI AKAN DIHAPUS DAN data tidak dapat dikembalikan!",
        confirmText: "Ya, hapus",
        onConfirm: () => {
          handler_DeleteAkun(
            {
              setLoading,
              toaster: toast,
              whenSuccess: () => fetchData()
            },
            akun.id
          )
        }
      }
    )
  }

  const handleHapusTransaksi = (trx: TransaksiModel) => {
    confirmDialog.show(
      {
        title: "Hapus data",
        description: "Anda yakin? transaksi tidak dapat dihapus!",
        onConfirm: () => {

        }
      }
    )
  }

  const handleTambahGoal = (nama: string, target: number, tanggalTarget: string) => {
    const body: PostGoalParams = { nama, target, tanggalTarget }

    handler_PostGoal(
      {
        setLoading,
        toaster: toast,
        whenSuccess: () => {
          dialogTambahGoal.open()
          fetchData()
        }
      },
      body
    )
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        <HeaderDashboard
          onTambahAkun={dialogTambahAkun.open}
          onTambahTransaksi={dialogTambahTransaksi.open}
          onTambahGoal={dialogTambahGoal.open}
          onTambahKategori={dialogTambahKategori.open}
          onRefresh={fetchData}
        />
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-3">Daftar Akun</h2>
          <ListAkunSection
            listAkun={listAkun}
            onEdit={(akun) => {
              setAkunYangDiedit(akun);
              dialogEditAkun.close()
            }}
            onHapus={handleHapusAkun}
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
          <TransaksiTerakhirSection
            data={recentTransaksi}
            loading={loading}
            onClickTrx={(trx) => {
              setSelectedTrx(trx);
              dialogEditTransaksi.close()
            }}
            onDelete={handleHapusTransaksi}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RingkasanGoalSection goals={recentGoal} />
        </section>
      </div>

      {/* Dialog Tambah */}
      <DialogTambahTransaksi
        isOpen={dialogTambahTransaksi.isOpen}
        akunOptions={listAkun}
        closeDialog={() => dialogTambahTransaksi.close}
        whenSuccess={() => {
          dialogTambahTransaksi.open()
          fetchData()
        }} />
      <DialogTambahGoal
        isOpen={dialogTambahGoal.isOpen}
        onClose={dialogTambahGoal.close}
        onSubmit={(nama, target, tanggalTarget) => {
          dialogTambahGoal.close()
          handleTambahGoal(nama, target, tanggalTarget);
          fetchData();
        }}
      />
      <DialogTambahKategori
        isOpen={dialogTambahKategori.isOpen}
        isLoading={false}
        onClose={dialogTambahKategori.close}
      />
      <DialogTambahAkun
        isOpen={dialogTambahAkun.isOpen}
        isLoading={false}
        closeDialog={dialogTambahAkun.close}
        whenSuccess={fetchAkun}
      />
      <DialogEditAkun
        isOpen={dialogEditAkun.isOpen}
        akun={akunYangDiedit}
        closeDialog={() => {
          dialogEditAkun.close()
          setAkunYangDiedit(null)
        }}
        whenSuccess={() => {
          fetchAkun()
        }}
      />

      {/* Dialog Edit & Hapus Transaksi */}
      <DialogEditTransaksi
        isOpen={dialogEditTransaksi.isOpen}
        isLoading={false}
        transaksiData={selectedTrx}
        akunOptions={listAkun}
        closeDialog={dialogEditTransaksi.close}
        whenSuccess={() => {
          dialogEditTransaksi.close()
          setSelectedTrx(null)
          fetchData()
        }}
      />
    </main>
  );
}
