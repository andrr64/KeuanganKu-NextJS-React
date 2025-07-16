'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RingkasanUangProps {
    periode: string;
    setPeriode: (value: string) => void;
    pengeluaranList: { label: string; value: number; warna: string }[];
    pemasukanList: { label: string; value: number; warna: string }[];
}

export default function RingkasanUangSection({
    periode,
    setPeriode,
    pengeluaranList,
    pemasukanList,
}: RingkasanUangProps) {
    const totalPengeluaran = pengeluaranList.reduce((sum, i) => sum + i.value, 0);
    const totalPemasukan = pemasukanList.reduce((sum, i) => sum + i.value, 0);
    const dataChart = [...pengeluaranList, ...pemasukanList];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-md font-semibold">Ringkasan Keuangan</h2>
                    <p className="text-sm text-gray-500">
                        Periode: {periode.charAt(0).toUpperCase() + periode.slice(1)}
                    </p>
                </div>
                <select
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600"
                >
                    <option value="mingguan">Mingguan</option>
                    <option value="bulanan">Bulanan</option>
                    <option value="tahunan">Tahunan</option>
                </select>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <div className="w-full md:w-[60%] aspect-square">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataChart}
                                dataKey="value"
                                innerRadius="50%"
                                outerRadius="80%"
                                paddingAngle={2}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {dataChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.warna} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 mt-6 md:mt-0">
                    {/* Pengeluaran */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                            Pengeluaran
                        </h3>
                        <p className="text-lg text-gray-900 dark:text-white mb-3">
                            Rp {totalPengeluaran.toLocaleString('id-ID')}
                        </p>
                        <ul className="space-y-2 text-sm">
                            {pengeluaranList.map((item, idx) => {
                                const persen = ((item.value / totalPengeluaran) * 100).toFixed(1);
                                return (
                                    <li key={idx} className="flex items-center">
                                        <span
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: item.warna }}
                                        ></span>
                                        <span className="flex-1">{item.label}</span>
                                        <span className="text-gray-500">{persen}%</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Pemasukan */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                            Pemasukan
                        </h3>
                        <p className="text-lg text-gray-900 dark:text-white mb-3">
                            Rp {totalPemasukan.toLocaleString('id-ID')}
                        </p>
                        <ul className="space-y-2 text-sm">
                            {pemasukanList.map((item, idx) => {
                                const persen = ((item.value / totalPemasukan) * 100).toFixed(1);
                                return (
                                    <li key={idx} className="flex items-center">
                                        <span
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: item.warna }}
                                        ></span>
                                        <span className="flex-1">{item.label}</span>
                                        <span className="text-gray-500">{persen}%</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
