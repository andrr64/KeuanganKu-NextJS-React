'use client';

import { useEffect, useState } from 'react';
import FormDialog, { FieldConfig } from '@/components/FormDialog';
import { GoalResponse } from '@/types/goal';
import { getDateFromISO, getNowDateISOString, getPresetTargetDate } from '@/lib/timeutil';
import { GoalModel } from '@/types/model/Goal';
import { PutGoal } from '@/types/request/goal';
import { handler_PutGoal } from '@/actions/v2/handlers/goal';
import toast from 'react-hot-toast';
import { useDialog } from '@/hooks/dialog';

type Props = {
  isOpen: boolean;
  data: GoalResponse | null;
  onClose: () => void;
  whenSuccess: () => void;
};

export default function DialogEditGoal({ isOpen, data, onClose, whenSuccess }: Props) {
  const [formData, setFormData] = useState({
    nama: '',
    target: '',
    tanggalTarget: '', // format: YYYY-MM-DD
  });

  const loading = useDialog()
  
  // Reset form saat dialog dibuka
  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        nama: data.nama,
        target: data.target?data.target.toString() : '',
        tanggalTarget: data.tanggalTarget?data.tanggalTarget: '',
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
      placeholder: 'Contoh: 50000000',
    },
    {
      name: 'tanggalTarget',
      label: 'Tanggal Target',
      type: 'date', 
    },
  ];

  useState(() => {}, [
    f
  ])

  const handleSubmit = async (formValues: Record<string, any>) => {
    const { nama, target, tanggalTarget } = formValues;

    if (!data?.id) return;

    if (!nama?.trim()) {
      return alert('Nama goal wajib diisi.');
    }

    const newData: PutGoal = {
      id: data.id,
      nama,
      target,
      tanggalTarget,
    }

    console.log("Data yang dikirimkan: " + newData);
    
    handler_PutGoal(
      {
        toaster: toast,
        whenSuccess: () => {
          onClose()
          whenSuccess()
        }
      },
      newData
    )
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
      title="Edit Goal"
      description="Perbarui data goal yang sudah ada."
      fields={fields}
      initialData={formData}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
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