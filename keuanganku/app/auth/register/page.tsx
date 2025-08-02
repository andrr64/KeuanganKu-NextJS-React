import { Metadata } from "next";
import RegisterPage from "./RegisterPage";

export const metadata: Metadata = {
  title: 'Register | KeuanganKu',
  description: 'Halaman login untuk masuk ke KeuanganKu',
}

export default function Page(){
  return <RegisterPage/>
}