'use client';

import { useMemo, useState } from 'react';
import FormDialog, { FieldConfig } from '../../FormDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nama: string, target: number, tanggalTarget: string) => void | Promise<void>;
};

export default function DialogTambahGoal({ isOpen, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  const fields: FieldConfig[] = useMemo(
    () => [
      {
        name: 'nama',
        label: 'Nama Goal',
        type: 'text',
        required: true,
        placeholder: 'Contoh: Tabungan Rumah',
      },
      {
        name: 'target',
        label: 'Target (Rp)',
        type: 'number',
        required: true,
        placeholder: 'Contoh: 50000000',
      },
      {
        name: 'tanggalTarget',
        label: 'Tanggal Target',
        type: 'date', // ✅ Gunakan date picker
        required: true,
      },
    ],
    []
  );

  const handleSubmit = async (data: Record<string, any>) => {
    const { nama, target, tanggalTarget } = data;

    if (!nama || !target || !tanggalTarget) return;

    // Konversi YYYY-MM-DD → DD/MM/YYYY
    const [year, month, day] = tanggalTarget.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    setLoading(true);
    try {
      await onSubmit(nama.trim(), parseFloat(target), formattedDate);
      onClose();
    } catch (error) {
      console.error('Gagal menambahkan goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="Tambah Goal"
      description="Masukkan data goal baru."
      fields={fields}
      initialData={{ nama: '', target: '', tanggalTarget: '' }} // kosong
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitLabel={loading ? 'Menyimpan...' : 'Simpan'}
      cancelLabel="Batal"
      extraButtons={[
        {
          label: 'Bulan Depan',
          variant: 'secondary',
          disabled: loading,
          onClick: () => {
            if (loading) return;
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const tanggal = nextMonth.toISOString().split('T')[0]; // YYYY-MM-DD
            const input = document.querySelector<HTMLInputElement>('input[name="tanggalTarget"]');
            if (input) {
              input.value = tanggal;
              input.dispatchEvent(new Event('input', { bubbles: true })); // trigger React state update
            }
          },
        },
        {
          label: 'Tahun Depan',
          variant: 'secondary',
          disabled: loading,
          onClick: () => {
            if (loading) return;
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            const tanggal = nextYear.toISOString().split('T')[0];
            const input = document.querySelector<HTMLInputElement>('input[name="tanggalTarget"]');
            if (input) {
              input.value = tanggal;
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          },
        },
      ]}
    />
  );
}