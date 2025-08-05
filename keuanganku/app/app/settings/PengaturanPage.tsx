'use client'

import { getInfo, updateAkun } from '@/actions/auth'
import { handler_GetPengguna_me } from '@/actions/v2/handlers/pengguna'
import DialogKonfirmasiPassword from '@/components/dialog/DialogKonfirmasiPassword'
import LoadingP from '@/components/LoadingP'
import ErrorPage from '@/components/pages/ErrorPage'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function ProfilPage() {
    const [nama, setNama] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [confirmType, setConfirmType] = useState<'save' | 'delete' | null>(null)

    const openConfirmDialog = (type: 'save' | 'delete') => {
        setConfirmType(type)
    }

    const closeConfirmDialog = () => {
        setConfirmType(null)
    }

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        await new Promise((res) => setTimeout(res, 500));
        await handler_GetPengguna_me(
            {
                setLoading,
                whenSuccess: (data) => {
                    setNama(data.nama);
                    setEmail(data.email)
                    setError(null)
                },
                whenFailed: setError
            }
        )
    }

    const handleSaveConfirmed = async (passwordLama: string) => {
        try {
            const data = {
                nama,
                email,
                passwordKonfirmasi: passwordLama,
                passwordBaru: newPassword ? newPassword : ""
            };

            const res = await updateAkun(data);
            if (!res.success) throw new Error(res.message || 'Gagal memperbarui akun');

            toast.success('Akun berhasil diperbarui');
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan saat menyimpan perubahan');
            console.log(err.message);

        } finally {
            closeConfirmDialog();
        }
    };

    const handleDeleteConfirmed = (passwordLama: string) => {
        console.log('🗑️ Hapus akun dengan password:', passwordLama)
        closeConfirmDialog()
    }

    if (loading) {
        return <LoadingP />
    }
    if (error) {
        return <ErrorPage message={error} />
    }

    return (
        <main className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 md:p-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            openConfirmDialog('save')
                        }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-4"
                    >
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

                        {/* Tombol Aksi */}
                        <div className="flex flex-col md:flex-row justify-end gap-2 mt-4">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition"
                            >
                                Simpan Perubahan
                            </button>
                            <button
                                type="button"
                                onClick={() => openConfirmDialog('delete')}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition"
                            >
                                Hapus Akun
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Modal Konfirmasi */}
            {confirmType && (
                <DialogKonfirmasiPassword
                    isOpen={!!confirmType}
                    type={confirmType}
                    isLoading={false}
                    onClose={closeConfirmDialog}
                    onSubmit={(passwordLama) => {
                        confirmType === 'save'
                            ? handleSaveConfirmed(passwordLama)
                            : handleDeleteConfirmed(passwordLama)
                    }}
                />
            )}
        </main>
    )
}
