'use client';

import { FaRegListAlt, FaRegClipboard } from 'react-icons/fa';
import { TransaksiResponse } from '@/types/transaksi';
import TransaksiItem from '@/components/items/TransaksiItem';
import LoadingP from '@/components/LoadingP';

interface Props {
    data: TransaksiResponse[];
    loading: boolean;
    onClickTrx: (trx: TransaksiResponse) => void;
    onDelete: (trx: TransaksiResponse) => void;
}

export default function TransaksiTerakhirSection({
    data,
    loading,
    onClickTrx,
    onDelete,
}: Props) {
    return (
        <section className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-white flex items-center gap-2">
                <FaRegListAlt className="text-indigo-600" />
                Transaksi Terakhir
            </h2>
            {data.length === 0 ? (
                <div className="p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaRegClipboard className="text-3xl text-indigo-500" />
                        <p className="text-sm">Belum ada transaksi tercatat.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Tambahkan transaksi untuk melihat catatan keuanganmu di sini!
                        </p>
                    </div>
                </div>
            ) : (<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                {loading ? (
                    <LoadingP />
                ) :
                    <ul className="space-y-3">
                        {data.map((trx) => (
                            <TransaksiItem
                                key={trx.id}
                                transaksi={trx}
                                onClickTrx={() => onClickTrx(trx)}
                                onDelete={() => onDelete(trx)}
                            />
                        ))}
                    </ul>
                }
            </div>)}

        </section>
    );
}
