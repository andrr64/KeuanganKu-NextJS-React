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

export function parseTanggalFromMMDDYYYY(dateString: string): Date {
  // Split the date and time parts
  const [datePart, timePart] = dateString.split(' ');
  
  // Split day, month, year
  const [day, month, year] = datePart.split('/').map(Number);
  
  // Split hours, minutes if time exists
  let hours = 0;
  let minutes = 0;
  
  if (timePart) {
    [hours, minutes] = timePart.split(':').map(Number);
  }

  // Note: month is 0-based in Date constructor
  return new Date(year, month - 1, day, hours, minutes);
}