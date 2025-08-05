'use client';

import { useEffect, useState } from 'react';
import FormDialog, { FieldConfig } from '@/components/FormDialog';
import { handler_PatchSubtractGoalFunds } from '@/actions/v2/handlers/goal';
import toast from 'react-hot-toast';
import { GoalModel } from '@/types/model/Goal';

type Props = {
    isOpen: boolean;
    goal: GoalModel | null;
    onClose: () => void;
    whenSuccess: () => void;
};

export default function DialogKurangiUangGoal({ isOpen, goal, onClose, whenSuccess }: Props) {
    const [formData, setFormData] = useState({
        jumlah: '',
    });

    // Reset form saat dialog dibuka
    useEffect(() => {
        if (isOpen) {
            setFormData({ jumlah: '' });
        }
    }, [isOpen]);

    const fields: FieldConfig[] = [
        {
            name: 'jumlah',
            label: 'Jumlah Uang (Rp)',
            type: 'number',
            required: true,
            placeholder: 'Masukkan jumlah uang',
        },
    ];

    const handleSubmit = async(data: Record<string, any>) => {
        const value = parseFloat(data.jumlah);
        if (isNaN(value) || value <= 0 || !goal) {
            toast.error('Jumlah harus lebih dari 0.');
            return;
        }

        await handler_PatchSubtractGoalFunds(
            {
                toaster: toast,
                whenSuccess,
            },
            { id: goal.id, uang: value }
        );
    };

    return (
        <FormDialog
            isOpen={isOpen}
            title="Kurangi Uang dari Goal"
            description="Masukkan jumlah uang yang ingin dikurangi dari goal ini."
            fields={fields}
            initialData={formData}
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitLabel="Kurangi"
            cancelLabel="Batal"
            onChange={(name, value) => {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }}
            extraButtons={[]}
        />
    );
}