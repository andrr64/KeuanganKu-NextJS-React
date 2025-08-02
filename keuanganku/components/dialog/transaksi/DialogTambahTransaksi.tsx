// components/dialog/DialogTambahTransaksi.tsx
'use client';
import { Fragment, useEffect, useState } from 'react';
import FormDialog, { FieldConfig } from '@/components/FormDialog';
import { KategoriResponse } from '@/types/kategori';
import toast from 'react-hot-toast';
import { AkunModel } from '@/models/Akun';
import { handler_fetchKategori } from '@/actions/v2/handlers/kategori';
import { handler_PostTransaksi } from '@/actions/v2/handlers/transaksi';
import { getLocaleDatetimeString } from '@/lib/timeutil';

interface DialogTambahTransaksiProps {
    isOpen: boolean;
    closeDialog: () => void;
    whenSuccess: () => void;
    akunOptions: AkunModel[];
    whenFailed?: () => void;
}

export default function DialogTambahTransaksi({
    isOpen,
    closeDialog,
    akunOptions,
    whenSuccess,
    whenFailed
}: DialogTambahTransaksiProps) {
    const [formData, setFormData] = useState({
        idAkun: akunOptions[0]?.id || '',
        jenis: 1 as 1 | 2,
        idKategori: '',
        jumlah: 0,
        tanggal: new Date().toISOString().slice(0, 16),
        catatan: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [listKategoriPengeluaran, setKategoriPengeluaran] = useState<KategoriResponse[]>([]);
    const [listKategoriPemasukan, setKategoriPemasukan] = useState<KategoriResponse[]>([]);

    const { idAkun, jenis, idKategori, jumlah, tanggal, catatan } = formData;

    useEffect(() => {
        if (isOpen) {
            handler_fetchKategori({
                setLoading: setIsLoading,
                whenSuccess: (pageableKategori) => {
                    const semuaKategori = pageableKategori.content;
                    const pengeluaran = semuaKategori.filter(k => k.jenis === 1);
                    const pemasukan = semuaKategori.filter(k => k.jenis === 2);
                    setKategoriPengeluaran(pengeluaran);
                    setKategoriPemasukan(pemasukan);
                    setFormData(prev => ({
                        ...prev,
                        idKategori: jenis === 1 && pengeluaran.length > 0 ? pengeluaran[0].id :
                            jenis === 2 && pemasukan.length > 0 ? pemasukan[0].id : ''
                    }));
                },
                whenFailed: (msg) => {
                    toast.error(msg);
                    closeDialog();
                }
            }, {});
        }
    }, [isOpen]);

    useEffect(() => {
        if (akunOptions.length > 0 && !idAkun) {
            setFormData(prev => ({ ...prev, idAkun: akunOptions[0].id }));
        }
    }, [akunOptions, idAkun]);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                idAkun: akunOptions[0]?.id || '',
                jenis: 1,
                idKategori: '',
                jumlah: 0,
                tanggal: getLocaleDatetimeString(),
                catatan: ''
            });
        }
    }, [isOpen, akunOptions]);

    // Update kategori saat jenis berubah
    useEffect(() => {
        const currentList = jenis === 1 ? listKategoriPengeluaran : listKategoriPemasukan;
        if (currentList.length > 0) {
            setFormData(prev => ({ ...prev, idKategori: currentList[0].id }));
        }
    }, [jenis, listKategoriPengeluaran, listKategoriPemasukan]);

    const handleWaktuSekarang = () => {
        setFormData(prev => ({ ...prev, tanggal: getLocaleDatetimeString() }));
    };

    const handleSubmit = async (data: Record<string, any>) => {
        if (!data.idKategori) {
            toast.error('Silakan pilih kategori.');
            return;
        }
        if (isNaN(new Date(data.tanggal).getTime())) {
            toast.error('Tanggal tidak valid!');
            return;
        }

        handler_PostTransaksi(
            {
                setLoading: setIsLoading,
                toaster: toast,
                whenSuccess: () => {
                    whenSuccess();
                    closeDialog();
                },
                whenFailed
            },
            {
                idKategori: data.idKategori,
                idAkun: data.idAkun,
                jumlah: parseFloat(data.jumlah),
                tanggal: new Date(data.tanggal).toISOString(),
                catatan: data.catatan
            }
        );
    };

    const kategoriOptions = (jenis === 1 ? listKategoriPengeluaran : listKategoriPemasukan)
        .map(k => ({ label: k.nama, value: k.id }));

    const fields: FieldConfig[] = [
        {
            name: 'idAkun',
            label: 'Akun',
            type: 'select',
            required: true,
            options: akunOptions.map(a => ({ label: a.nama, value: a.id }))
        },
        {
            name: 'jenis',
            label: 'Jenis Transaksi',
            type: 'select',
            required: true,
            options: [
                { label: 'Pengeluaran', value: 1 },
                { label: 'Pemasukan', value: 2 }
            ]
        },
        {
            name: 'idKategori',
            label: 'Kategori',
            type: 'select',
            required: true,
            options: kategoriOptions
        },
        {
            name: 'jumlah',
            label: 'Jumlah',
            type: 'number',
            required: true
        },
        {
            name: 'tanggal',
            label: 'Tanggal',
            type: 'datetime-local',
            required: true
        },
        {
            name: 'catatan',
            label: 'Catatan (Opsional)',
            type: 'textarea'
        }
    ];

    return (
        <FormDialog
            isOpen={isOpen}
            title="Tambah Transaksi"
            description="Masukkan detail transaksi keuangan."
            fields={fields}
            initialData={formData}
            onCancel={closeDialog}
            onSubmit={handleSubmit}
            submitLabel={isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
            cancelLabel="Batal"
            extraButtons={[
                {
                    label: 'Sekarang',
                    variant: 'secondary',
                    disabled: isLoading,
                    onClick: handleWaktuSekarang
                }
            ]}
            onChange={(name, value) => {
                if (name === 'jenis') {
                    setFormData(prev => ({
                        ...prev,
                        jenis: Number(value) as 1 | 2,
                        idKategori: '' // reset, biar useEffect handle
                    }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: value }));
                }
            }}
        />
    );
}