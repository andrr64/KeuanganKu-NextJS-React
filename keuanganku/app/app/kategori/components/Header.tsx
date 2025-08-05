'use client'

import { FaPlus, FaFileImport, FaFileExport } from 'react-icons/fa'

interface HeaderKategoriProps {
  onTambahKategoriClick: () => void
  onImportKategori?: () => void
  onExportKategori?: () => void
}

export default function HEader({
  onTambahKategoriClick,
  onImportKategori = () => console.log('Import Kategori'),
  onExportKategori = () => console.log('Export Kategori'),
}: HeaderKategoriProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-col  sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Kategori</h1>

        <div className="flex flex-wrap gap-3">
          {/* Tambah Kategori */}
          <button
            onClick={onTambahKategoriClick}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Kategori
          </button>

          {/* Import */}
          <button
            onClick={onImportKategori}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaFileImport className="w-4 h-4" />
            Import
          </button>

          {/* Export */}
          <button
            onClick={onExportKategori}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaFileExport className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </header>
  )
}
