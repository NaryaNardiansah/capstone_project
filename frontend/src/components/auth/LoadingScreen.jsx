'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Story Konfigurasi Waktu ──────────────────────────────── */
const MS_PER_LINE = 4500;   // Durasi per baris lirik (4.5 detik)
const CELEBRATE_MS = 600;   // Durasi selebrasi hati melayang saat 100%
const EXIT_ANIM_MS = 650;   // Durasi fade-out keluar

/* ─── Kumpulan Kata Sambutan Pengguna Baru ──────────────────── */
const NEW_USER_STORIES = [
  [
    "Selamat datang di keluarga besar Sistem Klasifikasi Cabai, {user}! 🎉✨",
    "Senang sekali menyambut langkah pertamamu menjelajahi teknologi AI kami.",
    "Sistem ini dirancang khusus dengan MobileNetV2 untuk mengenali 7 varietas cabai secara cerdas.",
    "Kelinci-kelinci kecil ini sudah bersiap memandu dan menemanimu di setiap sudut aplikasi.",
    "Foto cabai pertamamu hari ini akan menjadi awal dari perjalanan riset yang seru.",
    "Yuk bersiap, mari kita masuki ruang kerja klasifikasi digitalmu sekarang! 🚀🌶️"
  ],
  [
    "Hai {user}! Hari ini adalah momen istimewa karena kamu resmi bergabung bersama kami... 🌟",
    "Terima kasih telah mempercayakan klasifikasi citra cabai kepada teknologi cerdas ini.",
    "Dari cabai rawit merah membara hingga paprika manis, semua siap dianalisis dalam sekejap mata.",
    "Setiap fitur di sini dibuat dengan penuh dedikasi agar pengalaman eksplorasimu terasa nyaman.",
    "Semoga hari pertamamu menyenangkan dan penuh wawasan baru yang berharga ya, manis! 🌸🐰",
    "Pintu dashboard kini terbuka lebar khusus menyambut kehadiranmu... ✨"
  ]
];

/* ─── Kumpulan Kata Sambutan Pengguna Lama (Kembali Lagi) ────── */
const RETURNING_USER_STORIES = [
  [
    "Hai {user}, akhirnya yang ditunggu-tunggu pulang dan kembali juga... ✨",
    "Layar kaca yang tadinya sepi, mendadak terasa begitu hangat saat kehadiranmu menyapa.",
    "Jutaan neuron di model AI ini berdetak riang menyambut kedatanganmu lagi hari ini.",
    "Pedasnya cabai rawit tak sebanding dengan manisnya senyummu yang selalu kurindukan.",
    "Kelinci-kelinci ini sudah melompat girang menyambut langkahmu kembali, sayang... 🌸🐰",
    "Mari kita lanjutkan petualangan klasifikasi terbaik kita hari ini! 💖🌶️"
  ],
  [
    "Senang sekali melihat senyummu lagi di sini, {user}... ❤️",
    "Ruangan ini selalu terasa ada yang kurang setiap kali kamu melangkah pergi.",
    "Namun detik ini, seluruh detak sistem terasa hidup kembali karena kamu telah tiba.",
    "Data dan riwayat klasifikasimu tersimpan rapi, siap melanjutkan perjalanan bersamamu.",
    "Terima kasih sudah selalu setia kembali dan mempercayai karya ini.",
    "Pintu ini tak pernah sekalipun terkunci... selamat datang kembali di rumah digital kita! 🏡✨"
  ],
  [
    "Kembali lagi ya, {user}? Pintu ini memang tak pernah sekalipun tertutup untukmu... 🕯️",
    "Di luar sana harimu mungkin melelahkan, tapi di sini kamu selalu istimewa.",
    "Aroma cabai dan algoritma kami siap menyemangati setiap aktivitasmu hari ini.",
    "Mari ciptakan hari yang produktif dan menyenangkan bersama-sama.",
    "Kelinci manis ini selalu setia menunggumu di sini setiap hari... 🌷🐰",
    "Yuk, kita mulai petualangan klasifikasi seru hari ini! 🚀🔥"
  ]
];

