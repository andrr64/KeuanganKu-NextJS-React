'use client';

import { useEffect, useState } from 'react';
import FormDialog, { FieldConfig } from '@/components/FormDialog';
import { GoalResponse } from '@/types/goal';

type Props = {
  isOpen: boolean;
  data: GoalResponse | null;
  onClose: () => void;
  onSubmit: (id: string, nama: string, target: number, tanggalTarget: string) => void | Promise<void>;
};

export default function DialogEditGoal({ isOpen, data, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  // Konversi format tanggal dari DD/MM/YYYY ke YYYY-MM-DD
  const formatDateInput = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  // State untuk form
  const [formData, setFormData] = useState({
    nama: '',
    target: '',
    tanggalTarget: '',
  });

  // Sync data saat dialog dibuka
  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        nama: data.nama,
        target: data.target.toString(),
        tanggalTarget: formatDateInput(data.tanggalTarget),
      });
    } else {
      setFormData({ nama: '', target: '', tanggalTarget: '' });
    }
  }, [isOpen, data]);

  const fields: FieldConfig[] = [
    {
      name: 'nama',
      label: 'Nama Goal',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Dana Darurat',
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
      type: 'date',
      required: true,
    },
  ];

  const handleSubmit = async (formValues: Record<string, any>) => {
    const { nama, target, tanggalTarget } = formValues;

    if (!data?.id) return;

    const [year, month, day] = tanggalTarget.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    setLoading(true);
    try {
      await onSubmit(data.id, nama.trim(), parseFloat(target), formattedDate);
      onClose(); // Tutup setelah sukses
    } catch (error) {
      console.error('Gagal memperbarui goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="Edit Goal"
      description="Perbarui data goal yang sudah ada."
      fields={fields}
      initialData={formData}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitLabel={loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      cancelLabel="Batal"
    />
  );
}