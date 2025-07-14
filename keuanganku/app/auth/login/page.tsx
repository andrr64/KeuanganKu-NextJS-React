'use client';

import { login } from '@/actions/auth';
import Loading from '@/components/Loading';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { ROUTES } from '@/lib/routes';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success(res.message || 'Login berhasil');
      router.push(ROUTES.HOME);
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6">
      {loading && <Loading />}
      <ThemeToggleButton />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center sm:text-left">
          Login
        </h1>
        <p className="text-sm mb-6 text-center sm:text-left">Hai, Selamat datang kembali 👋</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-sm bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 cursor-pointer`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className="flex justify-end mb-6 text-sm">
            <a href="#" className="text-indigo-500 hover:underline">
              Lupa kata sandi?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition disabled:opacity-60"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Belum punya akun?{' '}
          <a href={ROUTES.AUTH.REGISTER} className="text-indigo-500 hover:underline font-medium">
            Daftar sekarang
          </a>
        </p>
      </div>
    </main>
  );
}
