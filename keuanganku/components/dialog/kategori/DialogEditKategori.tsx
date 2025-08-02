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
import { KategoriResponse } from '@/types/kategori'
import { handler_deleteKategori, handler_updateKategori } from '@/actions/v2/handlers/kategori'
import toast from 'react-hot-toast'

type Props = {
    isOpen: boolean
    kategori: KategoriResponse | null
    onClose: () => void
    whenSuccess: () => void
}

export default function DialogEditKategori({
    isOpen,
    kategori,
    onClose,
    whenSuccess,
}: Props) {
    const [nama, setNama] = useState('')
    const [isLoading, setIsLoading] = useState(false) // <-- Tambahkan state loading

    useEffect(() => {
        if (kategori) {
            setNama(kategori.nama)
        }
    }, [kategori])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!kategori || isLoading) return

        setIsLoading(true)
        const data = { id: kategori.id, nama }

        handler_updateKategori(
            {
                toaster: toast,
                whenSuccess: () => {
                    whenSuccess()
                    setIsLoading(false)
                },
            },
            data
        )
    }

    const handleDelete = () => {
        if (!kategori || isLoading) return

        if (confirm('Yakin ingin menghapus kategori ini?')) {
            setIsLoading(true)
            handler_deleteKategori(
                {
                    toaster: toast,
                    whenSuccess: () => {
                        onClose()
                        whenSuccess()
                        setIsLoading(false)
                    },
                },
                kategori.id
            )
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => !isLoading && onClose()}>
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
                                Edit Kategori
                            </DialogTitle>
                            <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Ubah nama dan jenis kategori sesuai kebutuhan.
                            </Description>

                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                <div>
                                    <label htmlFor="nama" className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                                        Nama Kategori
                                    </label>
                                    <input
                                        id="nama"
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                        required
                                    />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded text-white flex-1 mr-2
                                            ${isLoading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'}
                                            transition-colors duration-200`}
                                    >
                                        Hapus
                                    </button>

                                    <div className="flex gap-2 flex-1">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className={`px-4 py-2 rounded 
                                                bg-gray-200 dark:bg-gray-700 
                                                text-gray-700 dark:text-white 
                                                hover:bg-gray-300 dark:hover:bg-gray-600 
                                                transition-colors duration-200 
                                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} flex-1`}
                                        >
                                            Batal
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-4 py-2 rounded text-white flex-1
                                                ${isLoading
                                                    ? 'bg-blue-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'}
                                                transition-colors duration-200`}
                                        >
                                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}