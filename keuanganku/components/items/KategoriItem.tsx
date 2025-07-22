import { KategoriResponse } from '@/types/kategori'

interface KategoriItemProps {
    kategori: KategoriResponse
    onPilihKategori: (kategori: KategoriResponse) => void
}

export default function KategoriItem({ kategori, onPilihKategori }: KategoriItemProps) {
    const isPemasukan = kategori.jenis === 2
    const warnaJenis = isPemasukan ? 'text-green-500' : 'text-red-500'
    const labelJenis = isPemasukan ? 'Pemasukan' : 'Pengeluaran'

    return (
        <li
            onClick={() => onPilihKategori(kategori)}
            className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 
      transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 mb-3 cursor-pointer "
        >
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{kategori.nama}</p>
                    <p className={`text-xs font-medium ${warnaJenis}`}>{labelJenis}</p>
                </div>
            </div>
        </li>
    )
}
