import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { KategoriResponse } from "@/types/kategori";
import { deprecate } from "util";
export type GetFilteredKategoriParams = {
    page?: number
    size?: number
    jenis?: 1 | 2
    keyword?: string
}

export type KategoriPaginatedResponse = {
    content: KategoriResponse[]
    totalItems: number
    totalPages: number
    currentPage: number
}
export async function getKategoriPengeluaran() {
    return fetcher<KategoriResponse[]>(
        API_ROUTES.KATEGORI.GET_PENGELUARAN, {
        method: 'GET'
    }
    )
}

export async function getKategoriPemasukan() {
    return fetcher<KategoriResponse[]>(
        API_ROUTES.KATEGORI.GET_PEMASUKAN, {
        method: 'GET'
    }
    )
}

/**
 * @deprecated Gunakan getFilteredKategori() sebagai gantinya.
 */
export async function getAllKategori() {
    return fetcher<KategoriResponse[]>(
        API_ROUTES.KATEGORI.GET_ALLL, {
        method: 'GET'
    }
    )
}

export async function getFilteredKategori(params: GetFilteredKategoriParams) {
    const url = new URL(API_ROUTES.KATEGORI.FILTERE)

    if (params.page !== undefined) url.searchParams.set("page", String(params.page))
    if (params.size !== undefined) url.searchParams.set("size", String(params.size))
    if (params.jenis !== undefined) url.searchParams.set("jenis", String(params.jenis))
    if (params.keyword) url.searchParams.set("keyword", params.keyword)

    return fetcher<KategoriPaginatedResponse>(url.toString(), {
        method: "GET"
    })
}

