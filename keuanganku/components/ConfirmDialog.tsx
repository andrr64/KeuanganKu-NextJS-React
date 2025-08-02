// components/ConfirmDialog.tsx
'use client';

import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react';
import { Fragment } from 'react';

type ConfirmDialogProps = {
    isOpen: boolean;
    onClose: any;
    onConfirm: any;
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
};

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    description = '',
    cancelText = 'Batal',
    confirmText = 'Ya',
}: ConfirmDialogProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
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

                {/* Panel */}
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
                                {title}
                            </DialogTitle>
                            {description && (
                                <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                    {description}
                                </Description>
                            )}

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors"
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}