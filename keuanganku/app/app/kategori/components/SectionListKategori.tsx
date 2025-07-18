'use client'

import { getFilteredKategori } from '@/actions/kategori'
import LoadingP from '@/components/LoadingP'
import { KategoriResponse } from '@/types/kategori'
import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

type Props = {
    onPilihKategori: (kategori: KategoriResponse) => void
}

export default function ListKategori({ onPilihKategori }: Props) {
    const [kategoriList, setKategoriList] = useState<KategoriResponse[]>([])
    const [kategoriTersaring, setKategoriTersaring] = useState<KategoriResponse[]>([])
    const [filterJenis, setFilterJenis] = useState<0 | 1 | 2>(0)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [loading, setLoading] = useState<boolean>(true)

    // ➕ Tambahan pagination state
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(5)
    const [totalPages, setTotalPages] = useState(3) // dummy

    const fetchData = async () => {
        try {
            const response = await getFilteredKategori({
                page,
                size,
                keyword: searchKeyword.trim() !== '' ? searchKeyword : undefined,
                jenis: filterJenis !== 0 ? filterJenis : undefined,
            })

            if (response && response.data) {
                const { content, totalPages: tp } = response.data
                setKategoriList(content)
                setTotalPages(tp)
            } else {
                setKategoriList([])
                setTotalPages(0)
            }
        } catch (error) {
            console.error("Gagal mengambil data kategori:", error)
            setKategoriList([])
            setTotalPages(0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filterJenis, searchKeyword, page, size])

    const filterData = () => {
        let filtered = [...kategoriList]

        if (filterJenis !== 0) {
            filtered = filtered.filter(k => k.jenis === filterJenis)
        }

        if (searchKeyword.trim() !== '') {
            filtered = filtered.filter(k =>
                k.nama.toLowerCase().includes(searchKeyword.toLowerCase())
            )
        }

        setKategoriTersaring(filtered)
    }

    useEffect(() => {
        filterData()
    }, [kategoriList, filterJenis, searchKeyword, size, page])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchKeyword('')
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors w-full">
            <div className="mb-6 flex flex-col gap-2">
                <div>
                    <h2 className="text-md font-semibold">Data</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manajemen kategori pemasukan dan pengeluaran
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr] gap-3">
                    {/* Filter Jenis */}
                    <div>
                        <label htmlFor="filterJenis" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                            Filter Jenis
                        </label>
                        <select
                            id="filterJenis"
                            value={filterJenis}
                            onChange={(e) => setFilterJenis(Number(e.target.value) as 0 | 1 | 2)}
                            className="focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
                        >
                            <option value={0}>Semua Jenis</option>
                            <option value={1}>Pengeluaran</option>
                            <option value={2}>Pemasukan</option>
                        </select>
                    </div>

                    {/* Jumlah Data per Page */}
                    <div>
                        <label htmlFor="size" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                            Jumlah Data
                        </label>
                        <select
                            id="size"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                            className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
                        >
                            <option value={5}>5 data</option>
                            <option value={10}>10 data</option>
                            <option value={25}>25 data</option>
                        </select>
                    </div>

                    {/* Search Input - versi baru */}
                    <div>
                        <label htmlFor="search" className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                            Cari Kategori
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Cari kategori..."
                                value={searchKeyword}
                                onChange={handleSearch}
                                className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 pr-10 rounded-md border border-gray-300 dark:border-gray-600"
                            />
                            {searchKeyword && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* LIST */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[560px]">
                {loading ? (
                    <li className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                        <LoadingP />
                    </li>
                ) : kategoriTersaring.length === 0 ? (
                    <li className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                        Tidak ada kategori.
                    </li>
                ) : (
                    kategoriTersaring.map((kategori) => (
                        <li
                            key={kategori.id}
                            onClick={() => onPilihKategori(kategori)}
                            className="py-4 flex items-center justify-between px-3 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[.98] cursor-pointer"
                        >
                            <div>
                                <p className="font-medium text-sm">{kategori.nama}</p>
                                <p
                                    className={`text-xs font-medium ${kategori.jenis === 2
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                        }`}
                                >
                                    {kategori.jenis === 1 ? 'Pengeluaran' : 'Pemasukan'}
                                </p>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-end items-center gap-2 text-sm">
                <button
                    onClick={() => page > 0 && setPage(page - 1)}
                    disabled={page === 0}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                    ← Prev
                </button>
                <span>
                    Halaman {page + 1} dari {totalPages}
                </span>
                <button
                    onClick={() => page < totalPages - 1 && setPage(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                    Next →
                </button>
            </div>
        </div>
    )
}
