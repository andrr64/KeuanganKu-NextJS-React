export type PostGoal = {
    nama: string;
    target?: number;
    tanggalTarget?: string;
}

export type GetGoal = {
    page: number;
    size: number;
    keyword?: string;
    tercapai?: boolean;
}

export type PutGoal = {
    id: string;
    nama: string;
    target: number;
    tanggalTarget: string;
}

export type PostKurangiUangGoal = {
    id: string;
    uang: number;
}