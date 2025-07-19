'use client'

import { useState } from 'react'
import { FaCheckCircle, FaTimes, FaPlus } from 'react-icons/fa'

type Goal = {
  id: string
  nama: string
  target: number
  terkumpul: number
  tanggalTarget: string
  tercapai: boolean
}

const initialDummyGoals: Goal[] = [
  {
    id: '1',
    nama: 'Beli Laptop Baru',
    target: 15000000,
    terkumpul: 5000000,
    tanggalTarget: '2025-12-31',
    tercapai: false,
  },
  {
    id: '2',
    nama: 'Liburan ke Bali',
    target: 8000000,
    terkumpul: 8000000,
    tanggalTarget: '2025-08-01',
    tercapai: true,
  },
  {
    id: '3',
    nama: 'Dana Darurat',
    target: 10000000,
    terkumpul: 2500000,
    tanggalTarget: '2026-01-01',
    tercapai: false,
  },
]

// Format Rupiah konsisten antara SSR & Client
const formatRupiah = (val: number) => Intl.NumberFormat('id-ID').format(val)

export default function GoalPage() {
  const [goals, setGoals] = useState<Goal[]>(initialDummyGoals)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(5)

  const filteredGoals = goals.filter(goal =>
    goal.nama.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const totalPages = Math.ceil(filteredGoals.length / size)
  const pagedGoals = filteredGoals.slice(page * size, (page + 1) * size)

  const handleToggleTercapai = (id: string) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, tercapai: !goal.tercapai } : goal
      )
    )
  }

  const handleTambahTerkumpul = (id: string) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? {
            ...goal,
            terkumpul: Math.min(goal.terkumpul + 1_000_000, goal.target),
            tercapai:
              goal.terkumpul + 1_000_000 >= goal.target
                ? true
                : goal.tercapai,
          }
          : goal
      )
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const handleClearSearch = () => setSearchKeyword('')

  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1080px] mx-auto md:mx-0">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Goal</h1>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-md font-semibold">Daftar Goal</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daftar tujuan keuangan yang sedang atau telah dicapai
            </p>
          </div>

          {/* Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">
                Jumlah Data
              </label>
              <select
                value={size}
                onChange={(e) => {
                  setPage(0)
                  setSize(parseInt(e.target.value))
                }}
                className="w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <option value={5}>5 data</option>
                <option value={10}>10 data</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">
                Cari Goal
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari goal..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setPage(0)
                    setSearchKeyword(e.target.value)
                  }}
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

          {/* List */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[560px] overflow-y-auto">
            {pagedGoals.length === 0 ? (
              <li className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                Tidak ada goal yang ditemukan.
              </li>
            ) : (
              pagedGoals.map(goal => {
                const progress = Math.min((goal.terkumpul / goal.target) * 100, 100)
                return (
                  <li key={goal.id} className="py-4 px-3">
                    <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                      {/* Bullet Status */}
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${goal.tercapai ? 'bg-green-500' : 'bg-red-500'}`}
                        title={goal.tercapai ? 'Selesai' : 'Belum selesai'}
                      />

                      <div className="flex-1 min-w-[200px]">
                        <p className="text-sm font-medium">{goal.nama}</p>

                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Terkumpul</span>
                          <span suppressHydrationWarning>
                            Rp{formatRupiah(goal.terkumpul)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Target</span>
                          <span suppressHydrationWarning>
                            Rp{formatRupiah(goal.target)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Deadline: {goal.tanggalTarget}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        {/* Tombol Status */}
                        <button
                          onClick={() => handleToggleTercapai(goal.id)}
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition whitespace-nowrap
                            ${goal.tercapai
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400'
                            }`}
                        >
                          <FaCheckCircle />
                          {goal.tercapai ? 'Tercapai' : 'Belum'}
                        </button>

                        {/* Tombol Tambah */}
                        <button
                          onClick={() => handleTambahTerkumpul(goal.id)}
                          className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 whitespace-nowrap"
                        >
                          <FaPlus />
                          Tambah Uang
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </li>
                )
              })
            )}
          </ul>

          {/* Pagination */}
          <div className="mt-4 flex justify-end items-center gap-2 text-sm">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              ← Prev
            </button>
            <span>Halaman {page + 1} dari {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
