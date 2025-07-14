'use client';

import { register } from '@/actions/auth';
import Loading from '@/components/Loading';
import { ROUTES } from '@/lib/routes';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { theme, setTheme } = useTheme();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== konfirmasiPassword) {
      toast.error('Password dan konfirmasi tidak cocok');
      return;
    }

    try {
      setLoading(true);

      const res = await register(nama, email, password); // ← panggil backend
      toast.success(res.message || 'Pendaftaran berhasil');
      router.push(ROUTES.AUTH.LOGIN);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6">
      {loading && <Loading />}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          {theme === 'light' ? '🌙 Gelap' : '☀️ Terang'}
        </button>
      </div>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Daftar Akun</h1>
        <p className="text-sm mb-6">Silakan isi data untuk mendaftar 📝</p>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm mb-1">Nama</label>
            <input
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email aktif"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 10 karakter"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 cursor-pointer`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirm" className="block text-sm mb-1">Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirm"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Ulangi password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <i
                className={`fas ${showConfirm ? 'fa-eye' : 'fa-eye-slash'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 cursor-pointer`}
                onClick={() => setShowConfirm(!showConfirm)}
              ></i>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Sudah punya akun?{' '}
          <a href={ROUTES.AUTH.LOGIN} className="text-indigo-500 hover:underline font-medium">
            Masuk di sini
          </a>
        </p>
      </div>
    </main>
  );
}
