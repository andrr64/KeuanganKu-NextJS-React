export function convertUTCTimeToLocal(iso8601string: string): Date {
    const utcDate = new Date(iso8601string);
    return utcDate;
}


export function getLocaleDatetimeString (): string {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
}