import { Metadata } from "next";
import AkunPage from "./AkunPage";

export const metadata: Metadata = {
  title: 'Akun | KeuanganKu',
  description: 'AKun',
}

export default function Page() {
  return <AkunPage />
}
