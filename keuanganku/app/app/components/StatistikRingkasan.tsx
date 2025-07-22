import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaExchangeAlt,
} from "react-icons/fa";

interface Props {
    totalSaldo: number;
    totalPemasukan: number;
    totalPengeluaran: number;
    netCashflow: number;
}

export default function StatistikRingkasSection({
    totalSaldo,
    totalPemasukan,
    totalPengeluaran,
    netCashflow,
}: Props) {
    const cards = [
        {
            label: "Total Saldo",
            value: totalSaldo,
            icon: <FaWallet className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />,
            bg: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Pemasukan Bulan Ini",
            value: totalPemasukan,
            icon: <FaArrowDown className="w-5 h-5 text-green-500 dark:text-green-300" />,
            bg: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Pengeluaran Bulan Ini",
            value: totalPengeluaran,
            icon: <FaArrowUp className="w-5 h-5 text-rose-500 dark:text-rose-300" />,
            bg: "bg-gray-100 dark:bg-gray-700",
        },
        {
            label: "Cashflow Bulan Ini",
            value: netCashflow,
            icon: (
                <FaExchangeAlt
                    className={`w-5 h-5 ${netCashflow >= 0
                            ? "text-green-500 dark:text-green-300"
                            : "text-rose-500 dark:text-rose-300"
                        }`}
                />
            ),
            bg: "bg-gray-100 dark:bg-gray-700",
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all"
                >
                    <div className={`p-3 rounded-xl ${card.bg}`}>
                        {card.icon}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                            {card.label}
                        </h3>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Rp {card.value.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}
