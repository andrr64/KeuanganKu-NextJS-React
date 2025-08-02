import { GetKategoriParams, PostKategoriBody } from "@/types/request/kategori";
import { HandlerParams } from "./base";
import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { API_ROUTES } from "@/lib/API/v2/routes";
import { Pageable } from "@/types/response/pageable";
import { KategoriModel } from "@/types/model/kategori";

export const handler_tambahKategori = async (
    handlerParams: HandlerParams,
    body: PostKategoriBody
) => {
    await handleApiResponse(
        apiRequester(
            API_ROUTES.KATEGORI.BASE,
            {
                method: "POST",
                body: JSON.stringify(body)
            }
        ),
        handlerParams
    );
}

export const handler_updateKategori = async (
    handlerParams: HandlerParams,
    body: { id: string; nama: string }
) => {
    const { id, ...bodyWithoutId } = body;
    await handleApiResponse(
        apiRequester(
            API_ROUTES.KATEGORI.BY_ID(id),
            {
                method: "PUT",
                body: JSON.stringify(bodyWithoutId)
            }
        ),
        handlerParams
    )
}

export const handler_deleteKategori = async (
    handlerParams: HandlerParams,
    id: string
) => {
    await handleApiResponse(
        apiRequester(
            API_ROUTES.KATEGORI.BY_ID(id),
            { method: "DELETE" }
        ),
        handlerParams
    );
}

export const handler_fetchKategori = async (
    handlerParams: HandlerParams<Pageable<KategoriModel[]>>,
    params: GetKategoriParams
) => {
    const url = new URL(API_ROUTES.KATEGORI.BASE);
    if (params.page !== undefined) url.searchParams.set("page", params.page.toString());
    if (params.size !== undefined) url.searchParams.set("size", params.size.toString());
    if (params.jenis !== undefined) url.searchParams.set("jenis", params.jenis.toString());
    if (params.keyword) url.searchParams.set("keyword", params.keyword);

    await handleApiResponse<Pageable<KategoriModel[]>>(
        apiRequester(
            url.toString(),
            { method: "GET" }
        ),
        handlerParams
    )
}