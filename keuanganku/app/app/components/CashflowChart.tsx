'use client';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import { FaChartLine } from 'react-icons/fa';
import { StatistikCashflow } from '@/types/response/statistik';

interface CashflowChartSectionProps {
    periode: 1 | 2 | 3;
    setPeriode: (periode: 1 | 2 | 3) => void;
    data: StatistikCashflow[];
}

export default function CashflowChartSection({
    periode,
    setPeriode,
    data
}: CashflowChartSectionProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-white flex items-center gap-2">
                <FaChartLine className="text-indigo-600" />
                Grafik Cashflow
            </h2>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <div className="w-full sm:w-auto">
                        <label className="text-xs font-medium block mb-1 text-gray-700 dark:text-white">
                            Periode
                        </label>
                        <select
                            value={periode}
                            onChange={(e) => setPeriode(Number(e.target.value) as 1 | 2 | 3)}
                            className="w-full sm:w-40 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={1}>Minggu Ini</option>
                            <option value={2}>Bulan Ini</option>
                            <option value={3}>Tahun Ini</option>
                        </select>
                    </div>
                </div>

                <div className="w-full h-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="tanggal"
                                stroke="#ccc"
                                tick={{ fontSize: 12, fill: '#8884d8' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => {
                                    console.log(value);
                                    if (periode === 1) {
                                        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                                        const dayIndex = parseInt(value) - 1;
                                        return days[dayIndex] || value;
                                        return value
                                    } else if (periode === 2) {
                                        return value;
                                    } else if (periode === 3) {
                                        // Periode tahun: tampilkan bulan
                                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                                        const monthIndex = parseInt(value) - 1;
                                        return months[monthIndex] || value;
                                    }
                                    return value;
                                }}
                            />
                            <YAxis
                                tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`}
                                tick={{ fontSize: 12, fill: '#999' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #eee',
                                    borderRadius: 8,
                                    fontSize: 13,
                                }}
                                formatter={(val: number, name: string) => [
                                    `Rp ${val.toLocaleString('id-ID')}`,
                                    name === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
                                ]}
                            />
                            <Line
                                type="monotone"
                                dataKey="pemasukan"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="pengeluaran"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}