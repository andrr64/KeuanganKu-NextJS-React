'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { FaChartPie } from 'react-icons/fa';

export interface KategoriStatistik {
    namaKategori: string;
    totalPengeluaran: number;
}

interface Props {
    data?: KategoriStatistik[];
}

const DUMMY_DATA: KategoriStatistik[] = [
    { namaKategori: 'Makanan', totalPengeluaran: 1500000 },
    { namaKategori: 'Transportasi', totalPengeluaran: 750000 },
    { namaKategori: 'Hiburan', totalPengeluaran: 500000 },
    { namaKategori: 'Tagihan', totalPengeluaran: 1250000 },
    { namaKategori: 'Belanja', totalPengeluaran: 900000 },
];

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F97316', '#3B82F6'];

export default function KategoriStatistikSection({ data = DUMMY_DATA }: Props) {
    const total = data.reduce((acc, item) => acc + item.totalPengeluaran, 0);

    return (
        <section className="space-y-4">
            {/* Judul Di Luar Card */}
            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <FaChartPie className="text-indigo-600" />
                Kategori Pengeluaran Terbanyak Bulan Ini
            </h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                {data.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Belum ada data pengeluaran bulan ini.
                    </p>
                ) : (
                    <>
                        {/* Chart */}
                        <div className="h-72 mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="totalPengeluaran"
                                        nameKey="namaKategori"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label={({ name }) => name}
                                    >
                                        {data.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) =>
                                            `Rp ${value.toLocaleString('id-ID')}`
                                        }
                                    />
                                    <Legend
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Tabel */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                                    <tr>
                                        <th className="pb-2">Kategori</th>
                                        <th className="pb-2">Jumlah</th>
                                        <th className="pb-2">Persentase</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 dark:text-gray-200">
                                    {data.map((item, index) => {
                                        const persen = total === 0 ? 0 : (item.totalPengeluaran / total) * 100;
                                        return (
                                            <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                                                <td className="py-1">{item.namaKategori}</td>
                                                <td className="py-1">Rp {item.totalPengeluaran.toLocaleString('id-ID')}</td>
                                                <td className="py-1">{persen.toFixed(1)}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
