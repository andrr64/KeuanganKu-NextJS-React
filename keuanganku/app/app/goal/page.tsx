import { Metadata } from "next";
import GoalPage from "./GoalPage";
export const metadata: Metadata = {
    title: 'Goal | KeuanganKu',
    description: 'Kategori'
}

export default function Page(){
    return <GoalPage/>
}