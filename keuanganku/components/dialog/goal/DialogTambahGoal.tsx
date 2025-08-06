'use client';

import { useEffect, useState } from 'react';
import FormDialog, { FieldConfig } from '../../FormDialog';
import { handler_PostGoal } from '@/actions/v2/handlers/goal';
import toast from 'react-hot-toast';
import { getNowDateISOString, getPresetTargetDate } from '@/lib/timeutil';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  whenSuccess: () => void;
};

export default function DialogTambahGoal({ isOpen, onClose, whenSuccess }: Props) {
  const fields: FieldConfig[] = [
    {
      name: 'nama',
      label: 'Nama Goal',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Tabungan Rumah',
    },
    {
      name: 'target',
      label: 'Harga (Opsional)',
      type: 'number',
      placeholder: 'Contoh: 50000000',
    },
    {
      name: 'tanggalTarget',
      label: 'Tenggat (Opsional)',
      type: 'date'
    },
  ];

  const [formData, setFormData] = useState({
    nama: '',
    target: '',
    tanggalTarget: '',
  });

  useEffect(() => {
    setFormData(
      {
        nama: '',
        target: '',
        tanggalTarget: '',
      }
    )
  }, [isOpen])

  const handleSubmit = async (data: Record<string, any>) => {
    const { nama, target, tanggalTarget } = data;

    if (!nama?.trim()) {
      return alert('Nama goal wajib diisi.');
    }
    const dataX = {
      nama: nama.trim(),
      target: target,
      tanggalTarget: tanggalTarget,
    }
    handler_PostGoal(
      {
        toaster: toast,
        whenSuccess: () => {
          onClose();
          whenSuccess();
        },
      },
      dataX
    );
  };

  const handlePresetDate = (monthIndex: number) => {
    if (monthIndex == 1) {
      const bulanSekarang = getNowDateISOString().split("-")[1];
      setFormData((prev) => ({ ...prev, tanggalTarget: getPresetTargetDate(Number(bulanSekarang)) }));
    } else {
      const presetDate = getPresetTargetDate(monthIndex);
      setFormData((prev) => ({ ...prev, tanggalTarget: presetDate }));
    }
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="Tambah Goal"
      description="Masukkan data goal baru."
      fields={fields}
      initialData={formData}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan"
      cancelLabel="Batal"
      extraButtons={[
        {
          label: 'Bulan Depan',
          variant: 'secondary',
          onClick: () => handlePresetDate(1),
        },
        {
          label: 'Tahun Depan',
          variant: 'secondary',
          onClick: () => handlePresetDate(12),
        },
      ]}
      onChange={(name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }}
    />
  );
}