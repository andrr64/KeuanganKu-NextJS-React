'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { AkunResponse } from '@/types/akun';
import { KategoriResponse } from '@/types/kategori';
import { TransaksiResponse } from '@/types/transaksi';
import toast from 'react-hot-toast';
import { getFilteredKategori } from '@/actions/kategori';
import { EditTransaksiParams } from '@/actions/transaksi';
import FormDialog, { ExtraButton, FieldConfig } from '@/components/FormDialog';
import { PutTransaksiBody } from '@/types/request/transaksi';
import { handler_PostTransaksi, handler_PutTransaksi } from '@/actions/v2/handlers/transaksi';
import { handler_fetchKategori } from '@/actions/v2/handlers/kategori';

interface DialogEditTransaksiProps {
    isOpen: boolean;
    isLoading: boolean;
    closeDialog: () => void;
    whenSuccess: () => void;
    akunOptions: AkunResponse[];
    transaksiData: TransaksiResponse | null;
}

function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateFromAPI(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }
    return date;
}

export default function DialogEditTransaksi({
    isOpen,
    isLoading,
    closeDialog,
    whenSuccess,
    akunOptions,
    transaksiData,
}: DialogEditTransaksiProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fields, setFields] = useState<FieldConfig[]>([]);
    const [listKategoriPengeluaran, setKategoriPengeluaran] = useState<KategoriResponse[]>([]);
    const [listKategoriPemasukan, setKategoriPemasukan] = useState<KategoriResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch kategori
    const fetchKategori = useCallback(async () => {
        handler_fetchKategori(
            {
                setLoading,
                whenSuccess: (data) => {
                    const semuaKategori: KategoriResponse[] = data.content;
                    setKategoriPengeluaran(semuaKategori.filter((k) => k.jenis === 1));
                    setKategoriPemasukan(semuaKategori.filter((k) => k.jenis === 2));
                },
                whenFailed: (error) => {
                    toast.error(error);
                    closeDialog();
                }
            },
            {}
        )
    }, []);

    // Reset form & generate fields
    const resetFormAndGenerateFields = useCallback((data: Record<string, any>) => {
        const kategoriList = data.jenisTransaksi === 1 ? listKategoriPengeluaran : listKategoriPemasukan;
        const kategoriId = kategoriList.length > 0 ? kategoriList[0].id : '';

        const newFormData = {
            ...data,
            kategoriId: data.kategoriId || kategoriId,
        };

        setFormData(newFormData);

        setFields([
            {
                name: 'idAkun',
                label: 'Akun',
                type: 'select',
                options: akunOptions.map((a) => ({ label: a.nama, value: a.id })),
                required: true,
            },
            {
                name: 'jenisTransaksi',
                label: 'Jenis Transaksi',
                type: 'select',
                options: [
                    { label: 'Pengeluaran', value: 1 },
                    { label: 'Pemasukan', value: 2 },
                ],
                required: true,
            },
            {
                name: 'kategoriId',
                label: 'Kategori',
                type: 'select',
                options: loading
                    ? []
                    : kategoriList.map((k) => ({ label: k.nama, value: k.id })),
                required: true,
                placeholder: loading ? 'Memuat kategori...' : 'Pilih kategori',
            },
            {
                name: 'jumlah',
                label: 'Jumlah',
                type: 'number',
                required: true,
                placeholder: 'Masukkan jumlah',
            },
            {
                name: 'tanggal',
                label: 'Tanggal',
                type: 'datetime-local',
                required: true,
            },
            {
                name: 'catatan',
                label: 'Catatan (Opsional)',
                type: 'textarea',
                placeholder: 'Catatan tambahan...',
            },
        ]);
    }, [akunOptions, listKategoriPengeluaran, listKategoriPemasukan, loading]);

    // Inisialisasi saat dialog buka
    useEffect(() => {
        if (transaksiData && isOpen) {
            const parsedDate = parseDateFromAPI(transaksiData.tanggal);
            const data = {
                idAkun: transaksiData.idAkun,
                jenisTransaksi: transaksiData.kategori.jenis,
                kategoriId: transaksiData.kategori.id,
                jumlah: transaksiData.jumlah,
                tanggal: formatDateForInput(parsedDate),
                catatan: transaksiData.catatan || '',
            };
            resetFormAndGenerateFields(data);
        }
    }, [transaksiData, isOpen, resetFormAndGenerateFields]);

    // Fetch kategori saat buka
    useEffect(() => {
        if (isOpen) {
            fetchKategori();
        }
    }, [isOpen, fetchKategori]);

    // Handle peubahan input
    const handleChange = (name: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (name === 'jenisTransaksi') {
                const kategoriList = value === 1 ? listKategoriPengeluaran : listKategoriPemasukan;
                const kategoriId = kategoriList.length > 0 ? kategoriList[0].id : '';
                newData.kategoriId = kategoriId;

                // Re-generate fields
                resetFormAndGenerateFields(newData);
            }

            return newData;
        });
    };

    // Handle submit
    const handleSubmit = async (formData: Record<string, any>) => {
        if (!transaksiData) {
            toast.error('Data transaksi tidak valid!');
            return;
        }

        if (!formData.kategoriId) {
            toast.error('Silakan pilih kategori.');
            return;
        }

        const parsedDate = new Date(formData.tanggal);
        if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');


        const data: PutTransaksiBody = {
            id: transaksiData.id,
            idKategori: formData.kategoriId,
            idAkun: formData.idAkun,
            jumlah: parseFloat(formData.jumlah) || 0,
            tanggal: parsedDate.toISOString(),
            catatan: formData.catatan || '',
        }

        handler_PutTransaksi(
            {
                setLoading,
                toaster: toast,
                whenSuccess: () => {
                    closeDialog();
                    whenSuccess();
                }
            },
            data
        )
    };

    const handleSekarang = () => {
        setFormData(prev => ({
            ...prev,
            tanggal: formatDateForInput(new Date()),
        }));
    };

    const extraButtons: ExtraButton[] = [
        {
            label: 'Sekarang',
            onClick: handleSekarang,
            variant: 'secondary',
            disabled: loading,
        },
    ];

    return (
        <FormDialog
            isOpen={isOpen}
            title="Edit Transaksi"
            description="Edit detail transaksi keuangan."
            fields={fields}
            initialData={formData}
            onCancel={closeDialog}
            onSubmit={handleSubmit}
            submitLabel={loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            cancelLabel="Batal"
            extraButtons={extraButtons}
            onChange={handleChange}
        />
    );
}