import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard | KeuanganKu',
  // description: 'The official Next.js Course Dashboard, built with App Router.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
 

export default function KeuanganKuApp() {
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <meta property="og:title" content="Title Here" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Selamat datang di KeuanganKu!
        </h1>
      </div>
    </>
  );
}