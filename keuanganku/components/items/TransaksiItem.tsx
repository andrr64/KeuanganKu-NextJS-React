import { TransaksiResponse } from '@/types/transaksi';
import { Trash2 } from 'lucide-react'; // Icon minimalis, opsional: install `lucide-react`

interface TransaksiItemProps {
    transaksi: TransaksiResponse;
    onClickTrx: () => void;
    onDelete: () => void; // Tambahkan handler hapus
}

export default function TransaksiItem({ transaksi, onClickTrx, onDelete }: TransaksiItemProps) {
    const isPemasukan = transaksi.jenisTransaksi === 2;
    const tanggalFormatted = new Date(transaksi.tanggal).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 
            transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 mb-3 flex justify-between items-center gap-4">

            {/* Klik utama */}
            <div className="flex-1 cursor-pointer" onClick={onClickTrx}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{transaksi.namaKategori}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {transaksi.namaAkun} • {tanggalFormatted}
                </p>
                <div className={`mt-1 text-sm font-bold ${isPemasukan ? 'text-green-500' : 'text-red-500'}`}>
                    {isPemasukan ? '+' : '-'} Rp {transaksi.jumlah.toLocaleString('id-ID')}
                </div>
            </div>

            {/* Tombol hapus */}
            <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-150"
                title="Hapus transaksi"
            >
                <Trash2 size={18} />
            </button>
        </li>
    );
}
