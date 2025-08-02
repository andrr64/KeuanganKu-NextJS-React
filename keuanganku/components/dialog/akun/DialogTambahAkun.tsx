'use client';

import { handler_PostAkun } from '@/actions/v2/handlers/akun';
import FormDialog from '@/components/FormDialog';
import toast from 'react-hot-toast';

export default function DialogTambahAkun({
    isOpen,
    closeDialog,
    whenSuccess
}: {
    isOpen: boolean;
    isLoading: boolean;
    closeDialog: () => void;
    whenSuccess : () => void;
}) {
    const fields = [
        {
            name: 'nama',
            label: 'Nama Akun',
            type: 'text' as const,
            placeholder: 'Contoh: Kas, Bank BCA',
            required: true,
        },
        {
            name: 'saldoAwal',
            label: 'Saldo Awal',
            type: 'number' as const,
            placeholder: 'Masukkan jumlah saldo awal',
            required: true,
        },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        const nama = data.nama?.trim();
        const saldoAwal = parseFloat(data.saldoAwal);

        if (!nama) {
            return alert('Nama akun wajib diisi.');
        }
        if (isNaN(saldoAwal) || saldoAwal < 0) {
            return alert('Saldo awal harus berupa angka non-negatif.');
        }

        await handler_PostAkun (
            {
                toaster: toast,
                whenSuccess
            },
            {nama, saldoAwal}
        )
    };

    return (
        <FormDialog
            isOpen={isOpen}
            title="Tambah Akun"
            description="Masukkan nama akun dan saldo awalnya."
            fields={fields}
            initialData={{ nama: '', saldoAwal: '' }}
            onCancel={closeDialog}
            onSubmit={handleSubmit}
            submitLabel="Tambah Akun"
            cancelLabel="Batal"
            onChange={(fieldName, fieldValue) => {

            }}
            extraButtons={[]}
        />
    );
}