/* ─── Kelopak Bunga Melayang ───────────────────────────────── */
const PETALS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 3) % 96}%`,
  delay: `${(i * 1.4).toFixed(1)}s`,
  duration: `${12 + (i % 5) * 2}s`,
  size: 7 + (i % 4) * 3,
  opacity: 0.4 + (i % 3) * 0.15,
}));

/* ─── Partikel Emotikon Lucu Melayang ───────────────────────── */
const PARTICLES = [
  { id: 0, left: '12%', top: '18%', dx: '12px', dy: '-14px', dur: '7s', delay: '0s', emoji: '💗', size: 14 },
  { id: 1, left: '82%', top: '14%', dx: '-8px', dy: '-12px', dur: '9s', delay: '1.2s', emoji: '🌸', size: 13 },
  { id: 2, left: '6%', top: '68%', dx: '16px', dy: '-8px', dur: '8s', delay: '0.6s', emoji: '✨', size: 12 },
  { id: 3, left: '90%', top: '72%', dx: '-12px', dy: '-10px', dur: '6s', delay: '2s', emoji: '💕', size: 13 },
  { id: 4, left: '46%', top: '8%', dx: '8px', dy: '-16px', dur: '10s', delay: '1.8s', emoji: '🌷', size: 11 },
  { id: 5, left: '70%', top: '88%', dx: '-10px', dy: '-12px', dur: '7s', delay: '0.3s', emoji: '⭐', size: 12 },
];

/* ─── Karakter Kelinci Imut SVG ────────────────────────────── */
function RabbitSVG({ size = 48, color = '#f43f5e', earColor = '#fb7185', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="40" cy="30" rx="10" ry="24" fill={earColor} />
      <ellipse cx="80" cy="30" rx="10" ry="24" fill={earColor} />
      <ellipse cx="40" cy="30" rx="5" ry="15" fill="#fff1f2" />
      <ellipse cx="80" cy="30" rx="5" ry="15" fill="#fff1f2" />
      <ellipse cx="60" cy="80" rx="32" ry="28" fill={color} />
      <circle cx="60" cy="54" r="26" fill={earColor} />
      <circle cx="50" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="70" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="52" cy="47" r="1.8" fill="white" />
      <circle cx="72" cy="47" r="1.8" fill="white" />
      <ellipse cx="44" cy="58" rx="5" ry="3.5" fill="#fda4af" opacity="0.6" />
      <ellipse cx="76" cy="58" rx="5" ry="3.5" fill="#fda4af" opacity="0.6" />
      <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill="#e11d48" />
      <circle cx="91" cy="84" r="10" fill="#ffe4e6" />
      <ellipse cx="42" cy="96" rx="9" ry="7" fill={color} transform="rotate(-20 42 96)" />
      <ellipse cx="78" cy="96" rx="9" ry="7" fill={color} transform="rotate(20 78 96)" />
    </svg>
  );
}

/* ─── Wortel Imut Berputar SVG ─────────────────────────────── */
function CarrotSVG({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 28 C12 22 10 16 11 10 C12 6 16 4 18 8 C20 12 20 18 16 28Z" fill="#f97316" />
      <path d="M13 10 C10 6 8 4 10 2 C12 0 14 4 13 10Z" fill="#22c55e" />
      <path d="M16 8 C16 4 18 2 20 3 C22 5 19 8 16 8Z" fill="#22c55e" />
      <path d="M18 10 C20 6 23 5 24 7 C25 9 22 11 18 10Z" fill="#22c55e" />
    </svg>
  );
}

/* ─── Partikel Hati Selebrasi ──────────────────────────────── */
function HeartSVG({ size = 18, color = '#fb7185' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ─── Logo Cabai Melayang ──────────────────────────────────── */
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

/* ─── Posisi 5 Kelinci di Sudut Kartu ──────────────────────── */
const RABBITS = [
  { id: 0, pos: { top: '-52px', left: '-44px' }, size: 52, color: '#f43f5e', earColor: '#fb7185', hopClass: 'ls-rabbit-hop', dur: '1.0s', delay: '0s', flipX: false },
  { id: 1, pos: { top: '-48px', right: '-40px' }, size: 44, color: '#fb7185', earColor: '#fda4af', hopClass: 'ls-rabbit-hop-alt', dur: '1.3s', delay: '0.25s', flipX: true },
  { id: 2, pos: { bottom: '-56px', left: '-36px' }, size: 48, color: '#e11d48', earColor: '#fb7185', hopClass: 'ls-rabbit-hop', dur: '0.9s', delay: '0.5s', flipX: false },
  { id: 3, pos: { bottom: '-52px', right: '-42px' }, size: 54, color: '#f43f5e', earColor: '#fecdd3', hopClass: 'ls-rabbit-hop-alt', dur: '1.2s', delay: '0.15s', flipX: true },
  { id: 4, pos: { top: '-60px', left: '50%', transform: 'translateX(-50%)' }, size: 40, color: '#fb7185', earColor: '#fda4af', hopClass: 'ls-rabbit-hop', dur: '1.5s', delay: '0.7s', flipX: false },
];

/* ─── Hati Selebrasi 100% ──────────────────────────────────── */
const CELEBRATE_HEARTS = [
  { id: 0, left: '20%', bottom: '60%', delay: '0s' },
  { id: 1, left: '45%', bottom: '55%', delay: '0.15s' },
  { id: 2, left: '70%', bottom: '58%', delay: '0.3s' },
  { id: 3, left: '30%', bottom: '65%', delay: '0.1s' },
  { id: 4, left: '60%', bottom: '63%', delay: '0.22s' },
];

/* ─── Alunan Kotak Musik Ceria & Romantis (Web Audio API) ───── */
function playWelcomingMelody() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    let isStopped = false;
    let loopTimeout = null;

    // Tangga nada ceria menyambut (Cmaj7 -> Am7 -> Fmaj7 -> Gsus4 -> G)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.8, vol: 0.18 }, // C5
      { freq: 659.25, time: 0.25, dur: 0.8, vol: 0.20 }, // E5
      { freq: 783.99, time: 0.5, dur: 0.9, vol: 0.22 }, // G5
      { freq: 987.77, time: 0.75, dur: 1.1, vol: 0.24 }, // B5
      
      { freq: 440.00, time: 1.3, dur: 0.8, vol: 0.18 }, // A4
      { freq: 523.25, time: 1.55, dur: 0.8, vol: 0.20 }, // C5
      { freq: 659.25, time: 1.8, dur: 0.9, vol: 0.22 }, // E5
      { freq: 783.99, time: 2.05, dur: 1.1, vol: 0.24 }, // G5

      { freq: 349.23, time: 2.6, dur: 0.8, vol: 0.18 }, // F4
      { freq: 440.00, time: 2.85, dur: 0.8, vol: 0.20 }, // A4
      { freq: 523.25, time: 3.1, dur: 0.9, vol: 0.22 }, // C5
      { freq: 659.25, time: 3.35, dur: 1.1, vol: 0.24 }, // E5

      { freq: 392.00, time: 3.9, dur: 0.8, vol: 0.18 }, // G4
      { freq: 493.88, time: 4.15, dur: 0.8, vol: 0.20 }, // B4
      { freq: 587.33, time: 4.4, dur: 0.9, vol: 0.22 }, // D5
      { freq: 783.99, time: 4.65, dur: 1.2, vol: 0.26 }, // G5
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const playCycle = () => {
      if (isStopped) return;
      const startTime = ctx.currentTime;

      notes.forEach(({ freq, time, dur, vol }) => {
        const noteStart = startTime + time;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain1 = ctx.createGain();
        const noteGain2 = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, noteStart);
        osc2.frequency.setValueAtTime(freq * 2, noteStart);

        // Sound envelope khas kotak musik
        noteGain1.gain.setValueAtTime(0, noteStart);
        noteGain1.gain.linearRampToValueAtTime(vol, noteStart + 0.02);
        noteGain1.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

        noteGain2.gain.setValueAtTime(0, noteStart);
        noteGain2.gain.linearRampToValueAtTime(vol * 0.35, noteStart + 0.02);
        noteGain2.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur * 0.7);

        osc1.connect(noteGain1);
        osc2.connect(noteGain2);
        noteGain1.connect(masterGain);
        noteGain2.connect(masterGain);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteStart + dur);
        osc2.stop(noteStart + dur);
      });

      loopTimeout = setTimeout(playCycle, 5600);
    };

    playCycle();

    return {
      stop: () => {
        isStopped = true;
        if (loopTimeout) clearTimeout(loopTimeout);
        try {
          masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
          setTimeout(() => ctx.close(), 300);
        } catch {}
      },
      mute: (muted) => {
        try {
          masterGain.gain.setValueAtTime(muted ? 0 : 0.35, ctx.currentTime);
        } catch {}
      },
    };
  } catch (err) {
    console.warn('[WelcomeScreen] Web Audio error:', err);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════
   KOMPONEN UTAMA LOADING SCREEN SAMBUTAN
   ═══════════════════════════════════════════════════════════════ */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState('Pengguna');
  const [isNewUser, setIsNewUser] = useState(false);
  const [storyLines, setStoryLines] = useState([]);
  const [activeLineIdx, setActiveLineIdx] = useState(0);

  const [isExiting, setIsExiting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioElRef = useRef(null);
  const synthRef = useRef(null);

  // Inisialisasi User & Cerita Kata Sambutan
  useEffect(() => {
    const rawUser = localStorage.getItem('username') || 'Pengguna';
    const cleanUser = rawUser.trim();
    setUsername(cleanUser);

    // Cek status sesi apakah pengguna baru atau pengguna lama
    const isNew = sessionStorage.getItem('is_new_user_session') === 'true';
    setIsNewUser(isNew);

    const storyPool = isNew ? NEW_USER_STORIES : RETURNING_USER_STORIES;
    const chosenStory = storyPool[Math.floor(Math.random() * storyPool.length)];
    
    // Gantikan token {user} dengan username yang sebenarnya
    const parsedLines = chosenStory.map((line) => line.replace(/{user}/g, cleanUser));
    setStoryLines(parsedLines);
  }, []);

  // Alunan Musik Sambutan
  useEffect(() => {
    let isCancelled = false;

    try {
      const audio = new Audio('/audio/welcome.mp3');
      audio.preload = 'auto';
      audio.volume = 0.55;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isCancelled) {
              audioElRef.current = audio;
            } else {
              audio.pause();
            }
          })
          .catch(() => {
            // Jika file mp3 tidak ada / autoplay terblokir, putar alunan kotak musik
            if (!isCancelled) {
              synthRef.current = playWelcomingMelody();
            }
          });
      }
    } catch {
      synthRef.current = playWelcomingMelody();
    }

    return () => {
      isCancelled = true;
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioElRef.current) audioElRef.current.muted = nextMuted;
    if (synthRef.current) synthRef.current.mute(nextMuted);
  };

  // Timer & Pergantian Baris Kata Sambutan
  useEffect(() => {
    if (storyLines.length === 0) return;

    const totalDuration = storyLines.length * MS_PER_LINE;
    const startTime = performance.now();
    let rafId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(pct);

      const currentIdx = Math.min(
        storyLines.length - 1,
        Math.floor(elapsed / MS_PER_LINE)
      );
      setActiveLineIdx(currentIdx);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Selesai 100% → Selebrasi sejenak lalu masuk ke dasbor
        setCelebrate(true);
        setShowHearts(true);
        setTimeout(() => {
          setIsExiting(true);
          if (synthRef.current) synthRef.current.stop();
          if (audioElRef.current) audioElRef.current.pause();
          setTimeout(() => {
            onComplete?.();
          }, EXIT_ANIM_MS);
        }, CELEBRATE_MS);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [storyLines, onComplete]);

  // Tombol Langsung Masuk (Lewati / Skip)
  const handleImmediateEnter = () => {
    setCelebrate(true);
    setShowHearts(true);
    setIsExiting(true);
    if (synthRef.current) synthRef.current.stop();
    if (audioElRef.current) audioElRef.current.pause();
    setTimeout(() => {
      onComplete?.();
    }, 400);
  };

  const ariaMsg = `Menyambut ${username}, ${progress}%: ${storyLines[activeLineIdx] || ''}`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaMsg}
      className={`fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center overflow-hidden ls-fade-in${
        isExiting ? ' ls-exit-bg' : ''
      }`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 35%, #fdf2f8 65%, #fce7f3 100%)',
      }}
    >
      {/* ── Background Ambient Glow Orbs ── */}
      <div
        className="ls-orb-1 pointer-events-none absolute"
        style={{
          width: 360,
          height: 360,
          top: '-80px',
          left: '-80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fecdd3 0%, transparent 70%)',
          opacity: 0.55,
          filter: 'blur(60px)',
        }}
      />
      <div
        className="ls-orb-2 pointer-events-none absolute"
        style={{
          width: 320,
          height: 320,
          bottom: '-60px',
          right: '-60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)',
          opacity: 0.5,
          filter: 'blur(50px)',
        }}
      />
      <div
        className="ls-orb-3 pointer-events-none absolute"
        style={{
          width: 220,
          height: 220,
          top: '38%',
          right: '12%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fda4af 0%, transparent 70%)',
          opacity: 0.35,
          filter: 'blur(40px)',
        }}
      />

      {/* ── Kelopak Bunga Melayang Halus ── */}
      {PETALS.map((p) => (
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

      {/* ── Partikel Emotikon Lucu ── */}
      {PARTICLES.map((p) => (
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

      {/* ── Wortel Berputar di Sudut Layar ── */}
      <div className="ls-carrot-spin pointer-events-none absolute" style={{ top: '10%', left: '8%', '--delay': '0s', opacity: 0.7 }} aria-hidden="true">
        <CarrotSVG size={28} />
      </div>
      <div className="ls-carrot-spin pointer-events-none absolute" style={{ bottom: '12%', right: '9%', '--delay': '0.8s', opacity: 0.65 }} aria-hidden="true">
        <CarrotSVG size={24} />
      </div>
      <div className="ls-carrot-spin pointer-events-none absolute" style={{ top: '68%', left: '5%', '--delay': '1.4s', opacity: 0.5 }} aria-hidden="true">
        <CarrotSVG size={20} />
      </div>

      {/* ═══════════════════════════════════════════
          KARTU GLASSMORPHISM SAMBUTAN UTAMA
          ═══════════════════════════════════════════ */}
      <div
        className={`relative w-full max-w-[460px] mx-4 sm:mx-auto ls-card-in${isExiting ? ' ls-exit-card' : ''}`}
        style={{
          borderRadius: 28,
          padding: '30px 28px 24px',
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid rgba(254, 205, 211, 0.75)',
          boxShadow: '0 24px 64px rgba(244, 63, 94, 0.20), 0 8px 24px rgba(244, 63, 94, 0.08)',
        }}
      >
        {/* ── 5 Kelinci Melompat di Sudut Kartu ── */}
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

        {/* ── Partikel Hati Selebrasi 100% ── */}
        {showHearts &&
          CELEBRATE_HEARTS.map((h) => (
            <div
              key={h.id}
              className="ls-heart-float pointer-events-none absolute"
              style={{ left: h.left, bottom: h.bottom, '--delay': h.delay, zIndex: 3 }}
              aria-hidden="true"
            >
              <HeartSVG size={22} color="#fb7185" />
            </div>
          ))}

        {/* ── Bar Atas: Status Pengguna & Tombol Suara ── */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-xs"
            style={{
              backgroundColor: isNewUser ? '#ecfdf5' : '#fff1f2',
              borderColor: isNewUser ? '#a7f3d0' : '#fecdd3',
              color: isNewUser ? '#047857' : '#e11d48',
            }}
          >
            <span>{isNewUser ? '✨ PENGGUNA BARU' : '💖 SELAMAT DATANG KEMBALI'}</span>
          </div>

          {/* Tombol Mute / Unmute Musik */}
          <button
            type="button"
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200/80 hover:bg-rose-100/80 flex items-center justify-center text-xs text-rose-700 transition-transform active:scale-90"
            title={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
            aria-label={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
          </button>
        </div>

        {/* ── Logo ChiliDetect ── */}
        <div className="ls-logo-in flex flex-col items-center gap-1 mb-4">
          <ChiliLogoInline size={46} />
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <p className="font-display font-bold tracking-tight text-lg" style={{ color: '#881337' }}>
              ChiliDetect
            </p>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fda4af', marginTop: 1 }}>
              MobileNetV2 AI System
            </p>
          </div>
        </div>

        {/* ── KOTAK KATA SAMBUTAN / LIRIK BERPINDAH ── */}
        <div
          className="relative min-h-[96px] p-5 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/50 flex items-center justify-center text-center shadow-xs my-6 overflow-hidden"
        >
          {storyLines.length > 0 && (
            <p
              key={activeLineIdx}
              className="text-sm sm:text-base font-semibold leading-relaxed animate-fade-in px-2"
              style={{ color: '#881337' }}
            >
              {storyLines[activeLineIdx]}
            </p>
          )}
        </div>

        {/* ── Progress Bar & Indikator Baris ── */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: '#be123c' }}>
            <span>
              Langkah {activeLineIdx + 1} dari {storyLines.length || 6}
            </span>
            <span className="font-mono font-bold" style={{ color: '#e11d48' }}>
              {progress}%
            </span>
          </div>

          {/* Bar Fill */}
          <div
            style={{
              width: '100%',
              height: 7,
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
                background: 'linear-gradient(90deg, #fda4af, #fb7185, #f43f5e)',
                transition: 'width 0.1s linear',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                  animation: 'ls-progress-shimmer 1.6s linear infinite',
                  width: '50%',
                }}
              />
            </div>
          </div>

          {/* Titik Indikator Baris */}
          <div className="flex justify-center gap-1.5 pt-1">
            {storyLines.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === activeLineIdx ? 16 : 6,
                  backgroundColor: i === activeLineIdx ? '#f43f5e' : '#fecdd3',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Tombol Lewati / Langsung Masuk Dashboard ── */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleImmediateEnter}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 shadow-sm hover:shadow-md hover:from-rose-600 hover:to-red-700 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
          >
            <span>Langsung Masuk Dashboard</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <p
            className="text-[9px] font-semibold tracking-wider uppercase text-center mt-1"
            style={{ color: '#fda4af' }}
          >
            Politeknik Negeri Padang · 2026
          </p>
        </div>
      </div>

      <span className="sr-only">{ariaMsg}</span>
    </div>
  );
}
