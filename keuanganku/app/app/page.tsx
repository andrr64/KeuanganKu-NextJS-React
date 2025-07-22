import { Metadata } from "next";
import DashboardPage from "./DashboardPage";

export const metadata: Metadata = {
  title: 'Dashboard | KeuanganKu',
  // description: 'The official Next.js Course Dashboard, built with App Router.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
 

export default function KeuanganKuApp() {
  return <DashboardPage/>
}