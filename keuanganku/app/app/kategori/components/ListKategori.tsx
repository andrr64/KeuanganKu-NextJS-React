'use client'

import { KategoriResponse } from '@/types/kategori'
import LoadingP from '@/components/LoadingP'
import { FaTimes } from 'react-icons/fa'
import KategoriItem from '@/components/items/KategoriItem'

type Props = {
  loading: boolean
  kategoriList: KategoriResponse[]
  totalPages: number
  filterJenis: 0 | 1 | 2
  setFilterJenis: (val: 0 | 1 | 2) => void
  searchKeyword: string
  setSearchKeyword: (val: string) => void
  size: number
  setSize: (val: number) => void
  page: number
  setPage: (val: number) => void
  onPilihKategori: (kategori: KategoriResponse) => void
}

export default function ListKategori({
  loading,
  kategoriList,
  totalPages,
  filterJenis,
  setFilterJenis,
  searchKeyword,
  setSearchKeyword,
  size,
  setSize,
  page,
  setPage,
  onPilihKategori,
}: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchKeyword('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors ">
      <div className="mb-6 flex flex-col gap-2">
        <div>
          <h2 className="text-md font-semibold">Data</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manajemen kategori pemasukan dan pengeluaran
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_2fr_3fr] gap-3">
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

          {/* Search Input */}
          <div className="sm:col-span-2 md:col-span-1">
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
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* LIST */}
      <ul className="min-h-[480px] divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[480px]">
        {kategoriList.length === 0 ? (
          <li className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
            Tidak ada kategori.
          </li>
        ) : (
          kategoriList.map((kategori) => (
            <KategoriItem key={kategori.id} kategori={kategori} onPilihKategori={() => onPilihKategori(kategori)} />
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
