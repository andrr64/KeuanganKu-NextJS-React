'use client';

import { AkunResponse } from '@/types/akun';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import Loading from '../Loading';

export default function EditAccountDialog({
    isOpen,
    isLoading,
    akun,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    isLoading: boolean;
    akun: AkunResponse | null;
    onClose: () => void;
    onSubmit: (id: string, namaBaru: string) => void;
}) {
    const [namaBaru, setNamaBaru] = useState('');

    useEffect(() => {
        if (akun) setNamaBaru(akun.nama);
    }, [akun]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!akun) return;
        onSubmit(akun.id, namaBaru.trim());
    };

    return (
        <>
            {isLoading && <Loading />}
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
                                    Ubah Nama Akun
                                </DialogTitle>
                                <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                    Ubah nama akun sesuai kebutuhan kamu.
                                </Description>

                                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="namaBaru" className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                                            Nama Akun Baru
                                        </label>
                                        <input
                                            id="namaBaru"
                                            type="text"
                                            value={namaBaru}
                                            onChange={(e) => setNamaBaru(e.target.value)}
                                            className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
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
                    transition-colors duration-200 
                    ${isLoading
                                                    ? 'bg-blue-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
