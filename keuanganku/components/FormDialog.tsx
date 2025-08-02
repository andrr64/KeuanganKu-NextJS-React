// components/dialog/FormDialog.tsx
'use client';
import { Fragment, useEffect, useState } from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    Description,
} from '@headlessui/react';
import toast from 'react-hot-toast';

export type FieldConfig = {
    name: string;
    label: string;
    type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'date'
    | 'datetime-local';
    options?: { label: string; value: string | number }[];
    required?: boolean;
    placeholder?: string;
};

export type ExtraButton = {
    label: string;
    onClick: () => void | Promise<void>;
    variant?: 'danger' | 'secondary' | 'success' | 'primary';
    disabled?: boolean;
};

type FormDialogProps = {
    isOpen: boolean;
    title: string;
    description?: string;
    fields: FieldConfig[];
    initialData?: Record<string, any>;
    onCancel: () => void;
    onSubmit: (data: Record<string, any>) => void | Promise<void>;
    submitLabel?: string;
    cancelLabel?: string;
    extraButtons?: ExtraButton[];
    onChange?: (name: string, value: any) => void; // ✅ Tambahkan onChange
};

export default function FormDialog({
    isOpen,
    title,
    description,
    fields,
    initialData = {},
    onCancel,
    onSubmit,
    submitLabel = 'Simpan',
    cancelLabel = 'Batal',
    extraButtons,
    onChange: onFieldChange, // ✅ Terima callback
}: FormDialogProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...initialData });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        onFieldChange?.(name, value); // ✅ Panggil callback
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        for (const field of fields) {
            if (field.required && !formData[field.name]?.toString().trim()) {
                toast.error(`${field.label} wajib diisi.`);
                return;
            }
        }
        setIsLoading(true);
        await onSubmit(formData);
        setIsLoading(false);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => !isLoading && onCancel()}>
                <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </TransitionChild>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <DialogPanel className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">{title}</DialogTitle>
                            {description && <Description className="text-sm text-gray-500 dark:text-gray-300 mt-2">{description}</Description>}
                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                                {fields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                                            {field.label}
                                            {field.required && <span className="text-rose-700"> *</span>}
                                        </label>
                                        {field.type === 'select' ? (
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                value={formData[field.name] ?? ''}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                required={field.required}
                                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                <option value="">{field.placeholder || 'Pilih...'}</option>
                                                {field.options?.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : field.type === 'textarea' ? (
                                            <textarea
                                                id={field.name}
                                                name={field.name}
                                                value={formData[field.name] ?? ''}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                disabled={isLoading}
                                                required={field.required}
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                            />
                                        ) : (
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type === 'datetime-local' ? 'datetime-local' : field.type || 'text'}
                                                value={formData[field.name] ?? ''}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                disabled={isLoading}
                                                required={field.required}
                                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="flex flex-wrap items-center gap-2 pt-4">
                                    {extraButtons?.map((btn, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={async () => {
                                                if (!btn.disabled && !isLoading) await btn.onClick();
                                            }}
                                            disabled={btn.disabled || isLoading}
                                            className={`
                        px-3 py-2 text-sm rounded font-medium transition-colors
                        ${btn.disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}
                        ${btn.variant === 'danger'
                                                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                                    : btn.variant === 'secondary'
                                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                                                        : btn.variant === 'success'
                                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                }
                      `}
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                    <div className="flex-1"></div>
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        disabled={isLoading}
                                        className="px-3 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    >
                                        { submitLabel }
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}