import { Metadata } from "next";
import ProfilPage from "./ProfilPage";

export const metadata: Metadata = {
    title: 'Profil | KeuanganKu',
    description: 'Profil'
}

export default function Page(){
    return <ProfilPage/>
}