'use client';

import { useEffect, useState } from 'react';
import ListKategori from './components/ListKategori';
import HeaderKategori from './components/Header';
import { KategoriResponse } from '@/types/kategori';
import toast from 'react-hot-toast';
import {
    handler_deleteKategori,
    handler_fetchKategori,
    handler_tambahKategori,
    handler_updateKategori
} from '@/actions/v2/handlers/kategori';
import { useDialog } from '@/hooks/dialog';
import { confirmDialog } from '@/lib/confirm-dialog';
import DialogEditKategori from '@/components/dialog/kategori/DialogEditKategori';
import DialogTambahKategori from '@/components/dialog/kategori/DialogTambahKategori';

export default function KategoriPage() {
    const [kategoriList, setKategoriList] = useState<KategoriResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState<KategoriResponse | null>(null);

    // Dialog controllers
    const dialogEditKategori = useDialog();
    const dialogTambahKategori = useDialog();

    // Filters & pagination
    const [filterJenis, setFilterJenis] = useState<0 | 1 | 2>(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);

    /**
     * Fetch data with filters
     */
    const fetchData = () => {
        handler_fetchKategori(
            {
                setLoading,
                whenSuccess: (data) => {
                    setKategoriList(data.content);
                    setTotalPages(data.totalPages);
                },
                whenFailed: (msg) => {
                    toast.error(msg);
                    setKategoriList([]);
                    setTotalPages(0);
                },
            },
            {
                page,
                size,
                keyword: searchKeyword.trim() || undefined,
                jenis: filterJenis !== 0 ? filterJenis : undefined,
            }
        );
    };

    // Refetch when filters change
    useEffect(() => {
        fetchData();
    }, [filterJenis, searchKeyword, page, size]);

    /**
     * Handlers
     */
    const handleEditClick = (kategori: KategoriResponse) => {
        setSelectedKategori(kategori);
        dialogEditKategori.open();
    };

    const handleUpdate = (data: { nama: string }) => {
        if (!selectedKategori?.id) return;
        handler_updateKategori(
            {
                toaster: toast,
                whenSuccess: () => {
                    toast.success('Kategori diperbarui');
                    dialogEditKategori.close();
                    fetchData();
                },
            },
            { id: selectedKategori.id, nama: data.nama }
        );
    };

    const handleCreate = (data: { nama: string; jenis: 1 | 2 }) => {
        handler_tambahKategori(
            {
                toaster: toast,
                whenSuccess: () => {
                    toast.success('Kategori ditambahkan');
                    dialogTambahKategori.close();
                    fetchData();
                },
            },
            data
        );
    };

    const handleDelete = () => {
        if (!selectedKategori?.id) return;
        confirmDialog.show({
            title: 'Hapus Kategori?',
            description: 'Tindakan ini tidak bisa dibatalkan.',
            confirmText: 'Hapus',
            cancelText: 'Batal',
            onConfirm: () => {
                handler_deleteKategori(
                    {
                        toaster: toast,
                        whenSuccess: () => {
                            setSelectedKategori(null);
                            fetchData();
                        },
                    },
                    selectedKategori.id
                );
            },
        });
    };

    return (
        <>
            {/* Edit Dialog */}
            <DialogEditKategori
                isOpen={dialogEditKategori.isOpen}
                kategori={selectedKategori}
                onClose={dialogEditKategori.close}
                whenSuccess={() => {
                    setSelectedKategori(null)
                    fetchData()
                }}
            />

            <DialogTambahKategori 
                isOpen={dialogTambahKategori.isOpen} 
                onClose={dialogTambahKategori.close}
                whenSuccess={fetchData}
            />

            <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
                <div className="max-w-[1080px] mx-auto md:mx-0">
                    <HeaderKategori onTambahKategoriClick={dialogTambahKategori.open} />
                    <section className="grid grid-cols-1 gap-6 mt-6">
                        <ListKategori
                            loading={loading}
                            kategoriList={kategoriList}
                            totalPages={totalPages}
                            filterJenis={filterJenis}
                            setFilterJenis={setFilterJenis}
                            searchKeyword={searchKeyword}
                            setSearchKeyword={setSearchKeyword}
                            size={size}
                            setSize={setSize}
                            page={page}
                            setPage={setPage}
                            onPilihKategori={handleEditClick}
                        />
                    </section>
                </div>
            </main>
        </>
    );
}