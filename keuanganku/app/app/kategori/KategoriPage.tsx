'use client';

import { useEffect, useState } from "react";
import ListKategori from "./components/ListKategori";
import HeaderKategori from "./components/Header";
import { KategoriResponse } from "@/types/kategori";
import DialogEditKategori from "@/components/dialog/DialogEditKategori";
import DialogTambahKategori from "@/components/dialog/DialogTambahKategori";
import { getFilteredKategori, postKategori, updateKategori } from "@/actions/kategori";
import toast from "react-hot-toast";

export default function KategoriPage() {
    const [kategoriList, setKategoriList] = useState<KategoriResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [kategoriDipilih, setKategoriDipilih] = useState<KategoriResponse | null>(null);
    const [isOpenTambahKategori, setIsOpenTambahKategori] = useState(false);

    // Filter & pagination
    const [filterJenis, setFilterJenis] = useState<0 | 1 | 2>(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);

    const fetchData = async () => {
        setLoadingFetch(true);
        try {
            const response = await getFilteredKategori({
                page,
                size,
                keyword: searchKeyword.trim() || undefined,
                jenis: filterJenis !== 0 ? filterJenis : undefined,
            });

            if (response?.data) {
                setKategoriList(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                setKategoriList([]);
                setTotalPages(0);
            }
        } catch (e: any) {
            toast.error("Gagal mengambil data kategori");
        } finally {
            setLoadingFetch(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterJenis, searchKeyword, page, size]);

    const handlePilihKategori = (kategori: KategoriResponse) => {
        setKategoriDipilih(kategori);
    };

    const handleCloseDialog = () => {
        setKategoriDipilih(null);
    };

    const handleAddKategori = async (nama: string, jenis: 1 | 2) => {
        setLoadingFetch(true);
        try {
            const response = await postKategori({ nama, jenis });
            if (!response.success) throw new Error(response.message);
            await fetchData(); // refresh data
            setIsOpenTambahKategori(false);
            toast.success(response.message);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoadingFetch(false);
        }
    };

    const handleUpdateKategori = async (id: string, nama: string) => {
        setLoadingFetch(true);
        try {
            const response = await updateKategori({idKategori: id, nama})
            if (!response.success) throw new Error(response.message);
            await fetchData();
            setKategoriDipilih(null);
            toast.success(response.message);
        } catch(e: any){
            toast.error(e.message);
        } finally {
            setLoadingFetch(false);
        }
    };

    const handleDelete = (id: string) => {
        // todo: call delete API, then fetchData()
        setKategoriDipilih(null);
    };

    return (
        <>
            <DialogEditKategori
                isOpen={kategoriDipilih !== null}
                isLoading={loadingFetch}
                kategori={kategoriDipilih}
                onClose={handleCloseDialog}
                onSubmit={handleUpdateKategori}
                onDelete={handleDelete}
            />

            <DialogTambahKategori
                isOpen={isOpenTambahKategori}
                isLoading={loadingFetch}
                onClose={() => setIsOpenTambahKategori(false)}
                onSubmit={handleAddKategori}
            />
            <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
                <div className='max-w-[1080px] mx-auto md:mx-0'>
                    <HeaderKategori onTambahKategoriClick={() => setIsOpenTambahKategori(true)} />
                    <section className="grid grid-cols-1 gap-6 mt-6">
                        <ListKategori
                            loading={loadingFetch}
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
                            onPilihKategori={handlePilihKategori}
                        />
                    </section>
                </div>
            </main>
        </>
    );
}
