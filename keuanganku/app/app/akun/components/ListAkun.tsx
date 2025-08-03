import { AkunResponse } from "@/types/akun";
import { AkunModel } from "@/types/model/akun";
import { FaEdit, FaTrash, FaWallet } from "react-icons/fa";

type Props = {
    listAkun: AkunResponse[];
    onEdit: (akun: AkunModel) => void;
    onHapus: (akun: AkunModel) => void;
};

export default function ListAkunSection({ listAkun, onEdit, onHapus }: Props) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listAkun.map((akun, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                        <FaWallet className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{akun.nama}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Saldo: <span className="font-medium">Rp {akun.saldo.toLocaleString('id-ID')}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* <button
                            title="Lihat"
                            className="w-8 h-8 flex items-center justify-center rounded-full 
              bg-blue-100 hover:bg-blue-200 text-blue-700 
              dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 transition"
                        >
                            <FaEye className="w-4 h-4" />
                        </button> */}
                        <button
                            onClick={() => onEdit(akun)}
                            title="Edit"
                            className="w-8 h-8 flex items-center justify-center rounded-full 
              bg-yellow-100 hover:bg-yellow-200 text-yellow-700 
              dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-white transition"
                        >
                            <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                            title="Hapus"
                            className="w-8 h-8 flex items-center justify-center rounded-full 
              bg-rose-100 hover:bg-rose-200 text-rose-700 
              dark:bg-rose-900 dark:hover:bg-rose-800 dark:text-rose-300 transition"
                            onClick={() => onHapus(akun)}
                        >
                            <FaTrash className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            ))}
        </section>
    )
}