'use client'
import { KategoriResponse } from '@/types/kategori'
import { useState, useEffect } from 'react'

type Props = {
    kategori: KategoriResponse | null
    onCancel: () => void
}

export default function PanelDetailKategori({ kategori, onCancel }: Props) {
    const [nama, setNama] = useState('')
    const [jenis, setJenis] = useState<0 | 1 | 2>(0)

    useEffect(() => {
        if (kategori) {
            setNama(kategori.nama)
            setJenis(kategori.jenis)
        }
    }, [kategori])

    if (!kategori) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-md font-semibold mb-2">Detail Kategori</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Klik salah satu kategori untuk melihat detail.
                </p>
            </div>
        )
    }

    const handleSimpan = () => {
        alert(`Simpan perubahan:\nNama: ${nama}\nJenis: ${jenis}`)
    }

    const handleHapus = () => {
        alert(`Hapus kategori ${nama}`)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-md font-semibold mb-4">Detail Kategori</h2>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
                    <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis</label>
                    <select
                        value={jenis}
                        onChange={(e) => setJenis(Number(e.target.value) as 1 | 2)}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                    >
                        <option value={1}>Pengeluaran</option>
                        <option value={2}>Pemasukan</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-4 flex-wrap">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleHapus}
                        className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition text-sm"
                    >
                        Hapus
                    </button>

                    <button
                        onClick={handleSimpan}
                        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}
