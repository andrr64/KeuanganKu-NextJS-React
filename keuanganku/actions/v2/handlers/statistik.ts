import { StatistikCashflow, StatistikRingkasanBulanIni, StatistikTransaksiTiapKategori } from "@/types/response/statistik";
import { HandlerParams } from "./base";
import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { API_ROUTES } from "@/lib/API/v2/routes";

export const handler_GetStatistik_transaksiTiapKategori = async (
    actions: HandlerParams<StatistikTransaksiTiapKategori>,
    period: 1 | 2 | 3 | number
) => {
    const url = `${API_ROUTES.STATISTIK.KATEGORI}?periode=${period}`;
    await handleApiResponse(
        apiRequester<StatistikTransaksiTiapKategori>(
            url.toString(),
            {
                method: "GET"
            }
        ),
        actions
    )
}

export const handler_GetStatistik_ringkasan = async (
    actions: HandlerParams<StatistikRingkasanBulanIni>
) => {
    await handleApiResponse(
        apiRequester<StatistikRingkasanBulanIni>(
            API_ROUTES.STATISTIK.RINGKASAN_BULAN_INI,
            { method: "GET" }
        ),
        actions
    )
}

export const handler_GetStatistik_cashflow = async (
    actions: HandlerParams<StatistikCashflow[]>,
    period: 1 | 2 | 3
) => {
    const url = new URL(API_ROUTES.STATISTIK.CASHFLOW)
    url.searchParams.set("periode", period.toString())
    await handleApiResponse(
        apiRequester<StatistikCashflow[]>(
            API_ROUTES.STATISTIK.CASHFLOW,
            {method: 'GET'}
        ),
        actions
    )
}