import { FaPlus, FaUpload, FaDownload } from 'react-icons/fa'

interface GoalHeaderProps {
  onTambahGoal: () => void
  onImport: () => void
  onExport: () => void
}

export default function GoalHeader({
  onTambahGoal,
  onImport,
  onExport,
}: GoalHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-col sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Goal</h1>

        <div className="flex flex-wrap gap-3">
          {/* Tambah Goal */}
          <button
            onClick={onTambahGoal}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Goal
          </button>

          {/* Import */}
          <button
            onClick={onImport}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaDownload className="w-4 h-4" />
            Import
          </button>

          {/* Export */}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaUpload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </header>
  )
}
