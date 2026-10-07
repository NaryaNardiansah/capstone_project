'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/auth/LoadingScreen';

// Partikel lembut melayang di latar belakang terang
const AMBIENT_DOTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 15 + 4) % 94}%`,
  top: `${(i * 17 + 8) % 90}%`,
  delay: `${(i * 0.8).toFixed(1)}s`,
  duration: `${8 + (i % 4) * 3}s`,
  size: 6 + (i % 3) * 4,
  opacity: 0.25 + (i % 3) * 0.15,
  color: i % 2 === 0 ? '#fda4af' : '#fed7aa',
}));

function Icon({ name }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'user') return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  if (name === 'lock') return <svg {...props}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
  if (name === 'mail') return <svg {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
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
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState('');

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
    if (loading) return;
    setMode(next);
    setError('');
    if (next === 'register') {
      setSuccess('');
    }
    setForm((prev) => ({
      username: next === 'login' && registeredUser ? registeredUser : '',
      email: '',
      password: '',
      confirmPassword: '',
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isLogin 
            ? { username: form.username, password: form.password } 
            : { username: form.username, email: form.email, password: form.password }
        ),
      });
      let data = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        await res.text();
        throw new Error('Server backend sedang memuat atau belum aktif pada port 8000. Silakan coba sesaat lagi.');
      }

      if (!res.ok) throw new Error(data.detail || 'Terjadi kesalahan pada sistem autentikasi.');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', form.username);
        
        // Cek apakah pengguna baru pertama kali login atau sudah pernah berkunjung
        const visitedKey = `has_visited_${form.username}`;
        const isReturning = Boolean(localStorage.getItem(visitedKey));
        sessionStorage.setItem('is_new_user_session', isReturning ? 'false' : 'true');
        localStorage.setItem(visitedKey, 'true');

        setShowLoading(true);
      } else {
        const newlyRegistered = form.username;
        setRegisteredUser(newlyRegistered);
        setShowSuccessModal(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToLogin = () => {
    setShowSuccessModal(false);
    setMode('login');
    setError('');
    setSuccess(`Pendaftaran berhasil! Akun "${registeredUser}" siap digunakan. Masukkan password untuk masuk.`);
    setForm({
      username: registeredUser,
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  if (showLoading) {
    return <LoadingScreen onComplete={() => router.push('/dashboard')} />;
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50/60 via-stone-50 to-orange-50/40 flex items-center justify-center p-4 sm:p-6" suppressHydrationWarning>
      
      {/* ─── Ambient Glow Halus di Latar Belakang ─── */}
      <div 
        className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full bg-rose-200/45 blur-3xl animate-pulse" 
        style={{ animationDuration: '6s' }}
      />
      <div 
        className="pointer-events-none absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="pointer-events-none absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-pink-100/50 blur-3xl" 
      />

      {/* ─── Partikel Halus Melayang ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {AMBIENT_DOTS.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.opacity,
              animation: `emberDrift ${p.duration} ease-in-out infinite alternate ${p.delay}`,
            }}
          />
        ))}
      </div>

      {/* ─── Main Auth Card ─── */}
      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="relative cursor-pointer group mb-2"
            style={{ animation: 'sculptureFloat 5s ease-in-out infinite' }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-rose-100 shadow-md flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
              <span className="text-3xl">🌶️</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display text-center">
            Klasifikasi Cabai Rawit
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Sistem Deteksi MobileNetV2
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-rose-100/80 transition-all duration-300 hover:shadow-hover">
          
          {/* Tab Masuk / Daftar */}
          <div className="flex rounded-xl p-1 bg-stone-100 border border-stone-200/60 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-in flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-fade-in flex items-center gap-2">
              <span>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-rose-600 transition-colors">
                  <Icon name="user" />
                </div>
                <input
                  type="text"
                  value={form.username}
                  onChange={updateForm('username')}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {/* Email Field (Hanya Register) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-rose-600 transition-colors">
                    <Icon name="mail" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={updateForm('email')}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                    placeholder="Masukkan email aktif"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-rose-600 transition-colors">
                  <Icon name="lock" />
                </div>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={updateForm('password')}
                  placeholder="Masukkan password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <Icon name={showPass ? 'eye-off' : 'eye'} />
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Hanya Register) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Konfirmasi Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-rose-600 transition-colors">
                    <Icon name="lock" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={updateForm('confirmPassword')}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <Icon name={showConfirm ? 'eye-off' : 'eye'} />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isLogin ? 'Memverifikasi...' : 'Mendaftarkan akun...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Masuk' : 'Daftar Sekarang'}</span>
              )}
            </button>
          </form>


          {/* Switch mode */}
          <p className="mt-5 text-center text-sm text-stone-500">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? 'register' : 'login')}
              className="font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
            >
              {isLogin ? 'Daftar' : 'Masuk'}
            </button>
          </p>

        </div>

      </div>

      {/* Modal Dialog Pop-up Berhasil Daftar */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-success-title"
        >
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-stone-100 text-center animate-slide-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="modal-success-title" className="text-xl font-bold text-stone-900 font-display">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Akun <span className="font-semibold text-stone-900">"{registeredUser}"</span> berhasil didaftarkan. Silakan klik tombol di bawah untuk masuk.
            </p>
            <button
              type="button"
              onClick={handleProceedToLogin}
              className="w-full mt-6 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              Lanjut ke Halaman Masuk
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
