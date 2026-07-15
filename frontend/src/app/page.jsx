'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Icon({ name }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'user') return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  if (name === 'lock') return <svg {...props}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
  if (name === 'eye-off') return <svg {...props}><path d="M17.94 17.94A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a20.7 20.7 0 0 1 5.06-5.94" /><path d="M9.9 4.24A10.8 10.8 0 0 1 12 4c7 0 11 8 11 8a20.8 20.8 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" /><path d="m1 1 22 22" /></svg>;
  if (name === 'eye') return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>;
  return null;
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const isLogin = mode === 'login';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, [router]);

  const updateForm = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setSuccess('');
    setForm({ username: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { username: form.username, password: form.password } : { username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Terjadi kesalahan');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', form.username);
        router.push('/dashboard');
      } else {
        setSuccess('Akun berhasil dibuat. Silakan masuk.');
        switchMode('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🌶️</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Klasifikasi Cabai Rawit</h1>
        </div>

        {/* Tab */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: mode === m ? '#e11d48' : '#ffffff',
                color: mode === m ? '#ffffff' : '#6b7280',
              }}
            >
              {m === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        {/* Alert */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <Icon name="user" />
              </div>
              <input
                type="text"
                value={form.username}
                onChange={updateForm('username')}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          {/* Email Field (Only for Register) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateForm('email')}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                  placeholder="Masukkan email aktif"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="lock" />
            </span>
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={updateForm('password')}
              placeholder="Password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm text-gray-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              <Icon name={showPass ? 'eye-off' : 'eye'} />
            </button>
          </div>

          {/* Confirm Password (register only) */}
          {!isLogin && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="lock" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={updateForm('confirmPassword')}
                placeholder="Konfirmasi Password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm text-gray-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
              >
                <Icon name={showConfirm ? 'eye-off' : 'eye'} />
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#e11d48' }}
          >
            {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
            className="font-semibold"
            style={{ color: '#e11d48' }}
          >
            {isLogin ? 'Daftar' : 'Masuk'}
          </button>
        </p>

      </div>
    </main>
  );
}
