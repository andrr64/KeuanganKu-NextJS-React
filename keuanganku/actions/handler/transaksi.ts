import { runHandler } from "../handlerWrapper";
import { action_v2_DeleteAkun } from "../v2/akun";

export type HandlerParams<T = null> = {
    id: string;
    whenSuccess?: (data: T) => void;
    whenFailed?: (data: string) => void;
    setLoading?: any;
    toaster?: any;
}

export type PostAkun = {
    nama: string;
    saldoAwal: number;
}

export const handler_HapusAkun = async (data: HandlerParams<string>) => {
    await runHandler(
        async () => await action_v2_DeleteAkun({
            whenSuccess: data.whenSuccess,
            whenFailed: data.whenFailed,
            toaster: data.toaster
        }, data.id,),
        data.setLoading
    )
}

export const handler_TambahAKun = async (data: PostAkun, params: HandlerParams) => {
    
}