'use client'

import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

type Kategori = {
    id: string
    nama: string
    jenis: 'PEMASUKAN' | 'PENGELUARAN'
}

type Props = {
    onPilihKategori: (kategori: Kategori) => void
}

export default function ListKategori({ onPilihKategori }: Props) {
    const [kategoriList, setKategoriList] = useState<Kategori[]>([])
    const [filterJenis, setFilterJenis] = useState<'SEMUA' | 'PEMASUKAN' | 'PENGELUARAN'>('SEMUA')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [kategoriTersaring, setKategoriTersaring] = useState<Kategori[]>([])

    const fetchData = async () => {
        await new Promise(resolve => setTimeout(resolve, 500)) // simulasi delay
        setKategoriList([
            { id: '1', nama: 'Gaji', jenis: 'PEMASUKAN' },
            { id: '2', nama: 'Makanan', jenis: 'PENGELUARAN' },
            { id: '3', nama: 'Transportasi', jenis: 'PENGELUARAN' },
            { id: '4', nama: 'Bonus', jenis: 'PEMASUKAN' },
            { id: '5', nama: 'Investasi', jenis: 'PEMASUKAN' },
        ])
    }

    useEffect(() => {
        fetchData()
    }, [])

    // ⛏️ Filtering handler
    const filterData = () => {
        let filtered = [...kategoriList]

        if (filterJenis !== 'SEMUA') {
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
    }, [kategoriList, filterJenis, searchKeyword])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchKeyword('')
    }

    return (
        <div className="bg-white h-[512px] dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors w-full">
            <div className="mb-4 flex flex-col gap-2">
                <div>
                    <h2 className="text-md font-semibold">Kategori</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manajemen kategori pemasukan dan pengeluaran
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                    {/* Filter Jenis */}
                    <div>
                        <label
                            htmlFor="filterJenis"
                            className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block"
                        >
                            Filter Jenis
                        </label>
                        <select
                            id="filterJenis"
                            value={filterJenis}
                            onChange={(e) => setFilterJenis(e.target.value as any)}
                            className="focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
                        >
                            <option value="SEMUA">Semua Jenis</option>
                            <option value="PEMASUKAN">Pemasukan</option>
                            <option value="PENGELUARAN">Pengeluaran</option>
                        </select>
                    </div>

                    {/* Search Input */}
                    <div>
                        <label
                            htmlFor="search"
                            className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block"
                        >
                            Cari Kategori
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={searchKeyword}
                                onChange={handleSearch}
                                placeholder="Cari nama kategori..."
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {searchKeyword && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[400px]">
                {kategoriTersaring.length === 0 ? (
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
                                    className={`text-xs font-medium ${kategori.jenis === 'PEMASUKAN'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                        }`}
                                >
                                    {kategori.jenis}
                                </p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}
