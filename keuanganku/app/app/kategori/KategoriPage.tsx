'use client';

import { useEffect, useState } from "react"
import ListKategori from "./components/SectionListKategori";
import HeaderKategori from "./components/HeaderKategori";
import PanelDetailKategori from "./components/PanelDetailKategori";

export type Kategori = {
    id: string
    nama: string
    jenis: 'PEMASUKAN' | 'PENGELUARAN'
}

export default function KategoriPage() {
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [kategoriDipilih, setKategoriDipilih] = useState<Kategori | null>(null)

    const fetchData = async () => {
        // Simulasi fetch kalau nanti pakai API
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handlePilihKategori = (kategori: Kategori) => {
        setKategoriDipilih(kategori);
    }

    return (
        <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
            <div className="max-w-[1280px] mx-auto">
                <HeaderKategori
                    onTambahKategoriClick={() => { }}
                    fetchData={() => { }}
                />

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ListKategori onPilihKategori={handlePilihKategori} />
                    <PanelDetailKategori kategori={kategoriDipilih} />
                </section>
            </div>
        </main>
    )
}
