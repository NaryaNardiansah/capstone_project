'use client';

import React, { useEffect, useState, useRef } from 'react';

/* ─── Karakter Maskot Kelinci Riset SVG Interaktif ─────────── */
function InteractiveRabbitSVG({ size = 64, color = '#f43f5e', earColor = '#fb7185', isTalking = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${isTalking ? 'scale-105 rotate-2' : ''} ${className}`}
    >
      {/* Telinga Kelinci dengan Wiggle Efek */}
      <g style={{ transformOrigin: '40px 50px' }}>
        <ellipse cx="40" cy="30" rx="10" ry="24" fill={earColor} />
        <ellipse cx="40" cy="30" rx="5" ry="15" fill="#fff1f2" />
      </g>
      <g style={{ transformOrigin: '80px 50px' }}>
        <ellipse cx="80" cy="30" rx="10" ry="24" fill={earColor} />
        <ellipse cx="80" cy="30" rx="5" ry="15" fill="#fff1f2" />
      </g>

      {/* Badan Kelinci */}
      <ellipse cx="60" cy="80" rx="32" ry="28" fill={color} />
      
      {/* Kepala Kelinci */}
      <circle cx="60" cy="54" r="26" fill={earColor} />

      {/* Kacamata Riset / Peneliti Mini */}
      <circle cx="48" cy="49" r="8" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
      <circle cx="72" cy="49" r="8" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
      <line x1="56" y1="49" x2="64" y2="49" stroke="#ffffff" strokeWidth="2" opacity="0.9" />

      {/* Mata Kelinci */}
      <circle cx="48" cy="49" r="3.5" fill="#4c0519" />
      <circle cx="72" cy="49" r="3.5" fill="#4c0519" />
      <circle cx="49.5" cy="47.5" r="1.4" fill="white" />
      <circle cx="73.5" cy="47.5" r="1.4" fill="white" />

      {/* Pipi Merona Manis */}
      <ellipse cx="42" cy="59" rx="5.5" ry="3.5" fill="#fda4af" opacity={0.75} />
      <ellipse cx="78" cy="59" rx="5.5" ry="3.5" fill="#fda4af" opacity={0.75} />
      <ellipse cx="60" cy="62" rx="3" ry="2.2" fill="#e11d48" />

      {/* Mulut Kelinci Senyum Ramah */}
      <path d="M57 65 Q60 68 63 65" stroke="#4c0519" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Ekor & Kaki */}
      <circle cx="91" cy="84" r="10" fill="#ffe4e6" />
      <ellipse cx="42" cy="96" rx="9" ry="7" fill={color} transform="rotate(-20 42 96)" />
      <ellipse cx="78" cy="96" rx="9" ry="7" fill={color} transform="rotate(20 78 96)" />
    </svg>
  );
}

/* ─── Kutipan Edukatif Asisten Kelinci Lab Riset ────────────── */
const RESEARCH_RABBIT_QUOTES = [
  "Tahukah kamu? Arsitektur MobileNetV2 dirancang khusus agar model AI dapat memproses citra super cepat di perangkat komputasi terbatas! 📱⚡",
  "Model ini mampu mengklasifikasi 7 varietas cabai nusantara hanya dalam ~0.3 detik dengan tingkat akurasi uji validasi mencapai 95.1%! 🎯🌶️",
  "Teknik Depthwise Separable Convolution memangkas beban perkalian matriks hingga 8-9 kali lipat dibanding standar konvolusi! 🧠💡",
  "Dataset 1.428 citra cabai telah melalui augmentasi rotasi, zoom, dan flip agar model tetap tahan terhadap pencahayaan lapak pasar! 🔍🛒",
  "Aplikasi ini dibangun dengan sepenuh hati menggabungkan riset kecerdasan buatan dengan antarmuka yang ramah, hangat, dan menyenangkan! 💖🐰",
  "Setiap citra yang kamu uji otomatis dikompresi ke format WebP (~20 KB) untuk menjaga ruang penyimpanan server tetap lega! 💾✨",
  "Pedasnya cabai rawit merah diukur menggunakan skala Scoville (SHU) yang mencerminkan konsentrasi senyawa capsaicin di lidah! 🔥🌶️",
];

/* ─── Kutipan Apresiasi Dev Easter Egg Pengembang ──────────── */
const DEV_EASTER_EGG_QUOTES = [
  "Terima kasih sudah mencoba aplikasi ini! Dibuat dengan dedikasi penuh di Politeknik Negeri Padang 🎓✨",
  "Kelinci dan pengembang mengucapkan terima kasih banyak atas waktu dan apresiasimu menjelajahi sistem ini! 🌸🥰",
  "Riset kecerdasan buatan MobileNetV2 ini lahir dari komitmen untuk mendukung pertanian cabai nusantara! 🌶️🇮🇩",
  "Semoga karya ini memberi inspirasi dan manfaat nyata bagi para praktisi pertanian dan sivitas akademika! 🌟🙏",
  "Setiap baris kode di sini dirancang dengan cinta agar pengalaman eksplorasimu terasa nyaman dan bersahabat! 💖🐰",
];

/* ─── Komponen Counter Angka Bertambah Otomatis ─────────────── */
function AnimatedCounter({ target, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === null || target === undefined) return;
    let start = 0;
    const end = typeof target === 'number' ? target : parseInt(target, 10) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepIncrement = end / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString('id-ID')}</span>;
}

/* ─── Teknologi & Arsitektur Sistem Lengkap ─────────────────── */
const TECH_STACK = [
  { 
    name: 'Next.js 14', 
    role: 'Frontend UI Framework', 
    link: 'https://nextjs.org',
    icon: '⚛️',
    tech: 'React 18 · App Router · Tailwind CSS',
    badge: 'v14.2'
  },
  { 
    name: 'FastAPI', 
    role: 'Backend REST API Server', 
    link: 'https://fastapi.tiangolo.com',
    icon: '⚡',
    tech: 'Python 3.11 · Uvicorn · Asynchronous',
    badge: 'Async API'
  },
  { 
    name: 'MobileNetV2', 
    role: 'CNN Deep Learning Model', 
    link: 'https://keras.io/api/applications/mobilenet/',
    icon: '🧠',
    tech: 'TensorFlow / Keras · Transfer Learning',
    badge: '95.1% Akurasi'
  },
  { 
    name: 'SQLite / MySQL', 
    role: 'Relational Database Store', 
    link: 'https://www.sqlite.org',
    icon: '💾',
    tech: 'Automatic Fallback · Session & History',
    badge: 'Dual Driver'
  },
  { 
    name: 'Web Audio API', 
    role: 'Synthesizer & Audio Engine', 
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    icon: '🎵',
    tech: 'Synthesized Ambient Lo-Fi & Sound FX',
    badge: 'Zero Asset'
  },
  { 
    name: 'WebP Engine', 
    role: 'Storage & Image Compression', 
    link: 'https://developers.google.com/speed/webp',
    icon: '🖼️',
    tech: 'FIFO Intelligent Quota (~20 KB / foto)',
    badge: 'Optimized'
  },
];

/* ─── 4 Tahapan Alur Pemrosesan AI MobileNetV2 ──────────────── */
const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Citra Masukan Digital',
    desc: 'Foto cabai diproses ke ukuran baku 224x224 piksel dengan normalisasi nilai piksel kanal RGB [0, 1].',
    icon: '📷',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    step: '02',
    title: 'Depthwise Separable Conv',
    desc: 'Ekstraksi fitur spasial dan kanal warna secara terpisah untuk memangkas komputasi hingga 8-9x lebih ringan.',
    icon: '⚙️',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    step: '03',
    title: 'Inverted Residual Bottleneck',
    desc: 'Memperluas dimensi fitur sebelum kompresi dengan shortcut connection untuk menjaga aliran gradien konvergen.',
    icon: '🧬',
    accent: 'from-purple-500 to-indigo-500',
  },
  {
    step: '04',
    title: 'Klasifikasi Softmax & SHU',
    desc: 'Menghitung distribusi probabilitas 7 varietas cabai serta estimasi skala kepedasan Scoville Heat Units.',
    icon: '🎯',
    accent: 'from-emerald-500 to-teal-500',
  },
];

export default function TentangPage() {
  const [totalDataset, setTotalDataset] = useState(1428);
  const [imgError, setImgError] = useState(false);
  const [rabbitQuoteIndex, setRabbitQuoteIndex] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  
  // Dev Easter Egg States
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [easterEggQuoteIdx, setEasterEggQuoteIdx] = useState(0);
  const [easterEggParticles, setEasterEggParticles] = useState([]);
  const audioCtxRef = useRef(null);

  const playEasterEggSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Sweet 4-note bell chime: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // ignore
    }
  };

  const triggerDevEasterEgg = () => {
    playEasterEggSound();
    setEasterEggActive(true);
    setEasterEggQuoteIdx((prev) => (prev + 1) % DEV_EASTER_EGG_QUOTES.length);

    // Burst 9 particles
    const emojis = ['🌸', '✨', '💖', '🎓', '⭐', '🌷', '🥰', '🌶️', '💕'];
    const newParticles = Array.from({ length: 9 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[i % emojis.length],
      dx: `${(Math.random() - 0.5) * 160}px`,
      dy: `${-35 - Math.random() * 80}px`,
      size: 14 + Math.floor(Math.random() * 6),
    }));
    setEasterEggParticles(newParticles);

    setTimeout(() => {
      setEasterEggParticles([]);
    }, 1400);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/dataset/count`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total === 'number') setTotalDataset(data.total);
      })
      .catch((err) => console.error('Gagal mengambil jumlah dataset:', err));
  }, []);

  const handleNextQuote = () => {
    setIsTalking(true);
    setRabbitQuoteIndex((prev) => (prev + 1) % RESEARCH_RABBIT_QUOTES.length);
    setTimeout(() => setIsTalking(false), 350);
  };

  const METRICS = [
    {
      label: 'Arsitektur Model',
      value: 'MobileNetV2',
      desc: 'Arsitektur CNN berbasis Transfer Learning ImageNet berkinerja tinggi.',
      icon: '🧠',
      accent: 'from-rose-500 to-red-500',
      badge: 'EfficientNet CNN',
      isCounter: false,
    },
    {
      label: 'Total Dataset',
      value: totalDataset,
      desc: 'Citra berkualitas tinggi yang terbagi dalam set pelatihan dan uji.',
      icon: '📊',
      accent: 'from-amber-500 to-orange-500',
      badge: 'Latih & Uji',
      isCounter: true,
    },
    {
      label: 'Tingkat Akurasi',
      value: '95.1%',
      desc: 'Skor akurasi validasi optimal pada 7 kelas varietas cabai nusantara.',
      icon: '⭐',
      accent: 'from-purple-500 to-pink-500',
      badge: 'Validation Score',
      isCounter: false,
    },
    {
      label: 'Teknik Augmentasi',
      value: '4 Metode',
      desc: 'Rotasi, Zoom, Flip Horizontal, dan Penyesuaian Kontras Citra.',
      icon: '🔄',
      accent: 'from-emerald-500 to-teal-500',
      badge: 'Data Augmentation',
      isCounter: false,
    },
  ];

  return (
    <div className="space-y-8 relative pb-20">
      
      {/* ── Ambient Background Glows ── */}
      <div className="pointer-events-none absolute -top-16 -right-12 w-96 h-96 rounded-full bg-rose-200/35 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 -left-16 w-80 h-80 rounded-full bg-pink-100/40 blur-3xl -z-10" />

      {/* ── HEADER HALAMAN TENTANG ── */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Informasi Riset &amp; Metodologi Sistem</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight flex items-center gap-2">
              <span>Tentang Aplikasi &amp; Riset AI</span>
              <span className="text-2xl">📖</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Dokumentasi teknis metodologi penelitian kecerdasan buatan, arsitektur *deep learning* MobileNetV2, serta profil pengembang sistem.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-rose-100 shadow-2xs">
            <InteractiveRabbitSVG size={36} isTalking={isTalking} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-rose-600 uppercase">Lab Asisten AI</p>
              <p className="text-xs font-semibold text-stone-800">Kelinci Peneliti Cerdas</p>
            </div>
          </div>
        </div>

        {/* ── BANNER EDUKASI INTERAKTIF DARI KELINCI RISET ── */}
        <div 
          onClick={handleNextQuote}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-50/90 via-pink-50/60 to-white border border-rose-100/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs cursor-pointer hover:shadow-md transition-all group"
          title="Klik untuk mendengarkan insight riset lainnya dari kelinci!"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
              <InteractiveRabbitSVG size={42} isTalking={isTalking} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600">Catatan Riset Kelinci:</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.2 rounded-full font-bold">
                  Insight #{rabbitQuoteIndex + 1}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                "{RESEARCH_RABBIT_QUOTES[rabbitQuoteIndex]}"
              </p>
            </div>
          </div>

          <button
            type="button"
            className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-white text-rose-600 border border-rose-200 text-xs font-bold shadow-2xs group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0"
          >
            Insight Lainnya ➔
          </button>
        </div>
      </header>

      {/* ── BENTO GRID METRIK RISET (4 KOLOM SEIMBANG) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">Metrik &amp; Parameter Model</h2>
            <span className="text-base">📊</span>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Transfer Learning ImageNet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m, idx) => (
            <div
              key={m.label}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="p-5 rounded-3xl border border-rose-100/90 bg-white/95 backdrop-blur-xs hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(244,63,94,0.09)] hover:border-rose-300 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Garis Aksen Gradien Atas */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.accent} group-hover:h-1.5 transition-all duration-300`} />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    {m.label}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-base shadow-2xs group-hover:scale-110 transition-transform">
                    {m.icon}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight group-hover:text-rose-600 transition-colors">
                    {m.isCounter ? <AnimatedCounter target={m.value} /> : m.value}
                  </p>
                  <p className="text-xs mt-2 text-stone-600 leading-relaxed font-medium">
                    {m.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-rose-100/80 flex items-center justify-between text-[11px]">
                <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                  {m.badge}
                </span>
                <span className="text-stone-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all duration-200 font-bold">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALUR PIPELINE PEMROSESAN AI (4 LANGKAH JELAS) ── */}
      <section className="p-6 sm:p-7 rounded-3xl border border-rose-100/90 bg-white/95 backdrop-blur-xs shadow-[0_12px_36px_rgba(244,63,94,0.06)] space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">Alur Pemrosesan Citra MobileNetV2</h2>
            <span className="text-base">🔬⚡</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Tahapan transformasi piksel gambar mentah menjadi estimasi kepedasan Scoville yang presisi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((pipe) => (
            <div
              key={pipe.step}
              className="p-5 rounded-2xl border border-rose-100/80 bg-gradient-to-br from-rose-50/30 to-white hover:border-rose-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${pipe.accent} text-white font-black text-xs flex items-center justify-center shadow-xs font-mono`}>
                  {pipe.step}
                </span>
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{pipe.icon}</span>
              </div>

              <h3 className="font-bold text-stone-900 mt-4 text-xs sm:text-sm group-hover:text-rose-600 transition-colors">
                {pipe.title}
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {pipe.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARSITEKTUR TEKNOLOGI & PROFIL PENGEMBANG (SIDE BY SIDE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ── KOLOM KIRI (COL 7): ARSITEKTUR & STACK SISTEM ── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 space-y-5 border border-rose-100/90 bg-white/95 backdrop-blur-xs shadow-[0_12px_36px_rgba(244,63,94,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  <span>🏗️</span>
                  <span>Arsitektur &amp; Teknologi Sistem</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">Komponen full-stack modern yang menggerakkan ChiliDetect</p>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 shadow-2xs">
                Full Stack AI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {TECH_STACK.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between p-4 rounded-2xl border border-rose-100/80 bg-stone-50/50 hover:bg-rose-50/60 hover:border-rose-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-lg shadow-2xs group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100/80 text-rose-700">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-700 mt-0.5">{item.role}</p>
                      <p className="text-[10px] text-stone-500 mt-1 font-mono">{item.tech}</p>
                    </div>
                  </div>

                  <span className="text-stone-400 group-hover:text-rose-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all font-bold text-xs shrink-0">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── KOLOM KANAN (COL 5): PROFIL PENGEMBANG & SETTINGS ── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card Profil Pengembang */}
          <div className="rounded-3xl p-6 sm:p-7 space-y-5 border border-rose-100/90 bg-white/95 backdrop-blur-xs shadow-[0_12px_36px_rgba(244,63,94,0.08)] relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  <span>👨‍💻</span>
                  <span>Profil Pengembang</span>
                </h2>

                {/* 🐰 Petunjuk Balon Interaktif dari Maskot Kelinci */}
                <button
                  type="button"
                  onClick={triggerDevEasterEgg}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50/80 text-rose-700 border border-rose-200/90 hover:border-rose-300 hover:from-rose-100 hover:to-pink-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xs cursor-pointer group/cue"
                  title="Klik untuk menyapa dan melihat pesan apresiasi pengembang!"
                >
                  <span className="text-xs group-hover/cue:animate-bounce">🐰</span>
                  <span>Klik foto pengembang yuk!</span>
                  <span className="text-rose-500 text-[10px]">✨</span>
                </button>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Aktif
              </span>
            </div>

            {/* Profile Avatar & Info dengan Dev Easter Egg Trigger */}
            <div 
              onClick={triggerDevEasterEgg}
              className="relative flex items-center gap-4 pt-1 cursor-pointer group select-none p-2 -m-2 rounded-2xl hover:bg-rose-50/40 transition-colors"
              title="Klik foto atau nama pengembang untuk kejutan pesan apresiasi! ✨"
            >
              {/* Floating Fountain Particles saat Easter Egg aktif */}
              {easterEggParticles.map((p) => (
                <span
                  key={p.id}
                  className="pointer-events-none absolute left-8 top-6 z-50 animate-fountain-particle select-none"
                  style={{
                    '--f-dx': p.dx,
                    '--f-dy': p.dy,
                    fontSize: `${p.size}px`,
                  }}
                >
                  {p.emoji}
                </span>
              ))}

              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 shadow-md shadow-rose-500/20 flex-shrink-0 group-hover:scale-105 active:scale-95 transition-all duration-300">
                {/* Glowing halo on hover */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400 to-amber-300 opacity-0 group-hover:opacity-40 blur-xs transition-opacity -z-10" />

                <div className="w-full h-full rounded-full overflow-hidden bg-white ring-2 ring-white">
                  {!imgError ? (
                    <img
                      src="/images/foto-my.jpg"
                      alt="Foto Profil Muhammad Narya Nardiansah"
                      className="w-full h-full object-cover object-top group-hover:scale-115 transition-transform duration-500 ease-out"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                      NN
                    </div>
                  )}
                </div>
                <span
                  className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white shadow-sm font-bold animate-bounce"
                  title="Pengembang Terverifikasi"
                >
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug font-display group-hover:text-rose-600 transition-colors">
                    Muhammad Narya Nardiansah
                  </h3>
                  <span className="text-xs group-hover:scale-125 transition-transform">✨</span>
                </div>
                <p className="text-xs font-mono font-semibold text-rose-600 mt-0.5">
                  NIM: 2301091015
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    Front-End &amp; AI Web Developer
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400 group-hover:text-rose-500 transition-colors hidden sm:inline">
                    👆 Klik untuk sapa
                  </span>
                </div>
              </div>
            </div>

            {/* Balon Dialog Easter Egg Pengembang */}
            {easterEggActive && (
              <div 
                className="relative p-4 rounded-2xl bg-gradient-to-r from-rose-50/95 via-pink-50/80 to-amber-50/70 border border-rose-200/90 shadow-md animate-bubble-pop"
              >
                {/* Segitiga Panah Balon Menunjuk ke Atas */}
                <div className="absolute -top-1.5 left-9 w-3.5 h-3.5 bg-rose-50 border-t border-l border-rose-200/90 rotate-45 transform" />

                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <InteractiveRabbitSVG size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                        <span>Pesan Apresiasi Pengembang</span>
                        <span>🎓✨</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEasterEggActive(false);
                        }}
                        className="text-stone-400 hover:text-rose-600 text-xs font-bold px-1 transition-colors cursor-pointer"
                        aria-label="Tutup pesan"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs text-stone-800 font-semibold mt-1.5 leading-relaxed">
                      "{DEV_EASTER_EGG_QUOTES[easterEggQuoteIdx]}"
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-rose-100 flex items-center justify-between text-[10px] text-stone-500">
                      <span className="font-semibold text-rose-600">Politeknik Negeri Padang · 2026</span>
                      <span className="italic text-stone-400">Klik lagi untuk pesan baru ➔</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tautan Portofolio & GitHub */}
            <div className="pt-1 flex flex-col gap-2">
              <a
                href="http://103.18.76.90/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-100/70 border border-rose-100 hover:border-rose-300 text-xs font-bold text-rose-700 transition-all duration-200 group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="group-hover:scale-125 transition-transform duration-200">🌐</span>
                  <span>Kunjungi Portofolio Web</span>
                </div>
                <span className="group-hover:translate-x-1.5 transition-transform font-bold">↗</span>
              </a>

              <a
                href="https://github.com/NaryaNardiansah/capstone_project"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 hover:text-stone-900 transition-all duration-200 group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="group-hover:scale-125 transition-transform duration-200">🐙</span>
                  <span>GitHub Repository</span>
                </div>
                <span className="group-hover:translate-x-1.5 transition-transform font-bold">↗</span>
              </a>
            </div>

            <div className="h-px w-full bg-rose-100/80 my-2" />

            {/* Meta Info Akademik */}
            <div className="space-y-3">
              {[
                { label: 'Program Studi', value: 'Manajemen Informasi', icon: '🎓' },
                { label: 'Jurusan', value: 'Teknologi Informasi', icon: '🏛️' },
                { label: 'Institusi', value: 'Politeknik Negeri Padang', icon: '🏫' },
                { label: 'Tahun Kelulusan', value: '2026', icon: '📅' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <span className="font-bold text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
