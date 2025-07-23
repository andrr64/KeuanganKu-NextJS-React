import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export type RingkasanBulanIniResponse = {
    totalSaldo: number;
    totalPemasukanBulanIni: number;
    totalPengeluaranBulanIni: number;
    cashflowBulanIni: number;
}

export const getRecentDashboard = async () => {
    return fetcher<RingkasanBulanIniResponse>(API_ROUTES.STATISTIK.GET_RINGKASAN_BULAN_INI, {
        method: 'GET',
    });
}
