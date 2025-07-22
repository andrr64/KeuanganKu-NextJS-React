type APIResponse<T = undefined> = {
    message: string;
    data?: T;
    success: boolean;
};

export async function fetcher<T = undefined>(
    url: string,
    options?: RequestInit
): Promise<APIResponse<T>> {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Timeout 2 detik

    try {
        const res = await fetch(url, {
            credentials: 'include', // ini penting agar cookie diterima
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            },
            signal: controller.signal,
            ...options,
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || 'Unknown error');
        }

        return json;
    } catch (error: any) {
        clearTimeout(timeoutId); // jaga-jaga kalau error lain

        if (error.name === 'AbortError') {
            throw new Error('Request timeout (2000 ms)');
        }

        throw error;
    }
}
