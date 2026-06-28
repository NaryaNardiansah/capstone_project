'use client';
import { useEffect, useRef } from 'react';

const CHILI_TYPES = [
  {
    name: 'Cabai Setan',
    bar:  '#f43f5e',
    heat: 5,
    tag: 'Sangat Pedas',
    tagBg: '#fff1f2',
    tagText: '#be123c',
    desc: 'Bentuk bulat agak gendut, warna orange hingga merah menyala, serta tingkat kepedasan yang sangat tinggi.',
  },
  {
    name: 'Cabai Celeng',
    bar:  '#fb7185',
    heat: 3,
    tag: 'Pedas Sedang',
    tagBg: '#fff1f2',
    tagText: '#e11d48',
    desc: 'Cabai rawit hijau panjang yang sering digunakan untuk lalapan gorengan. Rasa pedas sedang dan renyah.',
  },
  {
    name: 'Cabai Putih',
    bar:  '#fda4af',
    heat: 4,
    tag: 'Pedas Tajam',
    tagBg: '#fff1f2',
    tagText: '#be123c',
    desc: 'Putih gading saat muda, dan merah jingga saat matang. Rasa pedas tajam khas pasar lokal.',
  },
  {
    name: 'Cabai Merah Keriting',
    bar:  '#f43f5e',
    heat: 3,
    tag: 'Pedas Sedang',
    tagBg: '#fff1f2',
    tagText: '#e11d48',
    desc: 'Memiliki bentuk memanjang, ramping, bergelombang/keriting. Rasa pedas sedang untuk bumbu sambal.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Buka Menu Klasifikasi',
    desc: 'Klik menu "Klasifikasi Cabai" di panel navigasi sebelah kiri.',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Unggah Gambar',
    desc: 'Upload gambar cabai rawit dalam format JPG atau PNG.',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Proses & Analisis',
    desc: 'Sistem menganalisis citra menggunakan model MobileNetV2.',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Simpan Riwayat',
    desc: 'Simpan hasil prediksi ke database untuk referensi mendatang.',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
      </svg>
    ),
  },
];

