'use client'

import { logout } from '@/actions/auth'
import { ROUTES } from '@/lib/routes'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import Loading from '@/components/Loading'
import ConfirmDialog from '@/components/dialog/DialogKonfirmasi'
import { ThemeToggleButton } from '@/components/ThemeToggleButton'
import {
  FaBars,
  FaThLarge,
  FaExchangeAlt,
  FaUserFriends,
  FaCommentAlt,
  FaBoxOpen,
  FaFileAlt,
  FaChartLine,
  FaMagic,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaMoneyBillWave,
} from 'react-icons/fa'
import Link from 'next/link'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const MENU_LIST = [
  {
    label: 'Utama',
    items: [{ name: 'Dashboard', href: '/app', icon: <FaThLarge /> }],
  },
  {
    label: 'Keuangan',
    items: [
      { name: 'Akun', href: '/app/akun', icon: <FaBoxOpen /> },
      { name: 'Kategori', href: '/app/kategori', icon: <FaFileAlt /> },
      { name: 'Transaksi', href: '/app/transaksi', icon: <FaMoneyBillWave /> },
      { name: 'Transfer', href: '/app/transfer', icon: <FaExchangeAlt /> },
      { name: 'Goal', href: '/app/goal', icon: <FaChartLine /> },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { name: 'Profil', href: '/app/settings', icon: <FaCog /> },
      { name: 'Keamanan', href: '/app/security', icon: <FaShieldAlt /> },
      {
        name: 'Logout',
        icon: <FaSignOutAlt />,
        isButton: true,
      },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    setConfirmOpen(true)
  }

  const handleConfirmLogout = async () => {
    setConfirmOpen(false)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    await logout()
    router.push(ROUTES.AUTH.LOGIN)
    setLoading(false)
    toast.success('Berhasil logout')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-inter transition-colors duration-300">
      {loading && <Loading />}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* SIDEBAR */}
      <aside
        className={clsx(
          'fixed md:static z-50 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 transform transition-transform duration-300',
          {
            'translate-x-0': sidebarOpen,
            '-translate-x-full': !sidebarOpen,
            'md:translate-x-0': true,
          }
        )}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold select-none">KeuanganKu</span>
              <button
                className="md:hidden text-gray-600 dark:text-gray-300"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* MENU */}
            {MENU_LIST.map((section) => (
              <nav
                key={section.label}
                className="px-6 pt-6 border-t border-gray-200 dark:border-gray-700 first:border-t-0"
              >
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2 select-none">
                  {section.label}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item, index) => (
                    <li key={index}>
                      {item.isButton ? (
                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="text-sm">
                            {loading ? 'Logging out...' : item.name}
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={item.href!}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${isActive(item.href!)
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          onClick={() => setSidebarOpen(false)} // close on mobile
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 dark:text-white"
          >
            <FaBars size={20} />
          </button>
          <ThemeToggleButton />
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="hidden md:flex justify-end mb-2">
            <ThemeToggleButton />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
