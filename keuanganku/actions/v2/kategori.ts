import { API_ROUTES } from "@/lib/API/routes";
import { fetcher } from "@/lib/fetcher";
import { KategoriModel } from "@/models/Kategori";
import { GetKategoriParams, PostKategoriBody } from "@/types/request/kategori";
import { Pageable } from "@/types/response/pageable";
import { handleApiResponse } from "./base";

export const action_v2_fetchKategori = async (
    actions: ActionParams<Pageable<KategoriModel[]>>,
    params: GetKategoriParams
) => {
    const url = new URL(API_ROUTES.KATEGORI.GET_ALL);

    if (params.page !== undefined) url.searchParams.set("page", params.page.toString());
    if (params.size !== undefined) url.searchParams.set("size", params.size.toString());
    if (params.jenis !== undefined) url.searchParams.set("jenis", params.jenis.toString());
    if (params.keyword) url.searchParams.set("keyword", params.keyword);

    const responsePromise = fetcher<Pageable<KategoriModel[]>>(
        url.toString(),
        {
            method: 'GET'
        }
    );
    await handleApiResponse<Pageable<KategoriModel[]>>(
        responsePromise,
        actions,
        {
            success: "Data kategori berhasil dimuat",
            error: "Gagal memuat data transaksi"
        }
    )
};

export const action_v2_postKategori = async (
    actions: ActionParams,
    body: PostKategoriBody
) => {
    const responsePromise = fetcher(API_ROUTES.KATEGORI.POST, {
        method: 'POST',
        body: JSON.stringify(body)
    })
    await handleApiResponse<string>(responsePromise, actions, {
        success: "Kategori berhasil ditambahkan",
        error: "Gagal menambahkan kategori"
    })
}

export const action_v2_DeleteTransaksi = async (
    actions: ActionParams,
    id?: string
) => {
    const responsePromise = fetcher(API_ROUTES.KATEGORI.DELETE(id));
    await handleApiResponse(responsePromise, actions, {
        success: 'Ok',
        error: 'Something wrong'
    })
}