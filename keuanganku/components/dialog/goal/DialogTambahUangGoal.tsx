'use client'

import { Fragment, useEffect, useState } from 'react'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react'

type Props = {
    isOpen: boolean
    isLoading: boolean
    onClose: () => void
    onSubmit: (jumlah: number) => void
}

export default function DialogTambahUangGoal({
    isOpen,
    isLoading,
    onClose,
    onSubmit,
}: Props) {
    const [jumlah, setJumlah] = useState('')

    useEffect(() => {
        if (isOpen) {
            setJumlah('')
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const value = parseFloat(jumlah)
        if (isNaN(value) || value <= 0) return
        onSubmit(value)
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
                                Tambah Uang ke Goal
                            </DialogTitle>
                            <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Masukkan jumlah uang yang ingin ditambahkan ke goal ini.
                            </Description>

                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                <div>
                                    <label
                                        htmlFor="jumlah"
                                        className="block text-xs font-medium text-gray-700 dark:text-white mb-1"
                                    >
                                        Jumlah Uang (Rp)
                                    </label>
                                    <input
                                        id="jumlah"
                                        type="number"
                                        min={1}
                                        value={jumlah}
                                        onChange={(e) => setJumlah(e.target.value)}
                                        className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

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
                                        Tambah
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
