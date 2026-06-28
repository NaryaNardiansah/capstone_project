'use client';

import { useEffect, useState, useRef } from 'react';

const FAREWELL_MSGS = [
  "Yakin mau pergi? MobileNetV2 aja sedih nih kehilangan kamu 😢",
  "Kamu pergi lagi... Cabai-cabai di sini bakal kangen kamu loh 🥺",
  "Fine, pergi aja. Tapi jangan lama-lama ya, dataset kita kangen 🥲",
  "Kamu logout, tapi kamu gak akan pernah logout dari hati kami 💔",
  "Selamat jalan, manusia favorit kami di seluruh server 🫶",
  "Pergi boleh, tapi jangan lupa balik ya... kami nungguin 🥺👉👈",
  "Setiap pixel di layar ini akan merindukan kehadiranmu ✨",
  "Meski kamu logout, klasifikasi cabai kami tetap untukmu 🌶️",
  "Kamu adalah ground truth di hati kami 📊❤️",
  "Seperti cabai rawit yang pedas, kenangan bersamamu takkan terlupakan 🌶️",
  "Cabai Setan aja gak sepedas perpisahan ini 🌶️😭",
  "Kamu logout? Oke... kelinci nangis di pojokan 🐰💧",
  "Kami akan menyimpan session kamu di hati... eh maksudnya di cookie 🍪",
  "Sampai jumpa di epoch berikutnya, classifier favorit kami 🙏",
  "Dadah, jangan lupa rindu 🥺",
  "Bye bye, love you more than 95.1% confidence 🎯",
];

