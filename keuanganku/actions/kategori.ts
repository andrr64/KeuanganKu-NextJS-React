import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { KategoriResponse } from "@/types/kategori";

export async function getKategoriPengeluaran(){
    return fetcher<KategoriResponse[]>(
        API_ROUTES.KATEGORI.GET_PENGELUARAN, {
            method: 'GET'
        }
    )
}

export async function getKategoriPemasukan(){
    return fetcher<KategoriResponse[]>(
        API_ROUTES.KATEGORI.GET_PEMASUKAN, {
            method: 'GET'
        }
    )
}

export async function getAllKategori(){
    return fetcher<KategoriResponse[]>(
        API_ROUTES.KATEGORI.GET_ALLL, {
            method: 'GET'
        }
    )
}