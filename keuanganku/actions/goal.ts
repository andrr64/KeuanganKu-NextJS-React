import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { GoalResponse } from "@/types/goal";

export type GetGoalParams = {
    page: number;
    size: number;
    keyword?: string;
    tercapai?: boolean;
}
export type GetGoalResponse = {
    content: GoalResponse[]
    totalItems: number
    totalPages: number
    currentPage: number
}
export type PostGoalParams = {
    nama: string;
    target: number;
    tanggalTarget: string;
}
export type UpdateGoalParams = {
    id: string;
    nama: string;
    target: number;
    tanggalTarget: string;
}

export async function getFilteredGoal(params: GetGoalParams) {
    const url = new URL(API_ROUTES.GOAL.GET);
    url.searchParams.set("page", String(params.page));
    url.searchParams.set("size", String(params.size));
    if (params.keyword) url.searchParams.set("keyword", String(params.keyword));
    if (params.tercapai) url.searchParams.set("tercapai", String(params.tercapai));

    return fetcher<GetGoalResponse>(url.toString(), {
        method: 'GET'
    });
}

export async function tambahGoal(params: PostGoalParams) {
    return fetcher(API_ROUTES.GOAL.POST, {
        method: 'POST',
        body: JSON.stringify(params)
    });
}

export async function updateGoal(params: UpdateGoalParams) {
    return fetcher(API_ROUTES.GOAL.PUT(params.id), {
        method: 'PUT',
        body: JSON.stringify({ nama: params.nama, target: params.target, tanggalTarget: params.tanggalTarget })
    });
}

export async function updateStatus(data: { id: string; status: boolean }) {
    return fetcher(API_ROUTES.GOAL.PUT_STATUS(data.id), {
        method: 'PUT',
        body: JSON.stringify({ tercapai: data.status }), // ← pakai data.statusGoal, bukan statusGoal aja
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function tambahUangGoal(params: {id: string, uang: number}){
    return fetcher(API_ROUTES.GOAL.PUT_TAMBAH_UANG(params.id), {
        method: 'PUT',
        body: JSON.stringify({uang: params.uang})
    })
}


export async function kurangiUangGoal(params: {id: string, uang: number}){
    return fetcher(API_ROUTES.GOAL.PUT_KURANGI_UANG(params.id), {
        method: 'PUT',
        body: JSON.stringify({uang: params.uang})
    })
}