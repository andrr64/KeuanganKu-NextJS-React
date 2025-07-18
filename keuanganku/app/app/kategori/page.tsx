import { Metadata } from "next";
import KategoriPage from "./KategoriPage";

export const metadata: Metadata = {
    title: 'Kategori | KeuanganKu',
    description: 'Kategori'
}

export default function Page(){
    return <KategoriPage/>
}