/**
 * Mengonversi string ISO 8601 (dalam format UTC) menjadi objek Date lokal.
 * 
 * Fungsi ini membaca waktu dalam format UTC (misal: "2025-12-31T15:00:00.000Z")
 * dan mengembalikan objek `Date` yang sudah disesuaikan dengan zona waktu lokal pengguna.
 * 
 * @param iso8601string - String waktu dalam format ISO 8601 (UTC), contoh: "2025-12-31T15:00:00.000Z"
 * @returns Objek `Date` yang merepresentasikan waktu lokal setelah konversi dari UTC
 * 
 * @example
 * const localDate = convertUTCTimeToLocal("2025-12-31T15:00:00.000Z");
 * console.log(localDate); // Menampilkan waktu lokal (misal WIB: 31 Des 2025, 22:00)
 */
export function convertUTCTimeToLocal(iso8601string: string): Date {
    const utcDate = new Date(iso8601string);
    return utcDate;
}

/**
 * Menghasilkan string waktu lokal dalam format ISO untuk digunakan di input `datetime-local`.
 * 
 * Format yang dihasilkan adalah `YYYY-MM-DDTHH:mm`, sesuai dengan standar HTML5.
 * Waktu yang dihasilkan sudah disesuaikan dengan zona waktu lokal pengguna.
 * 
 * @returns String waktu lokal dalam format `YYYY-MM-DDTHH:mm`
 * 
 * @example
 * const nowLocal = getLocaleDatetimeString();
 * console.log(nowLocal); // Output: "2025-04-05T14:30"
 */
export function getLocaleDatetimeString(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

/**
 * Mengambil bagian tanggal (hari) dari string ISO 8601 dan mengembalikannya dalam format `YYYY-MM-DD`.
 * 
 * Fungsi ini mengabaikan waktu, hanya mengambil tanggal dalam waktu lokal.
 * Berguna untuk menampilkan tanggal di UI tanpa bagian waktu.
 * 
 * @param iso8601string - String waktu dalam format ISO 8601 (bisa UTC atau lokal)
 * @returns String tanggal dalam format `YYYY-MM-DD`
 * 
 * @example
 * const dateStr = getDateFromISO("2025-12-31T15:00:00.000Z");
 * console.log(dateStr); // Output: "2025-12-31" (dalam zona waktu lokal)
 */
export function getDateFromISO(iso8601string: string): string {
    const date = new Date(iso8601string);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dari 0-11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Menghasilkan string tanggal hari ini (dalam waktu lokal) dalam format `YYYY-MM-DD`.
 * 
 * Fungsi ini berguna untuk inisialisasi form, filter, atau komponen yang hanya butuh tanggal.
 * 
 * @returns String tanggal hari ini dalam format `YYYY-MM-DD`
 * 
 * @example
 * const today = getNowDateISOString();
 * console.log(today); // Output: "2025-04-05"
 */
export function getNowDateISOString(): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // ubah ke waktu lokal

    const year = local.getFullYear();
    const month = String(local.getMonth() + 1).padStart(2, '0');
    const day = String(local.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// timeutil.ts

export function getPresetTargetDate(monthIndex: number): string {
    const now = new Date();

    const targetYear = now.getFullYear() + Math.floor(monthIndex / 12);
    const targetMonth = monthIndex % 12;

    const newDate = new Date(targetYear, targetMonth, 1);

    // Format ke "yyyy-MM-dd"
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
    const dd = String(newDate.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

export const formatTanggal = (isoString: string): string => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};