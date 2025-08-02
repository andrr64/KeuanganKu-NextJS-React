'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

import { useDialog } from '@/hooks/dialog';
import { AkunResponse } from '@/types/akun';
import { TransaksiResponse } from '@/types/transaksi';
import { TransaksiModel } from '@/models/Transaksi';
import { getRingkasan, RingkasanKategoriItem, RingkasanKategoriResponse } from '@/actions/transaksi';
import { getColors } from '@/lib/utils';
import { confirmDialog } from '@/lib/confirm-dialog';
import { handleApiAction } from '@/lib/api';

// Handlers (akan diisi ulang di platform lain, seperti React Native)
import {
  handler_GetAkun,
  handler_PostAkun,
  handler_PatchAkun_nama,
} from '@/actions/v2/handlers/akun';
import { handler_GetTransaksi, handler_DeleteTransaksi } from '@/actions/v2/handlers/transaksi';

// Komponen UI (bisa diganti saat porting)
import Header from './components/Header';
import ListAkunSection from './components/ListAkun';
import TransaksiTerbaruSection from './components/TransaksiTerbaru';
import RingkasanUangSection from './components/RingkasanUang';
import EmptyAkunState from './components/EmptyAkunState';
import LoadingP from '@/components/LoadingP';
import ErrorPage from '@/components/pages/ErrorPage';
import DialogTambahTransaksi from '@/components/dialog/transaksi/DialogTambahTransaksi';
import DialogEditTransaksi from '@/components/dialog/transaksi/DialogEditTransaksi';
import DialogTambahAkun from '@/components/dialog/akun/DialogTambahAkun';
import DialogEditAkun from '@/components/dialog/akun/DialogEditAkun';
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi';
import { AkunModel } from '@/models/Akun';
import { title } from 'process';
import { handler_HapusAkun } from '@/actions/handler/transaksi';

// Tipe tambahan
type RingkasanKategoriItemWithColor = RingkasanKategoriItem & { warna: string };

