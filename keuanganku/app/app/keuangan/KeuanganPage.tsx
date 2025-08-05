'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

import { useDialog } from '@/hooks/dialog';
import { AkunResponse } from '@/types/akun';
import { TransaksiResponse } from '@/types/transaksi';
import { getRingkasan, RingkasanKategoriItem, RingkasanKategoriResponse } from '@/actions/transaksi';
import { getColors } from '@/lib/utils';
import { confirmDialog } from '@/lib/confirm-dialog';
import { handleApiAction } from '@/lib/api';
import { handler_GetAkun } from '@/actions/v2/handlers/akun';
import { handler_GetTransaksi, handler_DeleteTransaksi } from '@/actions/v2/handlers/transaksi';

import Header from './components/Header';
import ListAkunSection from './components/ListAkun';
import TransaksiTerbaruSection from './components/TransaksiTerbaru';
import RingkasanUangSection from './components/RingkasanUang';
import EmptyAkunState from './components/EmptyAkunState';
import LoadingP from '@/components/LoadingP';
import ErrorPage from '@/components/pages/ErrorPage';
import DialogTambahAkun from '@/components/dialog/akun/DialogTambahAkun';
import { handler_HapusAkun } from '@/actions/handler/transaksi';
import { AkunModel } from '@/types/model/akun';
import { usePageState } from '@/hooks/pagestate';
import { handler_GetStatistik_transaksiTiapKategori } from '@/actions/v2/handlers/statistik';

type RingkasanKategoriItemWithColor = RingkasanKategoriItem & { warna: string };

export default function AkunPage() {
  const [accountList, setAccountList] = useState<AkunResponse[]>([]);
  const [isAccountEmpty, setIsAccountEmpty] = useState(false);

  const addAccountDialog = useDialog();

  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [timeFilter, setTimeFilter] = useState<string>('semua');
  const [accountFilter, setAccountFilter] = useState('semua');
  const [transactionType, setTransactionType] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const accountOptions = ['semua', ...accountList.map((acc) => acc.nama)];
  const [summaryExpenseList, setSummaryExpenseList] = useState<RingkasanKategoriItemWithColor[]>([]);
  const [summaryIncomeList, setSummaryIncomeList] = useState<RingkasanKategoriItemWithColor[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<TransaksiResponse[]>([]);

  const pageState = usePageState(true)

  const fetchSummary = async () => {
    await handler_GetStatistik_transaksiTiapKategori(
      {
        whenSuccess: (data) => {
          console.log(data)
          const expenseColors = getColors(data.pengeluaran.length);
          const incomeColors = getColors(data.pemasukan.length);
          setSummaryExpenseList(
            data.pengeluaran.map((item, index) => ({ ...item, warna: expenseColors[index] }))
          );
          setSummaryIncomeList(
            data.pemasukan.map((item, index) => ({ ...item, warna: incomeColors[index] }))
          );
        },
        throwError: true
      },
      selectedPeriod
    )
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
      throwError: true
    }, params);
  };

  const fetchAccounts = async () => {
    await handler_GetAkun({
      whenSuccess: (accounts) => setAccountList(accounts)
    });
  };

  const handleDeleteAccount = (akun: AkunModel) => {
    if (!akun?.id) return;
    confirmDialog.show({
      title: "Hapus Akun?",
      description: "Anda yakin? data tidak bisa dikembalikan",
      confirmText: "Ya, hapus",
      onConfirm: () => {
        handler_HapusAkun({
          toaster: toast,
          id: akun.id,
          whenSuccess: () => {
            refreshAllData();
          },
        });
      }
    });
  };

  const refreshAllData = async () => {
    try {
      pageState.loading();
      await fetchAccounts();
      await fetchTransactions();
      await fetchSummary();
      pageState.resetError();
    } catch (error: any) {
      if (error && !pageState.isError) {
        pageState.setError(error.message || 'Terjadi kesalahan saat mengambil data.');
      }
    } finally {
      pageState.finished();
    }
  };

  useEffect(() => {
    setIsAccountEmpty(accountList.length === 0);
  }, [accountList]);

  useEffect(() => {
    refreshAllData();
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

  if (pageState.isError) return <ErrorPage message={pageState.error!} />;
  if (pageState.loadingStatus) return <LoadingP />;
  if (isAccountEmpty) {
    return (
      <>
        <DialogTambahAkun
          isOpen={addAccountDialog.isOpen}
          isLoading={false}
          closeDialog={addAccountDialog.close}
          whenSuccess={() => {
            addAccountDialog.close();
            fetchAccounts();
          }}
        />
        <EmptyAkunState onTambahClick={addAccountDialog.open} />
      </>
    );
  }

  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1280px] flex flex-col gap-8 mx-auto md:mx-0">
        <Header
          fetchData={() => refreshAllData()}
          onTambahTransaksiClick={() => { }}
          onTambahAkunClick={addAccountDialog.open}
        />

        <ListAkunSection
          listAkun={accountList}
          onEdit={() => { }}
          onHapus={handleDeleteAccount}
        />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransaksiTerbaruSection
            transaksi={latestTransactions}
            onClickTrx={() => { }}
            onDelete={() => { }}
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
  );
}
