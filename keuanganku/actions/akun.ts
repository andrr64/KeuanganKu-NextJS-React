import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { AkunResponse } from "@/types/akun";

export const tambahAkun = async (nama: string, saldoAwal: number) => {
    return fetcher(API_ROUTES.AKUN.POST, {
        method: 'POST',
        body: JSON.stringify({ namaAkun: nama, saldoAwal }),
    });
}

export const getAllAkun = async () => {
    return fetcher<AkunResponse[]>(API_ROUTES.AKUN.GET, {
        method: 'GET',
    });
}

export const hapusAkun = async (id: string) => {
    return fetcher(API_ROUTES.AKUN.HAPUS(id), {
        method: 'DELETE',
    });
}

export const editAkun = async(id: string, nama: String) => {
    return fetcher(API_ROUTES.AKUN.UPDATE_NAMA(id), {
        method: "PUT",
        body: JSON.stringify({nama})
    });
}