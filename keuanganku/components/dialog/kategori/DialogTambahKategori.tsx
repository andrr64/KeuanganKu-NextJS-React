'use client';

import { handler_tambahKategori } from '@/actions/v2/handlers/kategori';
import FormDialog, { FieldConfig } from '@/components/FormDialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    whenSuccess?: () => void;
};

// Definisikan field secara global agar tidak render ulang
const fieldTambahKategori: FieldConfig[] = [
    {
        name: 'nama',
        label: 'Nama Kategori',
        type: 'text',
        required: true,
        placeholder: 'Contoh: Makanan, Gaji, Transportasi',
    },
    {
        name: 'jenis',
        label: 'Jenis Kategori',
        type: 'select',
        required: true,
        options: [
            { label: 'Pengeluaran', value: 1 },
            { label: 'Pemasukan', value: 2 },
        ],
    },
];

export default function DialogTambahKategori({ isOpen, onClose, whenSuccess }: Props) {
    const [formData, setFormData] = useState({
        nama: '',
        jenis: 1,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ nama: '', jenis: 1 });
        }
    }, [isOpen]);

    const handleSubmit = async (data: Record<string, any>) => {
        const { nama, jenis } = data;

        if (!nama?.trim()) {
            toast.error('Nama kategori wajib diisi.');
            return;
        }

        await handler_tambahKategori(
            {
                toaster: toast,
                whenSuccess: () => {
                    onClose();
                    whenSuccess?.();
                },
            },
            { nama: nama.trim(), jenis: jenis }
        );
    };

    return (
        <FormDialog
            isOpen={isOpen}
            title="Tambah Kategori"
            description="Masukkan nama dan jenis kategori yang baru."
            fields={fieldTambahKategori}
            initialData={formData}
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitLabel="Simpan"
            cancelLabel="Batal"
            onChange={(name, value) => {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }}
        />
    );
}