import { Metadata } from "next";
import AkunPage from "./KeuanganPage";

export const metadata: Metadata = {
  title: 'Akun | KeuanganKu',
  description: 'AKun',
}

export default function Page() {
  return <AkunPage />
}
