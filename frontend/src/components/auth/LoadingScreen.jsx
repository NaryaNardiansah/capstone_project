'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Timing constants ─────────────────────────────────────── */
const TOTAL_MS       = 4800;   // progress 0→100%
const CELEBRATE_MS   = 400;    // stay at 100% before exit
const EXIT_ANIM_MS   = 700;    // exit animation duration

/* ─── Loading text messages ────────────────────────────────── */
const LOADING_MSGS = [
  'Memverifikasi kredensial...',
  'Menghubungkan ke model AI...',
  'Memuat dashboard...',
  'Menyiapkan pengalaman terbaik...',
  'Hampir selesai... 🐰',
];

/* ─── Petal definitions (reuse pattern from page.jsx) ─────── */
const PETALS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 3) % 96}%`,
  delay: `${(i * 1.4).toFixed(1)}s`,
  duration: `${12 + (i % 5) * 2}s`,
  size: 7 + (i % 4) * 3,
  opacity: 0.4 + (i % 3) * 0.15,
}));

/* ─── Particle definitions ────────────────────────────────── */
const PARTICLES = [
  { id: 0, left: '12%', top: '18%', dx: '12px', dy: '-14px', dur: '7s', delay: '0s',   emoji: '💗', size: 14 },
  { id: 1, left: '82%', top: '14%', dx: '-8px', dy: '-12px', dur: '9s', delay: '1.2s', emoji: '🌸', size: 13 },
  { id: 2, left: '6%',  top: '68%', dx: '16px', dy: '-8px',  dur: '8s', delay: '0.6s', emoji: '✨', size: 12 },
  { id: 3, left: '90%', top: '72%', dx: '-12px',dy: '-10px', dur: '6s', delay: '2s',   emoji: '💕', size: 13 },
  { id: 4, left: '46%', top: '8%',  dx: '8px',  dy: '-16px', dur: '10s',delay: '1.8s', emoji: '🌷', size: 11 },
  { id: 5, left: '70%', top: '88%', dx: '-10px',dy: '-12px', dur: '7s', delay: '0.3s', emoji: '⭐', size: 12 },
];

/* ─── Rabbit SVG (inline, same art as MascotRabbit) ───────── */
function RabbitSVG({ size = 48, color = '#f43f5e', earColor = '#fb7185', className = '' }) {
  const inner = earColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* ears */}
      <ellipse cx="40" cy="30" rx="10" ry="24" fill={earColor} />
      <ellipse cx="80" cy="30" rx="10" ry="24" fill={earColor} />
      <ellipse cx="40" cy="30" rx="5"  ry="15" fill="#fff1f2" />
      <ellipse cx="80" cy="30" rx="5"  ry="15" fill="#fff1f2" />
      {/* body */}
      <ellipse cx="60" cy="80" rx="32" ry="28" fill={color} />
      {/* head */}
      <circle cx="60" cy="54" r="26" fill={earColor} />
      {/* eyes */}
      <circle cx="50" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="70" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="52" cy="47" r="1.8" fill="white" />
      <circle cx="72" cy="47" r="1.8" fill="white" />
      {/* cheeks */}
      <ellipse cx="44" cy="58" rx="5" ry="3.5" fill="#fda4af" opacity="0.6" />
      <ellipse cx="76" cy="58" rx="5" ry="3.5" fill="#fda4af" opacity="0.6" />
      {/* nose */}
      <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill="#e11d48" />
      {/* tail */}
      <circle cx="91" cy="84" r="10" fill="#ffe4e6" />
      {/* front legs */}
      <ellipse cx="42" cy="96" rx="9" ry="7" fill={color} transform="rotate(-20 42 96)" />
      <ellipse cx="78" cy="96" rx="9" ry="7" fill={color} transform="rotate(20 78 96)" />
    </svg>
  );
}

/* ─── Carrot SVG ───────────────────────────────────────────── */
function CarrotSVG({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 28 C12 22 10 16 11 10 C12 6 16 4 18 8 C20 12 20 18 16 28Z" fill="#f97316" />
      <path d="M13 10 C10 6 8 4 10 2 C12 0 14 4 13 10Z" fill="#22c55e" />
      <path d="M16 8  C16 4 18 2 20 3 C22 5 19 8 16 8Z" fill="#22c55e" />
      <path d="M18 10 C20 6 23 5 24 7 C25 9 22 11 18 10Z" fill="#22c55e" />
    </svg>
  );
}

/* ─── Heart particle ───────────────────────────────────────── */
function HeartSVG({ size = 18, color = '#fb7185' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ─── Chili Logo (inline from page.jsx) ────────────────────── */
function ChiliLogoInline({ size = 48 }) {
  return (
    <div
      className="relative grid place-items-center ls-logo-float ls-logo-glow rounded-[14px]"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #fb7185, #f43f5e, #ea580c)' }}
      aria-hidden="true"
    >
      <svg style={{ width: '55%', height: '55%' }} viewBox="0 0 24 24" fill="none">
        <path d="M7.8 16.7c-2.2.7-4.1.3-4.7-.8-.8-1.5 1-4.1 4.3-6.1 3.3-2.1 6.8-2.8 8.1-1.5 1.2 1.2.3 3.8-2.2 5.9-1.4 1.2-3.4 2-5.5 2.5Z" fill="white" />
        <path d="M14.6 8.1c1-2.6 2.9-4 5.2-3.8M16.3 6.2c.9-.7 2-.9 3.3-.7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─── Rabbit definitions ────────────────────────────────────── */
const RABBITS = [
  {
    id: 0,
    // top-left corner, slightly outside card
    pos: { top: '-52px', left: '-44px' },
    size: 52,
    color: '#f43f5e',
    earColor: '#fb7185',
    hopClass: 'ls-rabbit-hop',
    dur: '1.0s',
    delay: '0s',
    flipX: false,
  },
  {
    id: 1,
    // top-right corner
    pos: { top: '-48px', right: '-40px' },
    size: 44,
    color: '#fb7185',
    earColor: '#fda4af',
    hopClass: 'ls-rabbit-hop-alt',
    dur: '1.3s',
    delay: '0.25s',
    flipX: true,
  },
  {
    id: 2,
    // bottom-left
    pos: { bottom: '-56px', left: '-36px' },
    size: 48,
    color: '#e11d48',
    earColor: '#fb7185',
    hopClass: 'ls-rabbit-hop',
    dur: '0.9s',
    delay: '0.5s',
    flipX: false,
  },
  {
    id: 3,
    // bottom-right
    pos: { bottom: '-52px', right: '-42px' },
    size: 54,
    color: '#f43f5e',
    earColor: '#fecdd3',
    hopClass: 'ls-rabbit-hop-alt',
    dur: '1.2s',
    delay: '0.15s',
    flipX: true,
  },
  {
    id: 4,
    // top-center
    pos: { top: '-60px', left: '50%', transform: 'translateX(-50%)' },
    size: 40,
    color: '#fb7185',
    earColor: '#fda4af',
    hopClass: 'ls-rabbit-hop',
    dur: '1.5s',
    delay: '0.7s',
    flipX: false,
  },
];

/* ─── CELEBRATE HEARTS (shown when progress=100) ─────────── */
const CELEBRATE_HEARTS = [
  { id: 0, left: '20%', bottom: '60%', delay: '0s' },
  { id: 1, left: '45%', bottom: '55%', delay: '0.15s' },
  { id: 2, left: '70%', bottom: '58%', delay: '0.3s' },
  { id: 3, left: '30%', bottom: '65%', delay: '0.1s' },
  { id: 4, left: '60%', bottom: '63%', delay: '0.22s' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress]       = useState(0);
  const [msgIndex, setMsgIndex]       = useState(0);
  const [isExiting, setIsExiting]     = useState(false);
  const [celebrate, setCelebrate]     = useState(false);
  const [showHearts, setShowHearts]   = useState(false);
  const [imgError, setImgError]       = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const progressRef = useRef(null);
  const msgTimerRef = useRef(null);

  /* ── Detect prefers-reduced-motion ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Progress counter ── */
  useEffect(() => {
    const startTime = performance.now();
    let raf;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        // 100% reached → celebrate
        setCelebrate(true);
        setShowHearts(true);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => onComplete?.(), EXIT_ANIM_MS + 100);
        }, CELEBRATE_MS);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  /* ── Rotate loading messages ── */
  useEffect(() => {
    msgTimerRef.current = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MSGS.length);
    }, TOTAL_MS / LOADING_MSGS.length);
    return () => clearInterval(msgTimerRef.current);
  }, []);

  /* ── Aria live announcement ── */
  const ariaMsg = `Memuat dashboard, harap tunggu… ${progress}%`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaMsg}
      className={`ls-fade-in${isExiting ? ' ls-exit-bg' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 35%, #fdf2f8 65%, #fce7f3 100%)',
      }}
    >
      {/* ── Background blur orbs ── */}
      <div
        className="ls-orb-1 pointer-events-none absolute"
        style={{ width: 340, height: 340, top: '-80px', left: '-80px', borderRadius: '50%', background: 'radial-gradient(circle, #fecdd3 0%, transparent 70%)', opacity: 0.55, filter: 'blur(60px)' }}
      />
      <div
        className="ls-orb-2 pointer-events-none absolute"
        style={{ width: 280, height: 280, bottom: '-60px', right: '-60px', borderRadius: '50%', background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)', opacity: 0.5, filter: 'blur(50px)' }}
      />
      <div
        className="ls-orb-3 pointer-events-none absolute"
        style={{ width: 200, height: 200, top: '40%', right: '15%', borderRadius: '50%', background: 'radial-gradient(circle, #fda4af 0%, transparent 70%)', opacity: 0.35, filter: 'blur(40px)' }}
      />

      {/* ── Falling petals ── */}
      {!reducedMotion && PETALS.map((p) => (
        <span
          key={p.id}
          className="petal pointer-events-none absolute rounded-full"
          style={{
            left: p.left,
            top: '-5%',
            width: p.size,
            height: p.size,
            backgroundColor: '#fda4af',
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* ── Floating ambient particles ── */}
      {!reducedMotion && PARTICLES.map((p) => (
        <span
          key={p.id}
          className="ls-particle pointer-events-none absolute select-none"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.size,
            '--dx': p.dx,
            '--dy': p.dy,
            '--dur': p.dur,
            '--delay': p.delay,
          }}
          aria-hidden="true"
        >
          {p.emoji}
        </span>
      ))}

      {/* ── Floating carrots (corners) ── */}
      {!reducedMotion && (
        <>
          <div className="ls-carrot-spin pointer-events-none absolute" style={{ top: '12%', left: '8%', '--delay': '0s', opacity: 0.7 }} aria-hidden="true"><CarrotSVG size={28} /></div>
          <div className="ls-carrot-spin pointer-events-none absolute" style={{ bottom: '15%', right: '9%', '--delay': '0.8s', opacity: 0.65 }} aria-hidden="true"><CarrotSVG size={24} /></div>
          <div className="ls-carrot-spin pointer-events-none absolute" style={{ top: '65%', left: '5%', '--delay': '1.4s', opacity: 0.5 }} aria-hidden="true"><CarrotSVG size={20} /></div>
        </>
      )}

      {/* ═══════════════════════════════════════════
          GLASSMORPHISM CARD
          ═══════════════════════════════════════════ */}
      <div
        className={`ls-card-in${isExiting ? ' ls-exit-card' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          margin: '0 16px',
          borderRadius: 28,
          padding: '36px 32px 32px',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid rgba(254,205,211,0.65)',
          boxShadow: '0 24px 64px rgba(244,63,94,0.18), 0 8px 24px rgba(244,63,94,0.08)',
        }}
      >
        {/* ── Rabbits around the card ── */}
        {RABBITS.map((r) => (
          <div
            key={r.id}
            className={`${r.hopClass}${celebrate ? ' ls-celebrate' : ''} pointer-events-none absolute`}
            style={{
              ...r.pos,
              '--dur': r.dur,
              '--delay': r.delay,
              transform: r.flipX ? (r.pos.transform ? `${r.pos.transform} scaleX(-1)` : 'scaleX(-1)') : r.pos.transform,
              zIndex: 2,
              willChange: 'transform',
            }}
            aria-hidden="true"
          >
            <RabbitSVG size={r.size} color={r.color} earColor={r.earColor} />
          </div>
        ))}

        {/* ── Celebrate hearts ── */}
        {showHearts && CELEBRATE_HEARTS.map((h) => (
          <div
            key={h.id}
            className="ls-heart-float pointer-events-none absolute"
            style={{ left: h.left, bottom: h.bottom, '--delay': h.delay, zIndex: 3 }}
            aria-hidden="true"
          >
            <HeartSVG size={20} color="#fb7185" />
          </div>
        ))}

        {/* ── ChiliDetect Logo ── */}
        <div className="ls-logo-in flex flex-col items-center gap-1 mb-6">
          <ChiliLogoInline size={52} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <p className="font-display font-bold tracking-tight" style={{ fontSize: 20, color: '#881337' }}>
              ChiliDetect
            </p>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fda4af', marginTop: 1 }}>
              MobileNetV2 AI
            </p>
          </div>
        </div>

        {/* ── Developer photo ── */}
        <div className="flex flex-col items-center mb-5">
          {/* Outer animated ring */}
          <div
            className="ls-ring-expand"
            style={{
              width: 148,
              height: 148,
              borderRadius: '50%',
              padding: 4,
              background: 'linear-gradient(135deg, #fb7185, #f43f5e, #fda4af)',
              boxShadow: '0 8px 32px rgba(244,63,94,0.3)',
              willChange: 'transform',
            }}
          >
            {/* Inner white border */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                padding: 3,
                background: 'white',
              }}
            >
              {/* Photo or fallback */}
              {!imgError ? (
                <img
                  src="/images/foto-my.jpg"
                  alt="Foto Difa Fadhillah, pengembang ChiliDetect"
                  width={200}
                  height={200}
                  className="ls-photo-reveal ls-photo-pulse"
                  onError={() => setImgError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                  }}
                />
              ) : (
                // Fallback: gradient circle with initial
                <div
                  className="ls-photo-reveal"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fb7185, #f43f5e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 42,
                  }}
                >
                  D
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Developer name block ── */}
        <div className="text-center mb-4">
          {/* Primary name — split chars with GSAP-like stagger via CSS delay */}
          <div
            className="ls-slide-up font-display font-bold"
            style={{
              '--delay': '1.1s',
              fontSize: 34,
              color: '#881337',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {'Difa Fadhillah'.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animation: reducedMotion
                    ? 'none'
                    : `ls-slide-up 0.4s cubic-bezier(0.34,1.2,0.64,1) ${1.1 + i * 0.045}s both`,
                  opacity: reducedMotion ? 1 : undefined,
                  willChange: 'transform',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Secondary name — typewriter */}
          <div style={{ marginTop: 6 }}>
            <span
              className="ls-typewriter font-medium italic"
              style={{
                fontSize: 16,
                color: '#f43f5e',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Anasera Kaluna
            </span>
          </div>
        </div>

        {/* ── Project info ── */}
        <div
          className="ls-slide-up text-center mb-5"
          style={{ '--delay': '1.7s' }}
        >
          {/* Badge */}
          <div
            className="ls-badge-pop inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
            style={{
              '--delay': '1.85s',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#e11d48',
            }}
          >
            {/* Pulse dot */}
            <span
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#f43f5e',
                display: 'inline-block',
                animation: 'pulse 1.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            Deep Learning Project
          </div>

          {/* Title */}
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#9f1239',
              lineHeight: 1.35,
              margin: '0 auto 6px',
              maxWidth: 330,
            }}
          >
            Sistem Klasifikasi Cabai Rawit Indonesia
          </p>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 12,
              color: '#be123c',
              lineHeight: 1.5,
              margin: '0 auto',
              maxWidth: 320,
              opacity: 0.85,
            }}
          >
            Deep Learning berbasis MobileNetV2 · 4 jenis cabai rawit
          </p>
        </div>

        {/* ── Progress section ── */}
        <div
          className="ls-slide-up"
          style={{ '--delay': '2.0s' }}
        >
          {/* Percentage + text header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#be123c',
                fontFamily: "'Inter', sans-serif",
                transition: 'opacity 0.3s',
              }}
            >
              {LOADING_MSGS[msgIndex]}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 13,
                color: '#e11d48',
                minWidth: 38,
                textAlign: 'right',
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Bar track */}
          <div
            style={{
              width: '100%',
              height: 10,
              borderRadius: 99,
              background: '#ffe4e6',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Fill */}
            <div
              ref={progressRef}
              style={{
                height: '100%',
                borderRadius: 99,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #fda4af, #fb7185, #f43f5e)',
                transition: 'width 0.1s linear',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer overlay */}
              {!reducedMotion && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                    animation: 'ls-progress-shimmer 1.6s linear infinite',
                    width: '50%',
                  }}
                />
              )}
            </div>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {['Verifikasi', 'Memuat', 'Siap! 🎉'].map((step, i) => {
              const threshold = [0, 40, 80][i];
              const done = progress >= threshold + 20;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: done ? 'linear-gradient(135deg,#fb7185,#f43f5e)' : '#fecdd3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.4s',
                      flexShrink: 0,
                    }}
                  >
                    {done && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: done ? '#e11d48' : '#fda4af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer credit ── */}
        <p
          className="ls-slide-up text-center"
          style={{
            '--delay': '2.2s',
            marginTop: 16,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#fda4af',
          }}
        >
          Politeknik Negeri Padang · 2026
        </p>
      </div>

      {/* Screen reader only text */}
      <span className="sr-only">{ariaMsg}</span>
    </div>
  );
}
