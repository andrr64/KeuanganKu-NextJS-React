import { StatistikTransaksiTiapKategoriResponse } from "@/types/response/statistik";
import { HandlerParams } from "./base";
import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { API_ROUTES } from "@/lib/API/v2/routes";

export const handler_GetStatistik_transaksiTiapKategori = async (
    actions: HandlerParams<StatistikTransaksiTiapKategoriResponse>,
    period: 1 | 2 | 3
) => {
    const url = `${API_ROUTES.STATISTIK.KATEGORI}?periode=${period}`;
    await handleApiResponse(
        apiRequester<StatistikTransaksiTiapKategoriResponse>(
            url.toString(),
            {
                method: "GET"
            }
        ),
        actions
    )
}