export default function AkunPage() {
  // State
  const [accountList, setAccountList] = useState<AkunResponse[]>([]);
  const [isAccountEmpty, setIsAccountEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dialogs
  const addAccountDialog = useDialog();
  const editAccountDialog = useDialog();
  const deleteAccountDialog = useDialog();
  const addTransactionDialog = useDialog();
  const editTransactionDialog = useDialog();

  // Filters & Pagination
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [timeFilter, setTimeFilter] = useState<string>('semua');
  const [accountFilter, setAccountFilter] = useState('semua');
  const [transactionType, setTransactionType] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived states
  const accountOptions = ['semua', ...accountList.map((acc) => acc.nama)];
  const [summaryExpenseList, setSummaryExpenseList] = useState<RingkasanKategoriItemWithColor[]>([]);
  const [summaryIncomeList, setSummaryIncomeList] = useState<RingkasanKategoriItemWithColor[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<TransaksiResponse[]>([]);

  // Selected items
  const [editingAccount, setEditingAccount] = useState<AkunResponse | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransaksiResponse | null>(null);

  // --- Fetch Functions (Modular & Reusable) ---

  const fetchSummary = async () => {
    setIsLoading(true);
    await handleApiAction<RingkasanKategoriResponse>({
      action: () => getRingkasan(selectedPeriod),
      onSuccess: (data) => {
        const expenseColors = getColors(data.pengeluaran.length);
        const incomeColors = getColors(data.pemasukan.length);

        setSummaryExpenseList(
          data.pengeluaran.map((item, index) => ({
            ...item,
            warna: expenseColors[index],
          }))
        );

        setSummaryIncomeList(
          data.pemasukan.map((item, index) => ({
            ...item,
            warna: incomeColors[index],
          }))
        );
      },
      onFinally: () => setIsLoading(false),
    });
  };

  const fetchTransactions = async () => {
    let startDate: string | undefined = undefined;
    let endDate: string | undefined = undefined;

    if (timeFilter !== 'semua') {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = toZonedTime(new Date(), timezone);

      if (timeFilter === 'hari') {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        startDate = formatInTimeZone(startOfDay, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        endDate = formatInTimeZone(now, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
      } else if (timeFilter === 'minggu') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        startDate = formatInTimeZone(sevenDaysAgo, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        endDate = formatInTimeZone(now, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
      } else if (timeFilter === 'bulan') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = formatInTimeZone(startOfMonth, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        endDate = formatInTimeZone(now, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
      } else if (timeFilter === 'tahun') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        startDate = formatInTimeZone(startOfYear, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        endDate = formatInTimeZone(now, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
      }
    }

    const accountId =
      accountFilter !== 'semua'
        ? accountList.find((acc) => acc.nama === accountFilter)?.id
        : undefined;

    const params = {
      startDate,
      endDate,
      jenis: transactionType === 0 ? undefined : transactionType,
      idAkun: accountId,
      page: currentPage,
      size: pageSize,
      search: searchQuery || '',
    };

    await handler_GetTransaksi({
      whenSuccess: (pageable) => {
        setLatestTransactions(pageable.content);
        setTotalPages(pageable.totalPages);
      },
      whenFailed: (err) => {
        toast.error(err);
      },
    }, params);
  };

  const fetchAccounts = async () => {
    await handler_GetAkun({
      setLoading: setIsLoading,
      whenSuccess: (accounts) => {
        setAccountList(accounts);
      },
      whenFailed: (err) => {
        toast.error(err);
        setIsAccountEmpty(true);
        setAccountList([]);
      },
    });
  };

  // --- Action Handlers (siap di-port ke React Native) ---

  const handleAddAccount = (data: { nama: string; saldoAwal: number }) => {
    if (!data.nama.trim()) return toast.error('Nama akun tidak boleh kosong.');
    if (data.saldoAwal < 0) return toast.error('Saldo awal tidak boleh negatif.');

    handler_PostAkun(
      {
        setLoading: setIsLoading,
        toaster: toast,
        whenSuccess: () => {
          refreshAllData();
          addAccountDialog.close();
        },
      },
      { nama: data.nama, saldoAwal: data.saldoAwal }
    );
  };

  const handleEditAccount = (id: string, newName: string) => {
    if (!newName.trim()) return toast.error('Nama akun tidak boleh kosong.');

    handler_PatchAkun_nama(
      {
        setLoading: setIsLoading,
        toaster: toast,
        whenSuccess: () => {
          fetchAccounts();
          editAccountDialog.close();
        },
      },
      { id, nama: newName }
    );
  };

  const handleDeleteAccount = (akun: AkunModel) => {
    confirmDialog.show(
      {
        title: "Hapus Akun?",
        description: "Anda yakin? data tidak bisa dikembalikan",
        confirmText: "Ya, hapus",
        onConfirm: () => {
          handler_HapusAkun({
            toaster: toast,
            setLoading: setIsLoading,
            id: akun.id,
            whenSuccess: () => {
              refreshAllData();
              deleteAccountDialog.close();
            },
          });
        }
      }
    )
    if (!akun?.id) return;
  };

  const handleDeleteTransaction = (transaction: TransaksiModel) => {
    if (!transaction) return;

    confirmDialog.show({
      title: 'Hapus transaksi',
      description: 'Apakah anda yakin ingin menghapus transaksi ini? Data tidak dapat dikembalikan!',
      confirmText: 'Ya, hapus',
      onConfirm: () => {
        handler_DeleteTransaksi(
          {
            toaster: toast,
            whenSuccess: () => {
              refreshAllData();
            },
          },
          transaction.id
        );
      },
    });
  };

  const refreshAllData = async (showLoading = false) => {
    try {
      setIsFetching(showLoading);
      await new Promise((res) => setTimeout(res, 500));
      await fetchAccounts();
      await fetchTransactions();
      await fetchSummary();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setIsFetching(false);
    }
  };

  // --- Effects ---

  useEffect(() => {
    setIsAccountEmpty(accountList.length === 0);
  }, [accountList]);

  useEffect(() => {
    refreshAllData(true);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [timeFilter, accountFilter, transactionType, currentPage, pageSize]);

  useEffect(() => {
    fetchTransactions();
    setCurrentPage(0);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(0);
  }, [timeFilter, accountFilter, transactionType, pageSize]);

  useEffect(() => {
    fetchSummary();
  }, [selectedPeriod]);

  // --- Render ---

  if (errorMessage) return <ErrorPage message={errorMessage} />;
  if (isFetching) return <LoadingP />;
  if (isAccountEmpty) {
    return (
      <>
        <DialogTambahAkun
          isOpen={addAccountDialog.isOpen}
          isLoading={false}
          closeDialog={addAccountDialog.close}
          whenSuccess={() => {
            addAccountDialog.close()
            fetchAccounts()
          }}
        />
        <EmptyAkunState onTambahClick={addAccountDialog.open} />
      </>
    );
  }

  return (
    <>
      {/* Dialogs */}
      <DialogEditTransaksi
        isOpen={editTransactionDialog.isOpen}
        isLoading={false}
        closeDialog={editTransactionDialog.close}
        akunOptions={accountList}
        transaksiData={selectedTransaction}
        whenSuccess={() => {
          setSelectedTransaction(null);
          refreshAllData();
        }}
      />

      <DialogTambahTransaksi
        isOpen={addTransactionDialog.isOpen}
        closeDialog={addTransactionDialog.close}
        whenSuccess={refreshAllData}
        akunOptions={accountList}
      />

      <DialogEditAkun
        isOpen={editAccountDialog.isOpen}
        akun={editingAccount}
        closeDialog={() => {
          setEditingAccount(null)
          editAccountDialog.close()
        }}
        whenSuccess={() => {
          setEditingAccount(null)
          editAccountDialog.close()
          fetchAccounts()
        }}
      />

      <DialogTambahAkun
        isOpen={addAccountDialog.isOpen}
        isLoading={false}
        closeDialog={addAccountDialog.close}
        whenSuccess={() => {
          addAccountDialog.close()
          fetchAccounts()
        }}
      />

      {/* Main Content */}
      <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
        <div className="max-w-[1280px] flex flex-col gap-8 mx-auto md:mx-0">
          <Header
            fetchData={() => refreshAllData(false)}
            onTambahTransaksiClick={addTransactionDialog.open}
            onTambahAkunClick={addAccountDialog.open}
          />

          <ListAkunSection
            listAkun={accountList}
            onEdit={(akun) => {
              setEditingAccount(akun);
              editAccountDialog.open();
            }}
            onHapus={(id) => {
              const akun = accountList.find((a) => a.id === id);
              if (akun) {
                handleDeleteAccount(akun)
              }
            }}
          />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransaksiTerbaruSection
              onClickTrx={(trx) => {
                setSelectedTransaction(trx);
                editTransactionDialog.open();
              }}
              onDelete={handleDeleteTransaction}
              transaksi={latestTransactions}
              filterWaktu={timeFilter}
              filterAkun={accountFilter}
              jenisTransaksi={transactionType}
              akunOptions={accountOptions}
              setFilterWaktu={setTimeFilter}
              setFilterAkun={setAccountFilter}
              setJenisTransaksi={setTransactionType}
              page={currentPage}
              setPage={setCurrentPage}
              totalPages={totalPages}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              size={pageSize}
              setSize={setPageSize}
            />

            <RingkasanUangSection
              periode={selectedPeriod}
              setPeriode={setSelectedPeriod}
              pengeluaranList={summaryExpenseList}
              pemasukanList={summaryIncomeList}
            />
          </section>
        </div>
      </main>
    </>
  );
}