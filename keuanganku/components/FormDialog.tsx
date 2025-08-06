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
import Loading from './Loading';
import { formatUang } from '@/lib/utils/formatUtil';

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
    onChange?: (name: string, value: any) => void;
};

// Styles configuration
const styles = {
    container: 'max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl',
    title: 'text-lg font-medium text-gray-900 dark:text-white',
    description: 'text-sm text-gray-500 dark:text-gray-300 mt-2',
    form: 'mt-6 flex flex-col gap-4',
    label: 'block text-xs font-medium text-gray-700 dark:text-white mb-1',
    requiredAsterisk: 'text-rose-700',
    inputBase:
        'w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 ' +
        'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white ' +
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 ' +
        'disabled:opacity-70 disabled:cursor-not-allowed',
    buttonContainer: 'flex flex-wrap items-center gap-2 pt-4',
    cancelButton:
        'px-3 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white ' +
        'hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors',
    submitButton:
        'px-3 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ' +
        'disabled:bg-indigo-400 disabled:cursor-not-allowed',
    resetButton:
        'px-3 py-1 text-xs rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 ' +
        'text-gray-800 dark:text-white transition-colors',
    extraButton: {
        base: 'px-3 py-2 text-sm rounded font-medium transition-colors',
        disabled: 'opacity-60 cursor-not-allowed hover:opacity-60',
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
    },
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
    onChange: onFieldChange,
}: FormDialogProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset form data when dialog opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ ...initialData });
        }
    }, [initialData, isOpen]);

    // Handle form field changes
    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        onFieldChange?.(name, value);
    };

    // Handle standard input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        handleChange(name, value);
    };

    // Handle number input changes with formatting
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = rawValue === '' ? '' : Number(rawValue);
        handleChange(fieldName, numericValue);
    };

    // Handle date field reset
    const handleDateReset = (fieldName: string, isRequired: boolean) => {
        const today = new Date().toISOString().split('T')[0];
        const value = isRequired ? today : null;
        handleChange(fieldName, value);
    };

    // Validate form before submission
    const validateForm = (): boolean => {
        for (const field of fields) {
            if (field.required && !formData[field.name]?.toString().trim()) {
                toast.error(`${field.label} wajib diisi.`);
                return false;
            }
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsLoading(false);
        }
    };

    // Render field input based on type
    const renderFieldInput = (field: FieldConfig) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            placeholder: field.placeholder,
            disabled: isLoading,
            required: field.required,
            className: styles.inputBase,
        };

        switch (field.type) {
            case 'select':
                return (
                    <select
                        {...commonProps}
                        value={formData[field.name] ?? ''}
                        onChange={handleInputChange}
                    >
                        <option value="">{field.placeholder || 'Pilih...'}</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        value={formData[field.name] ?? ''}
                        onChange={handleInputChange}
                        rows={3}
                    />
                );

            case 'number':
                return (
                    <input
                        {...commonProps}
                        type="text"
                        inputMode="numeric"
                        value={
                            formData[field.name] === '' || formData[field.name] == null
                                ? ''
                                : formatUang(formData[field.name])
                        }
                        onChange={(e) => handleNumberChange(e, field.name)}
                    />
                );

            case 'date':
                return (
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                {...commonProps}
                                type="date"
                                value={formData[field.name] ?? ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleDateReset(field.name, field.required || false)}
                            disabled={isLoading}
                            className={styles.resetButton}
                        >
                            Reset
                        </button>
                    </div>
                );

            default:
                return (
                    <input
                        {...commonProps}
                        type={field.type || 'text'}
                        value={formData[field.name] ?? ''}
                        onChange={handleInputChange}
                    />
                );
        }
    };

    // Render extra button with proper styling
    const renderExtraButton = (button: ExtraButton, index: number) => {
        const variant = button.variant || 'primary';
        const isDisabled = button.disabled || isLoading;
        const buttonClass = `${styles.extraButton.base} ${isDisabled ? styles.extraButton.disabled : styles.extraButton[variant]
            }`;

        return (
            <button
                key={index}
                type="button"
                onClick={async () => {
                    if (!isDisabled) await button.onClick();
                }}
                disabled={isDisabled}
                className={buttonClass}
            >
                {button.label}
            </button>
        );
    };

    return (
        <>
            {isLoading && <Loading />}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => !isLoading && onCancel()}
                >
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
                            <DialogPanel className={styles.container}>
                                <DialogTitle className={styles.title}>
                                    {title}
                                </DialogTitle>

                                {description && (
                                    <Description className={styles.description}>
                                        {description}
                                    </Description>
                                )}

                                <form onSubmit={handleSubmit} className={styles.form}>
                                    {fields.map(field => (
                                        <div key={field.name}>
                                            <label className={styles.label}>
                                                {field.label}
                                                {field.required && (
                                                    <span className={styles.requiredAsterisk}> *</span>
                                                )}
                                            </label>
                                            {renderFieldInput(field)}
                                        </div>
                                    ))}

                                    <div className={styles.buttonContainer}>
                                        {extraButtons?.map(renderExtraButton)}

                                        <div className="flex-1" />

                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            disabled={isLoading}
                                            className={styles.cancelButton}
                                        >
                                            {cancelLabel}
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={styles.submitButton}
                                        >
                                            {submitLabel}
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