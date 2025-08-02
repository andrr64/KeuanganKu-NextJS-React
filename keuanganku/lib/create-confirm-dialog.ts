// lib/createConfirmDialog.ts
import { useState } from 'react';

type ConfirmDialogOptions = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void | Promise<void>;
  onClose?: () => void;
};

export type ConfirmDialogInstance = {
  show: (options: ConfirmDialogOptions) => void;
  hide: () => void;
};

export function createConfirmDialog() {
  let openModal: ((options: ConfirmDialogOptions) => void) | null = null;

  // Fungsi yang bisa dipanggil dari mana saja
  const show = (options: ConfirmDialogOptions) => {
    if (openModal) openModal(options);
  };

  const hide = () => {
    if (openModal) openModal({} as any); // trigger re-render dengan kosong
  };

  // Ini adalah hook yang digunakan di komponen UI
  const useConfirmDialog = () => {
    const [state, setState] = useState<ConfirmDialogOptions & { isOpen: boolean }>({
      isOpen: false,
    });

    openModal = (options: ConfirmDialogOptions) => {
      setState({
        isOpen: true,
        title: 'Konfirmasi',
        description: '',
        cancelText: 'Batal',
        confirmText: 'Ya',
        ...options,
        onConfirm: async () => {
          try {
            if (options.onConfirm) await options.onConfirm();
          } finally {
            setState((s) => ({ ...s, isOpen: false }));
          }
        },
        onClose: () => {
          if (options.onClose) options.onClose();
          setState((s) => ({ ...s, isOpen: false }));
        },
      });
    };

    return {
      ...state,
      hide: () => setState((s) => ({ ...s, isOpen: false })),
    };
  };

  return { show, hide, useConfirmDialog } as const;
}