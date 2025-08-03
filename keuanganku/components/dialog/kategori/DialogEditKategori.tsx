'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { KategoriResponse } from '@/types/kategori';
import { handler_deleteKategori, handler_updateKategori } from '@/actions/v2/handlers/kategori';
import FormDialog, { ExtraButton, FieldConfig } from '@/components/FormDialog';
import { confirmDialog } from '@/lib/confirm-dialog';

type Props = {
    isOpen: boolean;
    kategori: KategoriResponse | null;
    onClose: () => void;
    whenSuccess: () => void;
};

export default function DialogEditKategori({ isOpen, kategori, onClose, whenSuccess }: Props) {
    const [formData, setFormData] = useState<{ nama: string }>({ nama: '' });

    const fields: FieldConfig[] = [
        {
            name: 'nama',
            label: 'Nama Kategori',
            type: 'text',
            required: true,
            placeholder: 'Contoh: Makanan, Gaji, Transportasi',
        },
    ];

    useEffect(() => {
        if (kategori && isOpen) {
            setFormData({ nama: kategori.nama });
        }
    }, [kategori, isOpen]);

    const handleSubmit = async (data: Record<string, any>) => {
        if (!kategori) {
            toast.error('Data kategori tidak valid.');
            return;
        }

        const nama = data.nama?.trim();
        if (!nama) {
            toast.error('Nama kategori wajib diisi.');
            return;
        }

        const payload = { id: kategori.id, nama };

        handler_updateKategori(
            {
                toaster: toast,
                whenSuccess: () => {
                    onClose();
                    whenSuccess();
                },
            },
            payload
        );
    };

    const handleDelete = () => {
        if (!kategori) return;
        confirmDialog.show({
            title: 'Hapus Kategori?',
            description: 'Tindakan ini tidak bisa dibatalkan.',
            confirmText: 'Hapus',
            cancelText: 'Batal',
            onConfirm: () => {
                handler_deleteKategori(
                    {
                        toaster: toast,
                        whenSuccess: () => {
                            onClose()
                            whenSuccess()
                        },
                    },
                    kategori.id
                );
            },
        });
    }

    const extraButtons: ExtraButton[] = [
        {
            label: 'Hapus',
            onClick: handleDelete,
            variant: 'danger',
            disabled: false, // bisa diatur dinamis jika perlu
        },
    ];

    return (
        <FormDialog
            isOpen={isOpen}
            title="Edit Kategori"
            description="Ubah nama kategori sesuai kebutuhan."
            fields={fields}
            initialData={formData}
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitLabel="Simpan"
            cancelLabel="Batal"
            extraButtons={extraButtons}
            onChange={(name, value) => {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }}
        />
    );
}