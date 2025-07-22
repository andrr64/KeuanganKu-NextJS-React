import { Metadata } from 'next'
import LoginPage from './LoginPage'

export const metadata: Metadata = {
  title: 'Login | KeuanganKu',
  description: 'Halaman login untuk masuk ke KeuanganKu',
}

export default function Page() {
  return <LoginPage />
}
