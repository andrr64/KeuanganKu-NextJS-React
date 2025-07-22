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

export function getColors(jumlahWarna: number): string[] {
  const colors: string[] = [];

  for (let i = 0; i < jumlahWarna; i++) {
    const hue = Math.floor(Math.random() * 360); // hue 0–359
    const saturation = 70 + Math.floor(Math.random() * 20); // 70–90%
    const lightness = 50 + Math.floor(Math.random() * 10); // 50–60%

    const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(hslToHex(hue, saturation, lightness));
  }

  return colors;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

  return `#${[f(0), f(8), f(4)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;
}
