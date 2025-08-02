import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { handleApiResponse } from "./base";

export const action_v2_PostLogin = async(
    actions : ActionParams,
    body: { username : String; password: String; }
) => {
    const url = API_ROUTES.AUTH.LOGIN;
    const promise = fetcher(url, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    await handleApiResponse(promise, actions, { 
        success: "Login berhasil",
        error: "Username atau password salah"
    })
}

export const action_v2_PostLogout = async (
    actions: ActionParams<string>
) => {
    const promise = fetcher(API_ROUTES.AUTH.LOGOUT, {
        method: 'POST'
    });
    await handleApiResponse(promise, actions, {
        success: "Ok",
        error: "Failed"
    })
}