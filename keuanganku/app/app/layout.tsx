'use client';

import { logout } from '@/actions/auth'
import { ROUTES } from '@/lib/routes'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import {
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
} from 'react-icons/fa'
import Link from 'next/link'
import ConfirmDialog from '@/components/dialog/ConfirmDialog';

const MENU_LIST: {
    label: string
    items: {
        name: string
        href?: string
        icon: React.ReactNode
        isButton?: boolean
        badge?: React.ReactNode
    }[]
}[] = [
        {
            label: 'General',
            items: [
                { name: 'Dashboard', href: '/app', icon: <FaThLarge /> },
                { name: 'Payment', href: '/app/payment', icon: <FaExchangeAlt /> },
                { name: 'Customers', href: '/app/customers', icon: <FaUserFriends /> },
                {
                    name: 'Message',
                    href: '/app/messages',
                    icon: <FaCommentAlt />,
                    badge: (
                        <span className="ml-auto text-xs font-semibold bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full w-5 h-5 flex items-center justify-center">
                            8
                        </span>
                    ),
                },
            ],
        },
        {
            label: 'Tools',
            items: [
                { name: 'Product', href: '/app/product', icon: <FaBoxOpen /> },
                { name: 'Invoice', href: '/app/invoice', icon: <FaFileAlt /> },
                { name: 'Analytics', href: '/app/analytics', icon: <FaChartLine /> },
                {
                    name: 'Automation',
                    href: '/app/automation',
                    icon: <FaMagic />,
                    badge: (
                        <span className="ml-auto text-xs font-semibold bg-purple-200 text-purple-700 rounded-full px-2 py-0.5">
                            BETA
                        </span>
                    ),
                },
            ],
        },
        {
            label: 'Akun',
            items: [
                { name: 'Settings', href: '/app/settings', icon: <FaCog /> },
                { name: 'Security', href: '/app/security', icon: <FaShieldAlt /> },
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
    const isActive = (href: string) => pathname === href

    const { theme, setTheme } = useTheme()
    const [loading, setLoading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleLogout = async () => {
        setConfirmOpen(true);
    }

    const handleConfirmLogout = async () => {
        setConfirmOpen(false)
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1000))
        await logout()
        router.push(ROUTES.AUTH.LOGIN)
        setLoading(false)
    }
    
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-inter transition-colors duration-300">
            {loading && <Loading />}
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmLogout}
            />

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between bg-white dark:bg-gray-800">
                <div>
                    {/* HEADER */}
                    <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <img
                            src="https://storage.googleapis.com/a1aa/image/558df6af-86d7-4d76-698c-78a35deca7cb.jpg"
                            className="w-6 h-6"
                            alt="Nexus logo"
                        />
                        <span className="text-purple-700 font-semibold text-lg select-none">Nexus</span>
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
                                            >
                                                <span className="text-base">{item.icon}</span>
                                                <span className="text-sm">{item.name}</span>
                                                {item.badge}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 relative">
                {/* THEME TOGGLE */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                    >
                        {theme === 'light' ? '🌙 Gelap' : '☀️ Terang'}
                    </button>
                </div>

                {children}
            </main>
        </div>
    )
}
