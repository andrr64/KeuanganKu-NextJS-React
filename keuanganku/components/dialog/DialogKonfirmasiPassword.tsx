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
import { HiEye, HiEyeOff } from 'react-icons/hi'

interface Props {
    isOpen: boolean
    isLoading: boolean
    type: 'save' | 'delete'
    onClose: () => void
    onSubmit: (password: string) => void
}

export default function DialogKonfirmasiPassword({ isOpen, isLoading, type, onClose, onSubmit }: Props) {
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isOpen) setPassword('')
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!password.trim()) return
        onSubmit(password)
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
                        <DialogPanel className="max-w-sm w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
                                {type === 'save' ? 'Konfirmasi Simpan Perubahan' : 'Konfirmasi Hapus Akun'}
                            </DialogTitle>
                            <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Masukkan password lama untuk melanjutkan.
                            </Description>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div className="relative">
                                    <input
                                        type={show ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password lama"
                                        className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                        required
                                    />
                                    <div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
                                        onClick={() => setShow(!show)}
                                    >
                                        {show ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded text-white transition-colors duration-200 ${isLoading
                                                ? 'bg-indigo-400 cursor-not-allowed'
                                                : type === 'delete'
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        Konfirmasi
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
