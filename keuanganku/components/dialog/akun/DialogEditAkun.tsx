'use client';

import { handler_PatchAkun_nama } from '@/actions/v2/handlers/akun';
import FormDialog from '@/components/FormDialog';
import { AkunResponse } from '@/types/akun';
import toast from 'react-hot-toast';

export default function DialogEditAkun({
    isOpen,
    akun,
    closeDialog,
    whenSuccess,
}: {
    isOpen: boolean;
    akun: AkunResponse | null;
    closeDialog: () => void;
    whenSuccess: () => void;
}) {

    const fields = [
        {
            name: 'nama',
            label: 'Nama Akun Baru',
            type: 'text' as const,
            placeholder: 'Masukkan nama baru',
            required: true,
        },
    ];

    const initialData = akun ? { nama: akun.nama } : {};

    const handleSubmit = async (data: Record<string, any>) => {
        if (!akun) return;
        const nama = data.nama?.trim();
        if (!nama) {
            toast.error('Nama akun wajib diisi.');
            return;
        }
        
        await handler_PatchAkun_nama(
            {
                toaster: toast,
                whenSuccess: () => {
                    closeDialog();
                    whenSuccess();
                },
            },
            { id: akun.id, nama }
        );

    };

    return (
        <FormDialog
            isOpen={isOpen}
            title="Ubah Nama Akun"
            description="Ubah nama akun sesuai kebutuhan kamu."
            fields={fields}
            initialData={initialData}
            onCancel={closeDialog}
            onSubmit={handleSubmit} // ✅ Sekarang kompatibel
            submitLabel="Simpan Perubahan"
            cancelLabel="Batal"
            onChange={(nama)  =>  {
                
            }}
            extraButtons={[]}
        />
    );
}