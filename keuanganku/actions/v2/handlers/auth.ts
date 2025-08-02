import { API_ROUTES } from "@/lib/API/v2/routes";
import { HandlerParams } from "./base";
import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { PostLogin, PostRegisterUser } from "@/types/request/pengguna";

export const handler_AuthLogin = async (params: HandlerParams, body: PostLogin) => {
    await handleApiResponse(apiRequester(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(body)
    }), params)
}

export const handler_AuthLogout = async (params: HandlerParams) => {
    await handleApiResponse(
        apiRequester(API_ROUTES.AUTH.LOGOUT, {
            method: 'POST'
        }),params
    )
}

export const  handler_AuthDaftar = async (params: HandlerParams, body: PostRegisterUser) => {
    await handleApiResponse(
        apiRequester (
            API_ROUTES.AUTH.REGISTER,
            {
                method: "POST",
                body: JSON.stringify(body)
            }
        ),
        params
    );
}