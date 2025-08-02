export type GetKategoriParams = {
    page?: number
    size?: number
    jenis?: 1 | 2
    keyword?: string
}

export type PostKategoriBody = {
    nama: string;
    jenis: 1 | 2;
}
