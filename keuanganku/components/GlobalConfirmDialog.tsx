// components/GlobalConfirmDialog.tsx
'use client';

import { useConfirmDialog } from '@/lib/confirm-dialog'; // ✅ import hook dari sini
import ConfirmDialog from './ConfirmDialog'; // Pastikan path benar

export default function GlobalConfirmDialog() {
  const { isOpen, hide, onConfirm, onClose, title, description, cancelText, confirmText } =
    useConfirmDialog();

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={() => {
        onClose?.();
        hide();
      }}
      onConfirm={onConfirm}
      title={title}
      description={description}
      cancelText={cancelText}
      confirmText={confirmText}
    />
  );
}