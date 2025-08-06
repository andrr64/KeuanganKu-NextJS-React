import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester"
import { API_ROUTES } from "@/lib/API/v2/routes"
import { HandlerParams } from "./base"
import { GetTransaksiParams, PostTransaksiBody, PutTransaksiBody } from "@/types/request/transaksi"
import { Pageable } from "@/types/response/pageable"
import { TransaksiModel } from "@/types/model/transaksi"

export const handler_GetTransaksi = async (
    actions: HandlerParams<Pageable<TransaksiModel[]>>,
    params: GetTransaksiParams
) => {
    const url = new URL(API_ROUTES.TRANSAKSI.BASE);
    if (params.startDate) url.searchParams.set("startDate", params.startDate);
    if (params.endDate) url.searchParams.set("endDate", params.endDate);
    if (params.jenis) url.searchParams.set("jenis", String(params.jenis));
    if (params.idAkun) url.searchParams.set("idAkun", params.idAkun);
    if (params.page !== undefined) url.searchParams.set("page", String(params.page));
    if (params.size !== undefined) url.searchParams.set("size", String(params.size));
    if (params.search) url.searchParams.set("keyword", params.search);

    await handleApiResponse(
        apiRequester<Pageable<TransaksiModel[]>>(
            url.toString(),
            { method: "GET" }
        ),
        actions,
    )
}

export const handler_GetTransaksi_terbaru = async (
    actions: HandlerParams<TransaksiModel[]>
) => {
    await handleApiResponse(
        apiRequester<TransaksiModel[]>(
            API_ROUTES.TRANSAKSI.RECENT,
            {
                method: 'GET'
            }
        ),
        actions
    )
}

export const handler_PostTransaksi = async (actions: HandlerParams, params: PostTransaksiBody) => {
    await handleApiResponse(
        apiRequester(
            API_ROUTES.TRANSAKSI.BASE,
            {
                method: "POST",
                body: JSON.stringify(params)
            }
        ),
        actions
    )
}

export const handler_PutTransaksi = async (actions: HandlerParams, params: PutTransaksiBody) => {
    const { id, ...data } = params;

    await handleApiResponse(
        apiRequester(
            API_ROUTES.TRANSAKSI.BY_ID(params.id),
            {
                method: "PUT",
                body: JSON.stringify(data)
            },
        ),
        actions
    )
}

export const handler_DeleteTransaksi = async (actions: HandlerParams, id: string) => {
    await handleApiResponse(
        apiRequester(
            API_ROUTES.TRANSAKSI.BY_ID(id),
            {
                method: "DELETE",
            },
        ),
        actions
    )
}