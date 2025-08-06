import { PostAKunBody as PostAkunBody, PutAkunBody } from "@/types/request/akun";
import { HandlerParams } from "./base";
import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { API_ROUTES } from "@/lib/API/v2/routes";
import { AkunModel } from "@/types/model/Akun";

export const handler_PostAkun = async (
    params: HandlerParams,
    body: PostAkunBody
) => {
    await handleApiResponse(
        apiRequester(
            API_ROUTES.AKUN.BASE,
            {
                method: "POST",
                body: JSON.stringify({
                    namaAkun: body.nama,
                    saldoAwal: body.saldoAwal
                })
            }
        ),
        params
    )
}

export const handler_GetAkun = async (
    actions: HandlerParams<AkunModel[]>
) => {
    await handleApiResponse(
        apiRequester<AkunModel[]>(
            API_ROUTES.AKUN.BASE,
            { method: "GET" }
        ),
        actions
    )
}

export const handler_PatchAkun_nama = async (
    actions: HandlerParams,
    params: PutAkunBody
) => {
    const {id, nama} = params;
    await handleApiResponse(
        apiRequester(
            API_ROUTES.AKUN.UPDATE_NAMA(id),
            {
                method: "PATCH",
                body: JSON.stringify({nama})
            }
        ),
        actions
    )
}

export const handler_DeleteAkun = async (
    actions: HandlerParams,
    id: string 
) => {
    await handleApiResponse (
        apiRequester(
            API_ROUTES.AKUN.DELETE(id),
            {
                method: "DELETE"
            }
        ),
        actions
    )
}