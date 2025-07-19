'use client'

import { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function ProfilPage() {
    const [nama, setNama] = useState('John Doe')
    const [email, setEmail] = useState('johndoe@email.com')

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ nama, email, oldPassword, newPassword, confirmPassword })
    }

    return (
        <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
            <div className='max-w-[1280px] mx-auto md:mx-0'>
                <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">Lorem Ipsum</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Filter berdasarkan waktu, akun, jenis & pencarian
                            </p>
                        </div>
                    </div>
                    <div>
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-4"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">Informasi Pribadi</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Lorem ipsum dolor sit amet.
                                </p>
                            </div>

                            {/* Nama */}
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium mb-1">Nama</label>
                                <input
                                    type="text"
                                    id="nama"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                            </div>

                            <hr className="my-4 border-gray-300 dark:border-gray-600" />
                            <h2 className="text-lg font-semibold">Ubah Password</h2>

                            {/* Password Lama */}
                            <div>
                                <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">Password Lama</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="oldPassword"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                    />
                                    <div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Password Baru */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">Password Baru</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                    />
                                    <div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Konfirmasi Password Baru */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                    />
                                    <div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Simpan */}
                            <button
                                type="submit"
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition self-end"
                            >
                                Simpan Perubahan
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    )
}
