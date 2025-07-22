'use client'

import { Fragment, useState, useEffect } from 'react'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react'
import { FaCalendarPlus } from 'react-icons/fa'

type Props = {
    isOpen: boolean
    isLoading: boolean
    onClose: () => void
    onSubmit: (nama: string, target: number, tanggalTarget: string) => void
}
export default function DialogTambahGoal({
    isOpen,
    isLoading,
    onClose,
    onSubmit,
}: Props) {
    const [nama, setNama] = useState('')
    const [target, setTarget] = useState('')
    const [tanggalTarget, setTanggalTarget] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNama('')
            setTarget('')
            setTanggalTarget('')
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nama.trim() || !target || !tanggalTarget.trim()) return
        const [year, month, day] = tanggalTarget.split('-')
        const formattedDate = `${day}/${month}/${year}`
        onSubmit(nama.trim(), parseFloat(target), formattedDate)
    }

    const setNextMonth = () => {
        const now = new Date()
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 2)
        setTanggalTarget(firstDayNextMonth.toISOString().split('T')[0])
    }

    const setNextYear = () => {
        const firstDayNextYear = new Date(new Date().getFullYear() + 1, 0, 2)
        setTanggalTarget(firstDayNextYear.toISOString().split('T')[0])
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
                                Tambah Goal
                            </DialogTitle>
                            <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Masukkan data goal baru.
                            </Description>

                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                {/* Nama Goal */}
                                <div>
                                    <label
                                        htmlFor="nama"
                                        className="block text-xs font-medium text-gray-700 dark:text-white mb-1"
                                    >
                                        Nama Goal
                                    </label>
                                    <input
                                        id="nama"
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                {/* Target */}
                                <div>
                                    <label
                                        htmlFor="target"
                                        className="block text-xs font-medium text-gray-700 dark:text-white mb-1"
                                    >
                                        Target (Rp)
                                    </label>
                                    <input
                                        id="target"
                                        type="number"
                                        value={target}
                                        min={0}
                                        onChange={(e) => setTarget(e.target.value)}
                                        className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                {/* Tanggal Target */}
                                <div>
                                    <label
                                        htmlFor="tanggal"
                                        className="block text-xs font-medium text-gray-700 dark:text-white mb-1"
                                    >
                                        Tanggal Target
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            id="tanggal"
                                            type="date"
                                            value={tanggalTarget}
                                            onChange={(e) => setTanggalTarget(e.target.value)}
                                            className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={setNextMonth}
                                            className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                        >
                                            Bulan Depan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={setNextYear}
                                            className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                        >
                                            Tahun Depan
                                        </button>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end pt-4 gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded 
                      bg-gray-200 dark:bg-gray-700 
                      text-gray-700 dark:text-white 
                      hover:bg-gray-300 dark:hover:bg-gray-600 
                      transition-colors duration-200 
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded text-white 
                      ${isLoading
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'}
                      transition-colors duration-200`}
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
