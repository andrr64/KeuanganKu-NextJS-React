import { formatTanggal } from '@/lib/timeutil'
import { GoalModel } from '@/types/model/Goal'
import { useEffect } from 'react'
import { FaCheckCircle, FaPlus, FaMinus, FaTrash } from 'react-icons/fa'

interface GoalItemProps {
    goal: GoalModel
    progress: number
    formatRupiah: (value: number) => string
    getProgressColor: (progress: number) => string
    onEdit: (goal: GoalModel) => void
    onToggleStatus: (goal: GoalModel) => void
    onTambahUang: () => void
    onKurangiUang: () => void // ✅ Tambahkan prop baru
    onHapus: () => void
}

export default function GoalItem({
    goal,
    progress,
    formatRupiah,
    getProgressColor,
    onEdit,
    onToggleStatus,
    onTambahUang,
    onKurangiUang,
    onHapus
}: GoalItemProps) {
    return (
        <li
            className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 
            transition-colors duration-200 hover:bg-gray-50 mb-3 dark:hover:bg-gray-600 cursor-pointer"
            onClick={() => onEdit?.(goal)}
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 flex-wrap">
                {/* Kiri: Nama + Status */}
                <div className="flex items-center gap-3">
                    <div
                        className={`w-3.5 h-3.5 rounded-full transition-colors duration-200 ${goal.tercapai ? 'bg-green-500' : 'bg-red-500'}`}
                        title={goal.tercapai ? 'Selesai' : 'Belum selesai'}
                    />
                    <p className="text-base font-semibold text-gray-900 dark:text-white transition-colors group-hover:underline">
                        {goal.nama}
                    </p>
                </div>

                {/* Kanan: Info Finansial + Aksi */}
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {goal.target && (
                        <>
                            <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between gap-2 w-full sm:w-72">
                                <span className="font-medium">Terkumpul</span>
                                <span>Rp{formatRupiah(goal.terkumpul)}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between gap-2 w-full sm:w-72">
                                <span className="font-medium">Target</span>
                                <span>{`Rp${formatRupiah(goal.target)}`}
                                </span>
                            </div>
                        </>
                    )
                    }
                    {goal.tanggalTarget && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Deadline: {formatTanggal(goal.tanggalTarget)}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-1">
                        <button
                            className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-all font-medium
                                ${goal.tercapai
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600'
                                }`}
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleStatus(goal)
                            }}
                        >
                            <FaCheckCircle className="text-sm" />
                            {goal.tercapai ? 'Tercapai' : 'Belum'}
                        </button>

                        <button
                            className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 font-medium transition-all"
                            onClick={(e) => {
                                e.stopPropagation()
                                onTambahUang()
                            }}
                        >
                            <FaPlus className="text-sm" />
                            Tambah Uang
                        </button>

                        <button
                            className="text-xs px-3 py-1.5 rounded-md bg-red-800 hover:bg-red-900 text-white flex items-center gap-1 font-medium transition-all"
                            onClick={(e) => {
                                e.stopPropagation()
                                onKurangiUang()
                            }}
                        >
                            <FaMinus className="text-sm" />
                            Kurangi Uang
                        </button>

                        <button
                            className="text-xs px-3 py-1.5 rounded-md bg-red-800 hover:bg-red-900 text-white flex items-center gap-1 font-medium transition-all"
                            onClick={(e) => {
                                e.stopPropagation()
                                onHapus()
                            }}
                        >
                            <FaTrash className="text-sm" />
                            Hapus
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {goal.target && (
                <div className="w-full mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                    <div
                        className={`h-full transition-all duration-300 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                    />
                    <span
                        className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-white"
                    >
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
        </li>
    )
}
