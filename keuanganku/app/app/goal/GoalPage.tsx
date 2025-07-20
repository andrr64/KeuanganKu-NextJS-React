'use client'

import { getFilteredGoal, kurangiUangGoal, tambahGoal, tambahUangGoal, updateGoal, updateStatus } from '@/actions/goal'
import { GoalResponse } from '@/types/goal'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTimes } from 'react-icons/fa'
import GoalHeader from './componentns/Header'
import DialogTambahGoal from '@/components/dialog/DialogTambahGoal'
import DialogEditGoal from '@/components/dialog/DialogEditGoal'
import DialogTambahUangGoal from '@/components/dialog/DialogTambahUangGoal'
import GoalItem from './componentns/GoalItem'
import { handleApiAction } from '@/lib/api'
import DialogKurangiUangGoal from '@/components/dialog/DialogKurangiUangGoal'

const formatRupiah = (val: number) => Intl.NumberFormat('id-ID').format(val)

export default function GoalPage() {
  const [goalss, setGoalss] = useState<GoalResponse[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(5)
  const [loading, setLoading] = useState(false)
  const [filterTercapai, setFilterTercapai] = useState<boolean | undefined>(undefined)

  const [isOpenTambah, setIsOpenTambah] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenTambahUang, setIsOpenTambahUang] = useState(false)
  const [isOpenKurangiUang, setIsOpenKurangiUang] = useState(false)

  const [selectedGoal, setSelectedGoal] = useState<GoalResponse | null>(null)

  const totalPages = Math.ceil(goalss.length / size)

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getFilteredGoal({ page, size, keyword: searchKeyword, tercapai: filterTercapai })
      if (response.success) {
        setGoalss(response.data!.content)
      } else {
        throw new Error(response.message)
      }
    } catch (e: any) {
      toast.error(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTambahGoal = (nama: string, target: number, tanggalTarget: string) => {
    setLoading(true)
    handleApiAction({
      action: () => tambahGoal({ nama, target, tanggalTarget }),
      successMessage: 'Goal berhasil ditambahkan',
      onSuccess: () => {
        setIsOpenTambah(false)
        fetchData()
      },
      onFinally: () => setLoading(false),
    })
  }

  const handleEditGoal = (id: string, nama: string, target: number, tanggalTarget: string) => {
    if (!selectedGoal) return
    setLoading(true)
    handleApiAction({
      action: () => updateGoal({ id, nama, target, tanggalTarget }),
      successMessage: 'Goal berhasil diperbarui',
      onSuccess: () => {
        setIsOpenEdit(false)
        fetchData()
      },
      onFinally: () => setLoading(false),
    })
  }

  const handleCheckPress = (goal: GoalResponse) => {
    setLoading(true)
    handleApiAction({
      action: () => updateStatus({ id: goal.id, status: !goal.tercapai }),
      onSuccess: fetchData,
      onFinally: () => setLoading(false),
    })
  }

  const handleTambahUang = (jumlah: number) => {
    if (!selectedGoal) return
    setLoading(true)

    handleApiAction({
      action: () => tambahUangGoal({ id: selectedGoal.id, uang: jumlah }),
      successMessage: 'Uang berhasil ditambahkan',
      onSuccess: () => {
        fetchData()
        setSelectedGoal(null)
        setIsOpenTambahUang(false)
      },
      onFinally: () => setLoading(false),
    })
  }

  const handleKurangiUang = (jumlah: number) => {
    if (!selectedGoal) return
    setLoading(true)

    handleApiAction({
      action: () => kurangiUangGoal({ id: selectedGoal.id, uang: jumlah }),
      successMessage: 'Uang berhasil dikurangi',
      onSuccess: () => {
        fetchData()
        setSelectedGoal(null)
        setIsOpenKurangiUang(false)
      },
      onFinally: () => setLoading(false),
    })
  }
  useEffect(() => {
    fetchData()
  }, [page, size, searchKeyword, filterTercapai])

  return (
    <>
      <DialogTambahGoal
        isOpen={isOpenTambah}
        isLoading={loading}
        onClose={() => setIsOpenTambah(false)}
        onSubmit={handleTambahGoal}
      />

      <DialogEditGoal
        isOpen={isOpenEdit}
        isLoading={loading}
        data={selectedGoal}
        onClose={() => setIsOpenEdit(false)}
        onSubmit={handleEditGoal}
      />
      <DialogKurangiUangGoal
        isOpen={isOpenKurangiUang}
        isLoading={loading}
        onClose={() => setIsOpenKurangiUang(false)}
        onSubmit={handleKurangiUang}
      />

      <DialogTambahUangGoal
        isOpen={isOpenTambahUang}
        isLoading={loading}
        onClose={() => setIsOpenTambahUang(false)}
        onSubmit={handleTambahUang}
      />

      <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-[1080px] mx-auto md:mx-0">
          <GoalHeader
            onTambahGoal={() => setIsOpenTambah(true)}
            onImport={() => { }}
            onExport={() => { }}
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-md font-semibold">Daftar Goal</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daftar tujuan keuangan yang sedang atau telah dicapai
              </p>
            </div>

            {/* Filter */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
              <div className="md:col-span-2">
                <label className="text-xs font-medium block mb-1">Jumlah Data</label>
                <select
                  value={size}
                  onChange={e => {
                    setPage(0)
                    setSize(parseInt(e.target.value))
                  }}
                  className="w-full text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md border"
                >
                  <option value={5}>5 data</option>
                  <option value={10}>10 data</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium block mb-1">Filter Status</label>
                <select
                  onChange={e => {
                    setPage(0)
                    const val = e.target.value
                    setFilterTercapai(val === 'all' ? undefined : val === 'true')
                  }}
                  className="w-full text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md border"
                >
                  <option value="all">Semua</option>
                  <option value="true">Tercapai</option>
                  <option value="false">Belum Tercapai</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-medium block mb-1">Cari Goal</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchKeyword}
                    placeholder="Cari goal..."
                    onChange={(e) => {
                      setPage(0)
                      setSearchKeyword(e.target.value)
                    }}
                    className="w-full text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 pr-10 rounded-md border"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <ul className="divide-y md:min-h-[480px] divide-gray-200 dark:divide-gray-700">
              {goalss.length === 0 ? (
                <li className="text-sm text-gray-500 py-6 text-center">
                  Tidak ada goal yang ditemukan.
                </li>
              ) : (
                goalss.map(goal => {
                  const progress = Math.min((goal.terkumpul / goal.target) * 100, 100)
                  return (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      progress={progress}
                      formatRupiah={formatRupiah}
                      getProgressColor={getProgressColor}
                      onCheckPress={handleCheckPress}
                      onEdit={() => {
                        setSelectedGoal(goal)
                        setIsOpenEdit(true)
                      }}
                      onKurangiUang={() => {
                        setSelectedGoal(goal)
                        setIsOpenKurangiUang(true)
                      }}
                      onTambahUang={() => {
                        setSelectedGoal(goal)
                        setIsOpenTambahUang(true)
                      }}
                    />
                  )
                })
              )}
            </ul>

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
    </>
  )
}
