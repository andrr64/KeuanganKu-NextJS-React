import { PenggunaInfoResponse } from "@/types/response/pengguna";
import { HandlerParams } from "./base";
import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { API_ROUTES } from "@/lib/API/v2/routes";

export const handler_GetPengguna_me = async (
    actions: HandlerParams<PenggunaInfoResponse>
) => {
    await handleApiResponse(
        apiRequester<PenggunaInfoResponse>(
            API_ROUTES.PENGGUNA.ME,
            {method: "GET"}
        ),
        actions
    )
}