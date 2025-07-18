'use client';

import { useEffect, useState } from "react"
import ListKategori from "./components/SectionListKategori";
import HeaderKategori from "./components/HeaderKategori";
import { KategoriResponse } from "@/types/kategori";
import DialogEditKategori from "@/components/dialog/DialogEditKategori";

export default function KategoriPage() {
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [kategoriDipilih, setKategoriDipilih] = useState<KategoriResponse | null>(null);

    const fetchData = async () => {
        setLoadingFetch(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingFetch(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePilihKategori = (kategori: KategoriResponse) => {
        setKategoriDipilih(kategori);
    };

    const handleCloseDialog = () => {
        setKategoriDipilih(null);
    };

    const handleSubmit = (id: string, nama: string, jenis: 1 | 2) => {
        console.log('📝 Simpan:', { id, nama, jenis });
        setKategoriDipilih(null);
    };

    const handleDelete = (id: string) => {
        console.log('🗑️ Hapus:', id);
        setKategoriDipilih(null);
    };

    return (
        <>
            {/* MODAL EDIT */}
            <DialogEditKategori
                isOpen={kategoriDipilih !== null}
                isLoading={false}
                kategori={kategoriDipilih}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />

            {/* MAIN LAYOUT */}
            <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8 min-h-screen">
                <div className="max-w-screen-lg mx-auto">
                    <HeaderKategori
                        onTambahKategoriClick={() => { }}
                        fetchData={fetchData}
                    />

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <ListKategori onPilihKategori={handlePilihKategori} />
                    </section>
                </div>
            </main>
        </>
    );
}