const PETALS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${(i * 23 + 7) % 94}%`,
  delay: `${(i * 1.6).toFixed(1)}s`,
  duration: `${14 + (i % 4) * 2}s`,
  size: 6 + (i % 3) * 3,
  opacity: 0.35 + (i % 3) * 0.15,
}));

// Floating Tear Drops
const TEARS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  left: `${(i * 27 + 13) % 90}%`,
  delay: `${(i * 2.1).toFixed(1)}s`,
  duration: `${6 + (i % 3) * 1.5}s`,
}));

// Custom Sad Big Rabbit SVG
function SadRabbitSVG({ size = 110, isCelebrating = false, onInteract }) {
  return (
    <div 
      className="relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95" 
      onClick={onInteract}
      title="Hiks... Peluk aku? 🥺"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        {/* ears (drooped down in sadness) */}
        <g style={{ transformOrigin: '40px 40px', transform: 'rotate(-40deg)' }}>
          <ellipse cx="40" cy="20" rx="9" ry="24" fill="#fb7185" />
          <ellipse cx="40" cy="20" rx="4" ry="15" fill="#fff1f2" />
        </g>
        <g style={{ transformOrigin: '80px 40px', transform: 'rotate(40deg)' }}>
          <ellipse cx="80" cy="20" rx="9" ry="24" fill="#fb7185" />
          <ellipse cx="80" cy="20" rx="4" ry="15" fill="#fff1f2" />
        </g>

        {/* body */}
        <ellipse cx="60" cy="82" rx="30" ry="26" fill="#f43f5e" />
        {/* white belly */}
        <ellipse cx="60" cy="85" rx="16" ry="13" fill="#fff1f2" />

        {/* head */}
        <circle cx="60" cy="56" r="25" fill="#fb7185" />

        {/* sad eyes (glistening with tears) */}
        <circle cx="50" cy="52" r="5" fill="#1c0008" />
        <circle cx="70" cy="52" r="5" fill="#1c0008" />
        {/* eye highlights */}
        <circle cx="48" cy="50" r="1.5" fill="white" />
        <circle cx="68" cy="50" r="1.5" fill="white" />
        
        {/* large sad tear drops in eyes */}
        <ellipse cx="52" cy="55" rx="2.5" ry="3.5" fill="#bae6fd" opacity="0.9" className="animate-pulse" />
        <ellipse cx="72" cy="55" rx="2.5" ry="3.5" fill="#bae6fd" opacity="0.9" className="animate-pulse" />

        {/* blush cheeks */}
        <ellipse cx="43" cy="62" rx="5" ry="3.5" fill="#fda4af" opacity="0.7" />
        <ellipse cx="77" cy="62" rx="5" ry="3.5" fill="#fda4af" opacity="0.7" />

        {/* tiny frown mouth (melengkung ke bawah) */}
        <path d="M 57 65 Q 60 63 63 65" stroke="#4c0519" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* paws (holding tissue or weeping) */}
        <circle cx="48" cy="74" r="6" fill="#fb7185" />
        <circle cx="72" cy="74" r="6" fill="#fb7185" />
        {/* tissue */}
        <path d="M 43 72 L 35 80 L 46 82 Z" fill="white" stroke="#fda4af" strokeWidth="1" />

        {/* tail */}
        <circle cx="30" cy="85" r="8" fill="#ffe4e6" />
      </svg>
    </div>
  );
}

// Background tiny sad rabbit (melambaikan tangan sedih)
function TinyWavingRabbit({ size = 32, className = "", delay = "0s" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`${className} ls-rabbit-hop`}
      style={{ '--delay': delay, '--dur': '1.3s' }}
    >
      <ellipse cx="40" cy="30" rx="9" ry="24" fill="#fda4af" />
      <ellipse cx="80" cy="30" rx="9" ry="24" fill="#fda4af" />
      <ellipse cx="60" cy="80" rx="32" ry="28" fill="#fb7185" />
      <circle cx="60" cy="54" r="26" fill="#fda4af" />
      <circle cx="50" cy="49" r="4" fill="#4c0519" />
      <circle cx="70" cy="49" r="4" fill="#4c0519" />
      <ellipse cx="60" cy="61" rx="3" ry="2" fill="#e11d48" />
      {/* waving hand */}
      <circle cx="85" cy="65" r="7" fill="#fda4af" className="animate-bounce" style={{ animationDuration: '0.8s' }} />
    </svg>
  );
}

export default function LogoutScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [heartBurst, setHeartBurst] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Pick a random message once at startup
  useEffect(() => {
    const user = localStorage.getItem('username') || 'Difaa';
    let randMsg = FAREWELL_MSGS[Math.floor(Math.random() * FAREWELL_MSGS.length)];
    // Personalize with username if possible
    if (randMsg.includes("kamu")) {
      randMsg = randMsg.replace(/kamu/g, user);
    }
    setMessage(randMsg);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Progress ticking (4.2 seconds total)
  useEffect(() => {
    const TOTAL_MS = 4000;
    const startTime = performance.now();
    let raf;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setIsExiting(true);
        setTimeout(() => {
          onComplete?.();
        }, 600); // Wait for exit animation
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  // Click handler for heart burst interaction
  const handleRabbitInteract = (e) => {
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() * 60 - 30),
      y: e.clientY + (Math.random() * 60 - 30),
    }));
    setHeartBurst((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHeartBurst((prev) => prev.slice(5));
    }, 1500);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`ls-fade-in${isExiting ? ' ls-exit-bg' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999, // Ensure it covers everything
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff1f2 0%, #fdf2f8 40%, #fae8ff 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(251,113,133,0.06) 100%)',
        }}
      />

      {/* ── Background blur orbs (Warm Rose & Pastel Purple) ── */}
      <div className="ls-orb-1 pointer-events-none absolute" style={{ width: 300, height: 300, top: '-50px', left: '-50px', borderRadius: '50%', background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)', opacity: 0.6, filter: 'blur(50px)' }} />
      <div className="ls-orb-2 pointer-events-none absolute" style={{ width: 280, height: 280, bottom: '-50px', right: '-50px', borderRadius: '50%', background: 'radial-gradient(circle, #f3e8ff 0%, transparent 70%)', opacity: 0.55, filter: 'blur(55px)' }} />

      {/* ── Floating Air Mata (Tear drops falling) ── */}
      {!reducedMotion && TEARS.map((t) => (
        <svg
          key={t.id}
          className="absolute pointer-events-none"
          style={{
            left: t.left,
            top: '-5%',
            width: 14,
            height: 18,
            animation: `petal-fall ${t.duration} linear ${t.delay} infinite`,
            opacity: 0.45,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#bae6fd" />
        </svg>
      ))}

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
            backgroundColor: '#fbcfe8',
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* ── Tiny sad waving rabbits in background ── */}
      {!reducedMotion && (
        <>
          <TinyWavingRabbit size={28} className="absolute left-[10%] bottom-[12%] opacity-40" delay="0.2s" />
          <TinyWavingRabbit size={24} className="absolute right-[8%] top-[15%] opacity-35" delay="0.7s" />
          <TinyWavingRabbit size={20} className="absolute left-[15%] top-[20%] opacity-30" delay="1.1s" />
        </>
      )}

      {/* ── Interaction Heart Burst ── */}
      {heartBurst.map((h) => (
        <div
          key={h.id}
          className="ls-heart-float pointer-events-none absolute z-50 animate-bounce"
          style={{ left: h.x - 10, top: h.y - 10 }}
        >
          <span style={{ fontSize: 24 }}>💖</span>
        </div>
      ))}

      {/* ═══════════════════════════════════════════
          FAREWELL GLASS CARD
          ═══════════════════════════════════════════ */}
      <div
        className={`ls-card-in${isExiting ? ' ls-exit-card' : ''}`}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: 440,
          borderRadius: 28,
          padding: '36px 28px 28px',
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid rgba(244,143,177,0.4)',
          boxShadow: '0 24px 64px rgba(244,63,94,0.12), 0 8px 24px rgba(244,63,94,0.06)',
          textAlign: 'center',
        }}
      >
        {/* Big Sad Rabbit */}
        <div className="flex justify-center mb-6">
          <SadRabbitSVG onInteract={handleRabbitInteract} />
        </div>

        {/* Typewriter message */}
        <div className="mb-4 min-h-[72px] flex items-center justify-center">
          <p 
            className="ls-typewriter font-display font-semibold italic"
            style={{
              fontSize: 22,
              color: '#881337',
              lineHeight: 1.35,
              borderRight: 'none',
              animation: 'none',
              maxWidth: '100%',
              overflow: 'visible',
              whiteSpace: 'normal',
            }}
          >
            {message}
          </p>
        </div>

        {/* Subtitle / Signature */}
        <p 
          className="ls-slide-up text-sm font-medium" 
          style={{ '--delay': '1s', color: '#be123c', opacity: 0.8 }}
        >
          Sampai jumpa di klasifikasi berikutnya... 🌶️
        </p>

        {/* Subtle Progress Bar */}
        <div className="mt-8 mb-4 flex flex-col items-center">
          <div
            style={{
              width: '70%',
              height: 4,
              borderRadius: 99,
              background: '#ffe4e6',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #fbcfe8, #fb7185)',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
          <span style={{ fontSize: 10, color: '#fca5a5', marginTop: 8, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            Menghapus Session Sesi...
          </span>
        </div>
      </div>
    </div>
  );
}
