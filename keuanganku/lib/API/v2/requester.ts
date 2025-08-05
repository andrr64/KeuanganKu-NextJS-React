import { HandlerParams } from "@/actions/v2/handlers/base";

/**
 * Tipe respons standar dari server.
 *
 * @template T - Tipe data yang dikembalikan oleh server.
 * @property {string} message - Pesan dari server, biasanya untuk memberi tahu hasil request.
 * @property {T} [data] - Data opsional yang dikembalikan dari server.
 * @property {boolean} success - Menunjukkan apakah permintaan berhasil.
 */
export type ServerResponseV2<T = undefined> = {
    message: string;
    data?: T;
    success: boolean;
};

/**
 * Fungsi pembungkus fetch() untuk melakukan permintaan HTTP dengan fitur timeout dan dukungan cookie.
 *
 * @template T - Tipe data yang diharapkan dalam field `data` dari respons server.
 *
 * @param {string} url - URL endpoint yang akan dipanggil.
 * @param {RequestInit} [options] - Opsi tambahan untuk request seperti method, headers, body, dll.
 * @returns {Promise<ServerResponseV2<T>>} - Promise yang mengembalikan respons dari server.
 *
 * @throws {Error} - Melempar error jika permintaan gagal atau jika terjadi timeout (2 detik).
 *
 * @example
 * const res = await requester<UserModel[]>('/api/users');
 * if (res.success) {
 *   console.log(res.data);
 * }
 */
export async function apiRequester<T = undefined>(
    url: string,
    options?: RequestInit
): Promise<ServerResponseV2<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Timeout 2 detik

    try {
        const res = await fetch(url, {
            credentials: 'include', // agar cookie disertakan dalam request
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            },
            signal: controller.signal,
            ...options,
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.message || 'Terjadi kesalahan tidak diketahui');
        }

        return json;
    } catch (error: any) {
        clearTimeout(timeoutId); // pastikan timeout dibersihkan jika error
        if (error.name === 'AbortError') {
            throw new Error('Permintaan melebihi batas waktu (2000 ms)');
        }
        throw error;
    }
}


/**
 * Menangani hasil respons dari `apiRequester` dengan callback opsional untuk sukses dan gagal,
 * serta menampilkan notifikasi jika disediakan.
 *
 * @template T - Tipe data yang dikembalikan dalam respons.
 *
 * @param {Promise<ServerResponseV2<T>>} responsePromise - Promise dari pemanggilan API yang menggunakan `apiRequester`.
 * @param {HandlerParams<T>} [params] - Parameter opsional seperti:
 *    - `whenSuccess`: fungsi callback jika respons sukses.
 *    - `whenFailed`: fungsi callback jika respons gagal.
 *    - `toaster`: objek untuk menampilkan notifikasi (toast).
 * @param {{ success?: string; error?: string }} [defaultMessages] - Pesan default untuk notifikasi jika tidak ada di response.
 *
 * @example
 * handleApiResponse(fetchUserData(), {
 *   whenSuccess: (data) => console.log("User:", data),
 *   toaster: toast,
 * });
 */
export async function handleApiResponse<T>(
    responsePromise: Promise<ServerResponseV2<T>>,
    params: HandlerParams<T> = {},
    defaultMessages?: { success?: string; error?: string }
) {
    params.setLoading?.(true);
    const { success = "Sukses", error = "Terjadi kesalahan" } = defaultMessages || {};
    let statusError: string | null = null;
    const letThrowError = params.throwError == true
    try {
        const response = await responsePromise;
        if (response.success && response.data !== undefined) {
            params.toaster?.success?.(response.message || success);
            params.whenSuccess?.(response.data);
        } else {
            const errorMsg = response.message || error;
            params.toaster?.error?.(errorMsg);
            params.whenFailed?.(errorMsg);
            statusError = errorMsg; // 🛠️ SET DI SINI
        }
    } catch (err: any) {
        const errorMsg = err.message || error;
        params.toaster?.error?.(errorMsg);
        params.whenFailed?.(errorMsg);
        statusError = errorMsg; 
    } finally {
        params.setLoading?.(false);
        if (statusError && letThrowError) {
            throw new Error(statusError);
        }
    }
}
