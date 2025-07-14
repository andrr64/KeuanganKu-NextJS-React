'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggleButton() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (


        <div className="absolute top-4 right-4">
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
                {theme === 'light' ? '🌙 Gelap' : '☀️ Terang'}
            </button>
        </div>
    )
}
