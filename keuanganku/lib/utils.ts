import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTanggalMMDDYYYY(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const bulan = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() 0-based
  const tanggal = String(d.getDate()).padStart(2, '0');
  const tahun = d.getFullYear();

  const jam = String(d.getHours()).padStart(2, '0');
  const menit = String(d.getMinutes()).padStart(2, '0');

  return `${tanggal}/${bulan}/${tahun} ${jam}:${menit}`;
}
