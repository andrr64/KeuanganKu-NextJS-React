'use client'

import { getFilteredGoal, hapusGoal, kurangiUangGoal, tambahGoal, tambahUangGoal, updateGoal, updateStatus } from '@/actions/goal'
import { GoalResponse } from '@/types/goal'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTimes } from 'react-icons/fa'
import GoalHeader from './componentns/Header'
import DialogTambahGoal from '@/components/dialog/goal/DialogTambahGoal'
import DialogEditGoal from '@/components/dialog/goal/DialogEditGoal'
import DialogTambahUangGoal from '@/components/dialog/goal/DialogTambahUangGoal'
import GoalItem from '../../../components/items/GoalItem'
import { handleApiAction } from '@/lib/api'
import DialogKurangiUangGoal from '@/components/dialog/goal/DialogKurangiUangGoal'
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi'
import { useDialog } from '@/hooks/dialog'
import { handler_DeleteGoal, handler_GetGoal, handler_PatchAddGoalFunds, handler_PutGoal, handler_PatchGoalStatus, handler_PatchSubtractGoalFunds, handler_PostGoal } from '@/actions/v2/handlers/goal'
import { GoalModel } from '@/models/Goal'
import LoadingP from '@/components/LoadingP'
import { confirmDialog } from '@/lib/confirm-dialog'

const formatRupiah = (val: number) => Intl.NumberFormat('id-ID').format(val)

export default function GoalPage() {
  const [goalss, setGoalss] = useState<GoalModel[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(5)
  const [loading, setLoading] = useState(false)
  const [filterTercapai, setFilterTercapai] = useState<boolean | undefined>(undefined)
  const [selectedGoal, setSelectedGoal] = useState<GoalResponse | null>(null)

  const tambahDialog = useDialog()
  const editDialog = useDialog()
  const tambahUangDialog = useDialog()
  const kurangiUangDialog = useDialog()
  const hapusDialog = useDialog()

  const totalPages = Math.ceil(goalss.length / size)

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const fetchData = () => {
    handler_GetGoal(
      {
        setLoading,
        whenSuccess: (pageableData) => {
          setGoalss(pageableData.content)
        },
        whenFailed: (msg) => toast.error(msg)
      },
      {
        page, size, keyword: searchKeyword, tercapai: filterTercapai
      }
    )
  }

  const handleTambahGoal = (nama: string, target: number, tanggalTarget: string) => {
    handler_PostGoal(
      {
        setLoading,
        toaster: toast,
        whenSuccess: () => {
          fetchData()
          tambahDialog.close()
        }
      },
      { nama, target, tanggalTarget }
    )
  }

  const handleEditGoal = (id: string, nama: string, target: number, tanggalTarget: string) => {
    handler_PutGoal(
      {
        toaster: toast,
        whenSuccess: () => {
          fetchData()
          editDialog.close()
        }
      },
      { id, nama, target, tanggalTarget }
    )
  }

  const handleToggleStatus = (goal: GoalModel) => {
    handler_PatchGoalStatus(
      {
        setLoading,
        whenSuccess: () => {
          fetchData();
        },
        whenFailed: (msg) => {
          toast.error(msg)
        }
      },
      {
        id: goal.id, tercapai: !goal.tercapai
      }
    )
  }

  const handleTambahUang = (uang: number) => {
    if (!selectedGoal) return
    handler_PatchAddGoalFunds(
      {
        setLoading,
        toaster: toast,
        whenSuccess: () => {
          setSelectedGoal(null)
          tambahUangDialog.close()
          fetchData()
        }
      },
      { id: selectedGoal.id, uang }
    )
  }

  const handleKurangiUang = (uang: number) => {
    if (!selectedGoal) return
    handler_PatchSubtractGoalFunds(
      {
        setLoading,
        toaster: toast,
        whenSuccess: () => {
          setSelectedGoal(null)
          kurangiUangDialog.close()
          fetchData()
        }
      },
      { id: selectedGoal.id, uang }
    )
  }

  const handleHapus = () => {
    if (!selectedGoal) return;
    confirmDialog.show({
      title: 'Hapus Goal?',
      description: 'Tindakan ini tidak bisa dibatalkan.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        handler_DeleteGoal(
          {
            setLoading,
            toaster: toast,
            whenSuccess: () => {
              setSelectedGoal(null);
              hapusDialog.close()
              fetchData()
            }
          },
          selectedGoal.id
        )
      },
    });
  }

  useEffect(() => {
    fetchData()
  }, [page, size, searchKeyword, filterTercapai])


  return (
    <>
      <DialogTambahGoal
        isOpen={tambahDialog.isOpen}
        onClose={tambahDialog.close}
        onSubmit={handleTambahGoal}
      />
      <DialogEditGoal
        isOpen={editDialog.isOpen}
        data={selectedGoal}
        onClose={editDialog.close}
        onSubmit={handleEditGoal}
      />
      <DialogKurangiUangGoal
        isOpen={kurangiUangDialog.isOpen}
        isLoading={loading}
        onClose={kurangiUangDialog.close}
        onSubmit={handleKurangiUang}
      />
      <DialogTambahUangGoal
        isOpen={tambahUangDialog.isOpen}
        isLoading={loading}
        onClose={tambahUangDialog.close}
        onSubmit={handleTambahUang}
      />

      {/* Main Content */}
      <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-[1080px] mx-auto md:mx-0">
          <GoalHeader
            onTambahGoal={tambahDialog.open}
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
                  onChange={(e) => {
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
                  onChange={(e) => {
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

            {/* Goal List */}
            <ul className="divide-y md:min-h-[480px] divide-gray-200 dark:divide-gray-700">
              {goalss.length === 0 ? (
                <li className="text-sm text-gray-500 py-6 text-center">
                  Tidak ada goal yang ditemukan.
                </li>
              ) : (
                goalss.map((goal) => {
                  const progress = Math.min((goal.terkumpul / goal.target) * 100, 100)
                  return (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      progress={progress}
                      formatRupiah={formatRupiah}
                      getProgressColor={getProgressColor}
                      onCheckPress={handleToggleStatus}
                      onEdit={() => {
                        setSelectedGoal(goal)
                        editDialog.open()
                      }}
                      onKurangiUang={() => {
                        setSelectedGoal(goal)
                        kurangiUangDialog.open()
                      }}
                      onTambahUang={() => {
                        setSelectedGoal(goal)
                        tambahUangDialog.open()
                      }}
                      onHapus={() => {
                        setSelectedGoal(goal)
                        handleHapus()
                      }}
                    />
                  )
                })
              )}
            </ul>

            {/* Pagination */}
            <div className="mt-4 flex justify-end items-center gap-2 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <span>Halaman {page + 1} dari {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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