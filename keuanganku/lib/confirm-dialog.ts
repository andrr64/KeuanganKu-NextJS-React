// lib/confirm-dialog.ts
import { createConfirmDialog } from './create-confirm-dialog';

// Buat instance tunggal (Singleton)
const dialog = createConfirmDialog();

// Ekspor hook dan fungsi imperative
export const useConfirmDialog = dialog.useConfirmDialog;
export const confirmDialog = {
  show: dialog.show,
  hide: dialog.hide,
};