export default function BerandaPage() {
  const heroTitleRef  = useRef(null);
  const heroDescRef   = useRef(null);
  const ctaBtnRef     = useRef(null);
  const statsRefs     = useRef([]);
  const chiliRefs     = useRef([]);
  const stepsRefs     = useRef([]);

  /* ── Magnetic Button ── */
  const handleMagnetic = (e) => {
    const el = ctaBtnRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    import('gsap').then(({ gsap }) => {
      gsap.to(el, {
        x: (e.clientX - (left + width / 2)) * 0.3,
        y: (e.clientY - (top + height / 2)) * 0.3,
        duration: 0.3, ease: 'power2.out',
      });
    });
  };
  const resetMagnetic = () => {
    import('gsap').then(({ gsap }) => {
      gsap.to(ctaBtnRef.current, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1,0.3)' });
    });
  };

  /* ── 3D Card Tilt ── */
  const handleCardTilt = (e, card) => {
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    import('gsap').then(({ gsap }) => {
      gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 700, duration: 0.3, ease: 'power2.out' });
    });
  };
  const resetCardTilt = (card) => {
    if (!card) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' });
    });
  };

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      // ── Hero title — simple fade+slide (no word-split so <br/> is preserved)
      if (heroTitleRef.current) {
        gsap.set(heroTitleRef.current, { opacity: 0, y: 20 });
        gsap.to(heroTitleRef.current, {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.1,
        });
      }

      // Hero desc + CTA
      gsap.fromTo(
        [heroDescRef.current, ctaBtnRef.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.5 }
      );

      // Bento stats
      gsap.fromTo(statsRefs.current.filter(Boolean),
        { scale: 0.93, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)', delay: 0.65 }
      );

      // Counter-up animation
      statsRefs.current.forEach((card) => {
        if (!card) return;
        const numEl = card.querySelector('.counter-val');
        if (numEl && numEl.dataset.target) {
          const target = parseInt(numEl.dataset.target, 10);
          if (!isNaN(target)) {
            gsap.fromTo({ val: 0 }, { val: 0 }, {
              val: target, duration: 1.6, ease: 'power2.out', delay: 1.0,
              onUpdate: function () { numEl.textContent = Math.round(this.targets()[0].val); },
            });
          }
        }
      });

      // Chili cards
      gsap.fromTo(chiliRefs.current.filter(Boolean),
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.85 }
      );

      // Steps
      gsap.fromTo(stepsRefs.current.filter(Boolean),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', delay: 1 }
      );
    });
  }, []);

  return (
    <div className="relative pb-16 select-none">

      {/* ── FIX: Background orbs use fixed positioning so they fill the viewport
              correctly regardless of layout container padding/max-width ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#fecdd3 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
          }}
        />
        {/* Rose orb — top left */}
        <div
          className="absolute rounded-full"
          style={{
            width: 520, height: 520,
            top: -120, left: -120,
            background: 'radial-gradient(circle, #fecdd3 0%, transparent 70%)',
            opacity: 0.55,
          }}
        />
        {/* Rose orb — mid right */}
        <div
          className="absolute rounded-full"
          style={{
            width: 450, height: 450,
            top: '30%', right: -100,
            background: 'radial-gradient(circle, #ffe4e6 0%, transparent 70%)',
            opacity: 0.45,
          }}
        />
        {/* Rose orb — bottom center */}
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            bottom: -80, left: '35%',
            background: 'radial-gradient(circle, #ffd7dd 0%, transparent 70%)',
            opacity: 0.4,
          }}
        />
      </div>

      {/* ── All page content sits above background (z-index > 0) ── */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="space-y-5 pt-2">
          {/* Tech badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Deep Learning · MobileNetV2
          </div>

          {/* ── FIX: No max-w constraint on the h1 itself — rely on parent container max-w
                  Also no overflow-hidden. Words fade in with opacity+y only ── */}
          <h1
            ref={heroTitleRef}
            className="text-3xl md:text-4xl font-extrabold leading-snug tracking-tight"
            style={{ color: '#881337' }}
          >
            Selamat Datang di Sistem Klasifikasi Cabai Rawit Indonesia
          </h1>

          <p
            ref={heroDescRef}
            className="text-base leading-relaxed font-light max-w-xl"
            style={{ color: '#9f1239', opacity: 0 }}
          >
            Aplikasi web ini memanfaatkan arsitektur{' '}
            <strong className="font-semibold" style={{ color: '#be123c' }}>MobileNetV2</strong>{' '}
            modern untuk mendeteksi secara cepat 4 jenis cabai rawit populer langsung dari citra digital Anda.
          </p>

          {/* CTA Button */}
          <div className="pt-1">
            <button
              ref={ctaBtnRef}
              onMouseMove={handleMagnetic}
              onMouseLeave={(e) => {
                resetMagnetic();
                e.currentTarget.style.backgroundColor = '#fecaca';
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fda4af'; }}
              onClick={() => { window.location.href = '/dashboard/klasifikasi'; }}
              className="px-7 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors duration-200"
              style={{
                backgroundColor: '#fecaca',
                color: '#991b1b',
                boxShadow: '0 4px 16px rgba(244,63,94,0.2)',
                opacity: 0,
              }}
            >
              Mulai Klasifikasi Sekarang →
            </button>
          </div>
        </section>

        {/* ── BENTO STATS ── */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Card 1 — Rose featured (2 cols) */}
            <div
              ref={(el) => (statsRefs.current[0] = el)}
              className="md:col-span-2 p-6 rounded-3xl flex flex-col justify-between"
              style={{ backgroundColor: '#fecaca', boxShadow: '0 4px 24px rgba(244,63,94,0.15)' }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#f43f5e' }}>
                  Total Kelas Terdeteksi
                </span>
                <span className="text-lg">🌶️</span>
              </div>
              <div className="mt-10">
                <p className="text-6xl font-black tracking-tight counter-val" style={{ color: '#9f1239' }} data-target="4">0</p>
                <p className="text-sm font-semibold mt-2" style={{ color: '#be123c' }}>Kategori Jenis Cabai Rawit</p>
                <p className="text-xs mt-1" style={{ color: '#fb7185' }}>Setan · Celeng · Putih · Merah Keriting</p>
              </div>
            </div>

            {/* Card 2 — Dataset */}
            <div
              ref={(el) => (statsRefs.current[1] = el)}
              className="p-6 rounded-3xl flex flex-col justify-between bg-white"
              style={{ border: '1px solid #fecdd3', boxShadow: '0 4px 20px rgba(244,63,94,0.05)' }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>Dataset</span>
                <svg className="w-4 h-4" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-extrabold tracking-tight" style={{ color: '#881337' }}>
                  ±<span className="counter-val" data-target="320">0</span>
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#fda4af' }}>Gambar citra latih & uji</p>
              </div>
            </div>

            {/* Card 3 — Arsitektur */}
            <div
              ref={(el) => (statsRefs.current[2] = el)}
              className="p-6 rounded-3xl flex flex-col justify-between"
              style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', boxShadow: '0 4px 20px rgba(244,63,94,0.05)' }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>Arsitektur</span>
                <svg className="w-4 h-4" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-extrabold tracking-tight" style={{ color: '#881337' }}>CNN</p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#fda4af' }}>MobileNetV2 Layer</p>
              </div>
            </div>

            {/* Card 4 — Tahun (wide, 2 cols) */}
            <div
              ref={(el) => (statsRefs.current[3] = el)}
              className="md:col-span-2 p-6 rounded-3xl flex items-center justify-between bg-white"
              style={{ border: '1px solid #fecdd3', boxShadow: '0 4px 20px rgba(244,63,94,0.05)' }}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#fda4af' }}>Tahun Akademik</span>
                <p className="text-3xl font-extrabold tracking-tight" style={{ color: '#881337' }}>2026</p>
                <p className="text-xs font-medium" style={{ color: '#fda4af' }}>Politeknik Negeri Padang</p>
              </div>
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#fff1f2', color: '#fda4af' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 019.918 5.842 50.45 50.45 0 00-2.658.814m-15.482 0a50.503 50.503 0 0115.482 0" />
                </svg>
              </div>
            </div>

          </div>
        </section>

        {/* ── JENIS CABAI ── */}
        <section className="mt-14">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: '#fda4af' }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#fda4af' }}>4 Kelas</p>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: '#881337' }}>Jenis Cabai yang Dideteksi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHILI_TYPES.map((c, i) => (
              <div
                key={c.name}
                ref={(el) => (chiliRefs.current[i] = el)}
                onMouseMove={(e) => handleCardTilt(e, chiliRefs.current[i])}
                onMouseLeave={() => resetCardTilt(chiliRefs.current[i])}
                className="rounded-3xl p-5 flex flex-col justify-between cursor-default bg-white"
                style={{
                  border: '1px solid #fecdd3',
                  boxShadow: '0 4px 20px rgba(244,63,94,0.06)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: c.bar }} />
                      <h3 className="font-extrabold text-base leading-snug" style={{ color: '#881337' }}>{c.name}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: c.tagBg, color: c.tagText }}>
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-sm mt-3 leading-relaxed font-light" style={{ color: '#be123c' }}>{c.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4" style={{ borderTop: '1px solid #fecdd3' }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>Level Kepedasan</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <span key={d} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d <= c.heat ? c.bar : '#ffe4e6' }} />
                      ))}
                    </div>
                    <span className="text-xs font-black" style={{ color: c.bar }}>{c.heat}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CARA PENGGUNAAN ── */}
        <section className="mt-14">
          <div className="flex items-center gap-3 mb-9">
            <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: '#fda4af' }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#fda4af' }}>Alur Cepat</p>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: '#881337' }}>Cara Penggunaan</h2>
          </div>

          <div className="relative space-y-8">
            {/* Center timeline connector */}
            <div
              className="absolute left-1/2 top-3 bottom-3 w-px hidden md:block -translate-x-1/2"
              style={{ backgroundColor: '#fecdd3' }}
            />

            {STEPS.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={s.num}
                  ref={(el) => (stepsRefs.current[i] = el)}
                  className={`flex flex-col md:flex-row items-center gap-5 md:gap-8 relative w-full ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Step card */}
                  <div className="flex-1 w-full">
                    <div
                      className="p-5 rounded-2xl bg-white"
                      style={{
                        border: '1px solid #fecdd3',
                        boxShadow: '0 4px 14px rgba(244,63,94,0.06)',
                        textAlign: isEven ? 'right' : 'left',
                      }}
                    >
                      <span className="text-3xl font-black" style={{ color: '#fecdd3' }}>{s.num}</span>
                      <h3 className="text-sm font-extrabold mt-1.5" style={{ color: '#881337' }}>{s.title}</h3>
                      <p className="text-xs leading-relaxed mt-1 font-light" style={{ color: '#be123c' }}>{s.desc}</p>
                    </div>
                  </div>

                  {/* Center icon node */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                    style={{
                      backgroundColor: '#fff1f2',
                      color: '#f43f5e',
                      border: '1px solid #fecdd3',
                      boxShadow: '0 4px 12px rgba(244,63,94,0.1)',
                    }}
                  >
                    {s.icon}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </section>

      </div>{/* end z-index wrapper */}
    </div>
  );
}
