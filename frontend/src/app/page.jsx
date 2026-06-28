'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthRabbitTrack from '../components/auth/AuthRabbitTrack';
import LoadingScreen from '../components/auth/LoadingScreen';

const CHILI_ITEMS = [
  { name: 'Cabai Setan', emoji: '🌶️', bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
  { name: 'Cabai Celeng', emoji: '🫑', bg: '#ecfdf5', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  { name: 'Cabai Putih', emoji: '🌕', bg: '#fefce8', text: '#a16207', border: '#fef08a', dot: '#eab308' },
  { name: 'Cabai Merah Keriting', emoji: '🔥', bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', dot: '#f97316' },
];

const STATS = [
  { value: 320, prefix: '±', label: 'Gambar Dataset' },
  { value: 4, prefix: '', label: 'Kelas Cabai' },
  { value: null, display: 'CNN', label: 'Arsitektur' },
];

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 95}%`,
  delay: `${i * 1.8}s`,
  duration: `${14 + (i % 5) * 2}s`,
  size: 8 + (i % 4) * 3,
}));

const TITLE_WORDS = ['Sistem', 'Klasifikasi', 'Cabai', 'Rawit', 'Indonesia'];

function ChiliLogo({ className = '' }) {
  return (
    <div className={`relative grid place-items-center ${className}`} aria-hidden="true">
      <span
        className="absolute inset-0 rounded-[14px] shadow-lg float-icon"
        style={{ background: 'linear-gradient(135deg, #fb7185, #f43f5e, #ea580c)', boxShadow: '0 12px 32px rgba(244,63,94,0.35)' }}
      />
      <svg className="relative h-[55%] w-[55%] text-white" viewBox="0 0 24 24" fill="none">
        <path d="M7.8 16.7c-2.2.7-4.1.3-4.7-.8-.8-1.5 1-4.1 4.3-6.1 3.3-2.1 6.8-2.8 8.1-1.5 1.2 1.2.3 3.8-2.2 5.9-1.4 1.2-3.4 2-5.5 2.5Z" fill="currentColor" />
        <path d="M14.6 8.1c1-2.6 2.9-4 5.2-3.8M16.3 6.2c.9-.7 2-.9 3.3-.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Icon({ name, className = '' }) {
  const props = { className, width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'user') return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  if (name === 'mail') return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
  if (name === 'lock') return <svg {...props}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
  if (name === 'eye-off') return <svg {...props}><path d="M17.94 17.94A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a20.7 20.7 0 0 1 5.06-5.94" /><path d="M9.9 4.24A10.8 10.8 0 0 1 12 4c7 0 11 8 11 8a20.8 20.8 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" /><path d="m1 1 22 22" /></svg>;
  if (name === 'eye') return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (name === 'check') return <svg {...props}><path d="M20 6 9 17l-5-5" /></svg>;
  return <svg {...props}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
}

function FloatingField({
  id, label, type = 'text', icon, value, placeholder, onChange, trailing, autoComplete, onFocus, onBlur, onInput, hasError,
}) {
  return (
    <div className={`auth-field relative auth-input-glow rounded-xl transition-all duration-300 ${hasError ? 'auth-shake' : ''}`}>
      <Icon name={icon} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors peer-focus:text-rose-500" style={{ color: '#fda4af' }} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={onInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="peer w-full rounded-xl border-2 px-11 pb-2.5 pt-5 text-sm font-semibold outline-none transition-all duration-300 placeholder:text-transparent focus:border-rose-400"
        style={{
          borderColor: hasError ? '#f87171' : '#fecdd3',
          backgroundColor: 'rgba(255,255,255,0.92)',
          color: '#881337',
        }}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-11 top-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all peer-placeholder-shown:top-[0.85rem] peer-placeholder-shown:text-xs peer-placeholder-shown:font-semibold peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:tracking-[0.18em]"
        style={{ color: hasError ? '#dc2626' : '#fda4af' }}
      >
        {label}
      </label>
      {trailing}
    </div>
  );
}

function MascotRabbit() {
  return (
    <svg width="72" height="72" viewBox="0 0 120 120" fill="none" className="opacity-75 float-icon shrink-0" aria-hidden="true" style={{ animationDuration: '5s' }}>
      <ellipse cx="42" cy="28" rx="10" ry="22" fill="#fb7185" />
      <ellipse cx="78" cy="28" rx="10" ry="22" fill="#fb7185" />
      <ellipse cx="42" cy="28" rx="5" ry="14" fill="#fff1f2" />
      <ellipse cx="78" cy="28" rx="5" ry="14" fill="#fff1f2" />
      <ellipse cx="60" cy="78" rx="32" ry="28" fill="#f43f5e" />
      <circle cx="60" cy="52" r="26" fill="#fb7185" />
      <circle cx="50" cy="48" r="4" fill="#4c0519" />
      <circle cx="70" cy="48" r="4" fill="#4c0519" />
      <circle cx="52" cy="46" r="1.5" fill="white" />
      <circle cx="72" cy="46" r="1.5" fill="white" />
      <ellipse cx="54" cy="56" rx="4" ry="3" fill="#fda4af" opacity="0.6" />
      <ellipse cx="66" cy="56" rx="4" ry="3" fill="#fda4af" opacity="0.6" />
      <ellipse cx="60" cy="60" rx="3" ry="2" fill="#e11d48" />
      <circle cx="92" cy="82" r="10" fill="#ffe4e6" />
    </svg>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', remember: true, terms: false });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [flipKey, setFlipKey] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [statDisplay, setStatDisplay] = useState([0, 0]);

  const router = useRouter();
  const pageRef = useRef(null);
  const leftPanelRef = useRef(null);
  const formCardRef = useRef(null);
  const submitRef = useRef(null);
  const typingTimeout = useRef(null);

  const isLogin = mode === 'login';

  const passwordScore = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const rabbitSpeed = useMemo(() => {
    if (loading) return 3;
    if (celebrate) return 4;
    if (error) return 0.4;
    if (btnHovered) return 0.55;
    if (isTyping) return 1.75;
    if (inputFocused) return 0.65;
    if (logoClicks >= 5) return 2.5;
    return 1;
  }, [loading, celebrate, error, btnHovered, isTyping, inputFocused, logoClicks]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) { router.push('/dashboard'); return; }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    media.addEventListener('change', () => setReducedMotion(media.matches));

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [router]);

  useEffect(() => {
    let cleanup = () => {};
    import('gsap').then(({ gsap }) => {
      if (!pageRef.current) return;

      const ctx = gsap.context(() => {
        gsap.set('.brand-stagger, .badge-stagger, .stat-stagger, .auth-stagger', { opacity: 0, y: 20 });
        const titleChars = gsap.utils.toArray('.hero-char');
        gsap.set(titleChars, { opacity: 0, y: 30 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
          .to('.brand-stagger', { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, 0)
          .to(titleChars, { opacity: 1, y: 0, stagger: 0.025, duration: 0.4 }, 0.2)
          .to('.brand-desc', { opacity: 1, y: 0, duration: 0.45 }, 0.6)
          .to('.badge-stagger', { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: 'back.out(1.4)' }, 0.8)
          .to('.stat-stagger', { opacity: 1, y: 0, stagger: 0.12, duration: 0.45 }, 1.2)
          .to('.brand-footer', { opacity: 1, duration: 0.4 }, 1.8)
          .fromTo(formCardRef.current, { x: 60, opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, 0.3)
          .to('.auth-stagger', { opacity: 1, y: 0, stagger: 0.07, duration: 0.4 }, 0.5)
          .to('.auth-divider-line', { scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.6);

        if (!reducedMotion) {
          gsap.to('.bg-orb-auth', { x: 25, y: -20, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3 });
        }

        gsap.to({ v1: 0, v2: 0 }, {
          v1: 320,
          v2: 4,
          duration: 1.5,
          delay: 1.3,
          ease: 'power2.out',
          onUpdate: function () {
            setStatDisplay([Math.round(this.targets()[0].v1), Math.round(this.targets()[0].v2)]);
          },
        });
      }, pageRef);

      const parallax = (e) => {
        if (reducedMotion || !leftPanelRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(leftPanelRef.current, { x: x * 8, y: y * 5, duration: 0.8, ease: 'power2.out' });
        gsap.to(formCardRef.current, { rotateY: x * -1.5, rotateX: y * 1.2, duration: 0.8, ease: 'power2.out' });
      };

      window.addEventListener('mousemove', parallax);
      cleanup = () => { window.removeEventListener('mousemove', parallax); ctx.revert(); };
    });
    return () => cleanup();
  }, [reducedMotion]);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      gsap.fromTo('.auth-stagger', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo('.form-heading-char', { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.35, delay: 0.1 });
    });
    setFlipKey((k) => k + 1);
  }, [mode]);

  const handleInputActivity = useCallback(() => {
    setIsTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 800);
  }, []);

  const updateForm = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((c) => ({ ...c, [key]: value }));
    handleInputActivity();
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setSuccess('');
  };

  const handleLogoClick = () => {
    setLogoClicks((c) => c + 1);
    if (logoClicks + 1 >= 5) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setCelebrate(false);

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Konfirmasi password belum sama.');
      return;
    }
    if (!isLogin && !form.terms) {
      setError('Setujui ketentuan penggunaan terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Terjadi kesalahan');

      if (isLogin) {
        setCelebrate(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', form.username);
        // Fade out the login page then show the loading screen
        import('gsap').then(({ gsap }) => {
          if (pageRef.current) {
            gsap.to(pageRef.current, {
              opacity: 0,
              scale: 0.98,
              duration: 0.45,
              ease: 'power2.inOut',
              onComplete: () => setShowLoadingScreen(true),
            });
          } else {
            setShowLoadingScreen(true);
          }
        });
      } else {
        setSuccess('Akun berhasil dibuat. Silakan masuk.');
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2000);
        setMode('login');
        setForm((c) => ({ ...c, password: '', confirmPassword: '', terms: false }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const magnetBtn = (e) => {
    if (reducedMotion || !submitRef.current || loading) return;
    const rect = submitRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    import('gsap').then(({ gsap }) => {
      gsap.to(submitRef.current, { x: x * 0.08, y: y * 0.08, scale: 1.02, duration: 0.25 });
    });
  };

  const resetBtn = () => {
    import('gsap').then(({ gsap }) => {
      if (submitRef.current) gsap.to(submitRef.current, { x: 0, y: 0, scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
    });
  };

  const formHeading = isLogin ? 'Selamat datang kembali' : 'Buat akun baru';

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen onComplete={() => router.push('/dashboard')} />
      )}
    <main
      ref={pageRef}
      className="relative h-[100dvh] max-h-[100dvh] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 40%, #fdf2f8 100%)' }}
    >
      {/* Petals */}
      {!reducedMotion && PETALS.map((p) => (
        <span
          key={p.id}
          className="petal absolute rounded-full opacity-60"
          style={{
            left: p.left,
            top: '-5%',
            width: p.size,
            height: p.size,
            backgroundColor: '#fda4af',
            animationDelay: p.delay,
            animationDuration: p.duration,
            zIndex: 1,
          }}
        />
      ))}

      <div className="relative z-10 grid h-full grid-cols-1 overflow-hidden lg:grid-cols-2">
        {/* LEFT — Branding */}
        <section
          ref={leftPanelRef}
          className="relative hidden h-full flex-col overflow-hidden px-5 py-4 md:px-8 lg:flex lg:px-10 lg:py-5"
          style={{ background: 'linear-gradient(160deg, #ffe4e6 0%, #fff1f2 35%, #fdf2f8 70%, #fffafa 100%)' }}
        >
          <div className="bg-orb-auth pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-50 blur-[100px]" style={{ background: '#fecdd3' }} />
          <div className="bg-orb-auth pointer-events-none absolute bottom-10 right-0 h-48 w-48 rounded-full opacity-40 blur-[80px]" style={{ background: '#fbcfe8' }} />

          <button
            type="button"
            onClick={handleLogoClick}
            className="brand-stagger flex w-fit shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 backdrop-blur-xl transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid rgba(254,205,211,0.8)', boxShadow: '0 8px 32px rgba(244,63,94,0.1)' }}
          >
            <ChiliLogo className="h-8 w-8" />
            <div className="text-left">
              <p className="font-display text-base font-bold tracking-tight" style={{ color: '#881337' }}>ChiliDetect</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#fda4af' }}>MobileNetV2 AI</p>
            </div>
          </button>

          <div className="relative flex min-h-0 flex-1 flex-col justify-center gap-3 py-2">
            <div
              className="brand-stagger inline-flex w-fit rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(254,205,211,0.7)', color: '#be123c' }}
            >
              Deep Learning untuk varietas cabai Indonesia
            </div>

            <h1
              aria-label="Sistem Klasifikasi Cabai Rawit Indonesia"
              className="font-display max-w-lg text-[clamp(1.35rem,2.4vw,2.15rem)] font-bold leading-[1.08] tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #881337 0%, #be123c 45%, #9f1239 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {TITLE_WORDS.map((word, wi) => (
                <span key={word} className="mr-[0.18em] inline-block">
                  {word.split('').map((char, ci) => (
                    <span key={`${wi}-${ci}`} className="hero-char inline-block">{char}</span>
                  ))}
                  {wi === 2 && <br />}
                </span>
              ))}
            </h1>

            <p className="brand-desc max-w-md text-sm leading-snug opacity-0" style={{ color: '#be123c' }}>
              Identifikasi 4 jenis cabai rawit menggunakan Deep Learning berbasis{' '}
              <span className="font-bold" style={{ color: '#881337' }}>MobileNetV2</span>.
            </p>

            <div className="grid max-w-md grid-cols-2 gap-1.5">
              {CHILI_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="badge-stagger flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold opacity-0 transition-transform hover:scale-105"
                  style={{ backgroundColor: item.bg, color: item.text, border: `1px solid ${item.border}` }}
                >
                  <span className="text-xs">{item.emoji}</span>
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="stat-stagger min-w-[96px] rounded-xl px-3 py-2 opacity-0 backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(255,241,242,0.7)', border: '1px solid rgba(254,205,211,0.6)' }}
                >
                  <p className="font-mono text-xl font-bold" style={{ color: '#881337' }}>
                    {stat.display ?? `${stat.prefix}${i === 0 ? statDisplay[0] : statDisplay[1]}`}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#fda4af' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex shrink-0 items-center justify-between pt-1">
            <p className="brand-footer text-[11px] font-medium opacity-0" style={{ color: '#fda4af' }}>
              Politeknik Negeri Padang · 2026
            </p>
            <MascotRabbit />
          </div>

          <div className="auth-grass pointer-events-none absolute bottom-0 left-0 right-0 h-10 opacity-50" />
        </section>

        {/* RIGHT — Form */}
        <section
          className="relative flex h-full items-center justify-center overflow-hidden px-4 py-3 sm:px-6 lg:px-8 lg:py-4"
          style={{ background: 'linear-gradient(225deg, #ffffff 0%, #fff1f2 50%, #fdf2f8 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          <div className="bg-orb-auth absolute top-10 right-10 w-48 h-48 rounded-full blur-[70px] opacity-30 pointer-events-none" style={{ background: '#fecdd3' }} />

          <AuthRabbitTrack
            trackId="auth-rabbit-track"
            speedMultiplier={rabbitSpeed}
            wobble={!!error}
            celebrate={celebrate}
            flipKey={flipKey}
            className="w-full max-w-[420px]"
          >
            <div
              ref={formCardRef}
              className={`relative w-full rounded-[1.75rem] backdrop-blur-xl ${isLogin ? 'p-5 sm:p-6' : 'max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-5 sm:p-6'}`}
              style={{
                backgroundColor: 'rgba(255,255,255,0.82)',
                border: '2px solid rgba(254,205,211,0.65)',
                boxShadow: '0 20px 50px rgba(244,63,94,0.12)',
                zIndex: 10,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Tab switcher */}
              <div className="auth-stagger relative mb-4 grid grid-cols-2 rounded-xl p-1" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
                <span
                  className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg transition-transform duration-500 ease-out"
                  style={{
                    background: 'linear-gradient(135deg, #fb7185, #f43f5e)',
                    boxShadow: '0 6px 20px rgba(244,63,94,0.25)',
                    transform: isLogin ? 'translateX(4px)' : 'translateX(calc(100% + 0px))',
                  }}
                />
                {['login', 'register'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`relative z-10 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors duration-300 ${mode === m ? 'text-white' : ''}`}
                    style={{ color: mode === m ? '#fff' : '#fda4af' }}
                  >
                    {m === 'login' ? 'Masuk' : 'Daftar'}
                  </button>
                ))}
              </div>

              <div className="auth-stagger mb-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#f43f5e' }}>
                  {isLogin ? 'Akses dashboard' : 'Mulai klasifikasi'}
                </p>
                <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl" style={{ color: '#881337' }}>
                  {formHeading.split('').map((char, i) => (
                    <span key={i} className="form-heading-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
                  ))}
                </h2>
                <p className="mt-1.5 text-xs leading-snug sm:text-sm" style={{ color: '#be123c' }}>
                  {isLogin ? 'Masukkan kredensial Anda untuk melanjutkan.' : 'Isi data akun untuk menyimpan riwayat klasifikasi Anda.'}
                </p>
              </div>

              {(error || success) && (
                <div
                  className={`auth-stagger mb-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs font-semibold sm:text-sm ${error ? 'auth-shake' : ''}`}
                  style={{
                    borderColor: error ? '#fecaca' : '#bbf7d0',
                    backgroundColor: error ? '#fef2f2' : '#ecfdf5',
                    color: error ? '#dc2626' : '#15803d',
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <Icon name={error ? 'arrow' : 'check'} className="mt-0.5 shrink-0" />
                  <span>{error || success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <div className="auth-stagger">
                    <FloatingField
                      id="email"
                      label="Email"
                      icon="mail"
                      type="email"
                      placeholder="Masukkan email"
                      value={form.email}
                      onChange={updateForm('email')}
                      autoComplete="email"
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      hasError={!!error && !isLogin}
                    />
                  </div>
                )}

                <div className="auth-stagger">
                  <FloatingField
                    id="username"
                    label="Username"
                    icon="user"
                    placeholder="Masukkan username"
                    value={form.username}
                    onChange={updateForm('username')}
                    autoComplete="username"
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    hasError={!!error}
                  />
                </div>

                <div className="auth-stagger">
                  <FloatingField
                    id="password"
                    label="Password"
                    icon="lock"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={updateForm('password')}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    hasError={!!error}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition hover:scale-110"
                        style={{ color: '#fda4af' }}
                        aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        <Icon name={showPass ? 'eye-off' : 'eye'} />
                      </button>
                    }
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="auth-stagger grid grid-cols-4 gap-2" aria-label="Kekuatan password">
                      {[0, 1, 2, 3].map((step) => (
                        <span
                          key={step}
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            background: step < passwordScore
                              ? 'linear-gradient(90deg, #fb7185, #f43f5e)'
                              : '#fecdd3',
                          }}
                        />
                      ))}
                    </div>
                    <div className="auth-stagger">
                      <FloatingField
                        id="confirmPassword"
                        label="Konfirmasi"
                        icon="lock"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Ulangi password"
                        value={form.confirmPassword}
                        onChange={updateForm('confirmPassword')}
                        autoComplete="new-password"
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        hasError={!!error}
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition hover:scale-110"
                            style={{ color: '#fda4af' }}
                            aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                          >
                            <Icon name={showConfirm ? 'eye-off' : 'eye'} />
                          </button>
                        }
                      />
                    </div>
                  </>
                )}

                <div className="auth-stagger flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <label className="flex cursor-pointer items-center gap-2 font-semibold" style={{ color: '#be123c' }}>
                    <input
                      type="checkbox"
                      checked={isLogin ? form.remember : form.terms}
                      onChange={updateForm(isLogin ? 'remember' : 'terms')}
                      className="h-4 w-4 rounded border-rose-300 text-rose-500 focus:ring-rose-400"
                    />
                    <span>{isLogin ? 'Ingat saya' : 'Saya setuju ketentuan'}</span>
                  </label>
                  {isLogin && (
                    <button type="button" className="link-draw font-bold transition-colors hover:text-rose-600" style={{ color: '#881337' }}>
                      Lupa password?
                    </button>
                  )}
                </div>

                <button
                  ref={submitRef}
                  type="submit"
                  disabled={loading}
                  onMouseMove={magnetBtn}
                  onMouseEnter={() => setBtnHovered(true)}
                  onMouseLeave={() => { setBtnHovered(false); resetBtn(); }}
                  className="auth-stagger group relative mt-1 h-12 w-full overflow-hidden rounded-xl font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:text-sm"
                  style={{
                    background: loading ? '#fda4af' : 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)',
                    boxShadow: btnHovered && !loading ? '0 16px 40px rgba(244,63,94,0.45)' : '0 10px 28px rgba(244,63,94,0.3)',
                  }}
                >
                  <span className="absolute inset-0 translate-x-[-50%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] transition duration-700 group-hover:translate-x-[50%]" />
                  <span className="relative flex items-center justify-center gap-2 text-base">
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Masuk ke Dashboard' : 'Daftar Sekarang'}
                        <Icon name="arrow" className="transition duration-300 group-hover:translate-x-2" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="auth-stagger my-3 flex items-center gap-3">
                <span className="auth-divider-line h-px flex-1 origin-center scale-x-0" style={{ backgroundColor: '#fecdd3' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#fda4af' }}>atau</span>
                <span className="auth-divider-line h-px flex-1 origin-center scale-x-0" style={{ backgroundColor: '#fecdd3' }} />
              </div>

              <p className="auth-stagger text-center text-xs font-medium sm:text-sm" style={{ color: '#be123c' }}>
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(isLogin ? 'register' : 'login')}
                  className="link-draw font-bold transition-colors hover:text-rose-600"
                  style={{ color: '#881337' }}
                >
                  {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
                </button>
              </p>

              <p className="auth-stagger mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] lg:hidden" style={{ color: '#fecdd3' }}>
                Politeknik Negeri Padang · 2026
              </p>
            </div>
          </AuthRabbitTrack>
        </section>
      </div>
    </main>
    </>
  );
}
