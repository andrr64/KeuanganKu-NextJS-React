export function formatUang(value: number | string): string {
    return new Intl.NumberFormat('en-US').format(Number(value));
}

export const formatTanggal = (isoString: string): string => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};