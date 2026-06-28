'use client';
import { useEffect, useRef, useState } from 'react';

const METRICS = [
  {
    label: 'Arsitektur Model',
    value: 'MobileNetV2',
    desc: 'Arsitektur efisien berbasis CNN untuk perangkat komputasi terbatas.',
    icon: (
      <svg className="w-5 h-5" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Dataset',
    value: '320',
    isnum: true,
    desc: 'Citra berkualitas tinggi yang terbagi dalam set pelatihan dan validasi.',
    icon: (
      <svg className="w-5 h-5" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    label: 'Komposisi Data',
    value: '60% Pasar · 40% Kaggle',
    desc: 'Penggabungan data lapangan pasar lokal dan dataset benchmark publik.',
    icon: (
      <svg className="w-5 h-5" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
  },
  {
    label: 'Augmentasi Citra',
    value: 'Rotasi, Zoom, Flip, Shift',
    desc: 'Rekayasa variasi gambar untuk meningkatkan ketahanan akurasi model.',
    icon: (
      <svg className="w-5 h-5" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

const STACK = [
  { name: 'Next.js', role: 'Frontend UI Framework', dot: '#000000', link: 'https://nextjs.org' },
  { name: 'FastAPI', role: 'Backend REST API', dot: '#009688', link: 'https://fastapi.tiangolo.com' },
  { name: 'MobileNetV2', role: 'CNN Deep Learning Model', dot: '#dc2626', link: 'https://keras.io/api/applications/mobilenet/' },
  { name: 'SQLite', role: 'Relational Database Store', dot: '#003b57', link: 'https://www.sqlite.org' },
];

const DEV_INFO = [
  { label: 'Program Studi', value: 'Teknologi Rekayasa Perangkat Lunak' },
  { label: 'Jurusan', value: 'Teknologi Informasi' },
  { label: 'Institusi', value: 'Politeknik Negeri Padang' },
];

function buildRoundedRectPath(w, h, offset = 16, r = 28) {
  const x0 = -offset;
  const y0 = -offset;
  const x1 = w + offset;
  const y1 = h + offset;
  return `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
}

export default function TentangPage() {
  const headRef = useRef(null);
  const subRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const bentoRefs = useRef([]);
  const techRefs = useRef([]);
  const bgOrbRef1 = useRef(null);
  const bgOrbRef2 = useRef(null);
  const devCardRef = useRef(null);
  const rabbitsRef = useRef([]);
  const rabbitTrackContainerRef = useRef(null);
  const devPhotoRef = useRef(null);
  const devNameRef = useRef(null);
  const devInfoRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [trackSize, setTrackSize] = useState(null);
  const rabbitSpeedRef = useRef(1);

  useEffect(() => {
    const el = rabbitTrackContainerRef.current;
    if (!el) return;

    const updateTrackSize = () => {
      const { width, height } = el.getBoundingClientRect();
      setTrackSize({ w: width, h: height });
    };

    updateTrackSize();
    const observer = new ResizeObserver(updateTrackSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Rabbit motionpath animation ──
  useEffect(() => {
    if (!trackSize) return;

    let gsapCtx;
    let cancelled = false;

    (async () => {
      const { gsap } = await import('gsap');
      const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
      if (cancelled) return;

      const pathEl = document.querySelector('#rabbit-track');
      if (!pathEl || pathEl.tagName.toLowerCase() !== 'path') return;

      gsap.registerPlugin(MotionPathPlugin);
      const rabbits = rabbitsRef.current.filter(Boolean);
      if (rabbits.length === 0) return;

      const path = '#rabbit-track';
      const speeds = [10, 14, 8, 12];
      const offsets = [0, 0.25, 0.5, 0.75];

      gsapCtx = gsap.context(() => {
        rabbits.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
              start: offsets[i],
              end: offsets[i] + 1,
            },
            duration: speeds[i] * rabbitSpeedRef.current,
            ease: 'none',
            repeat: -1,
            id: `rabbit-${i}`,
          });
        });
      });
    })();

    return () => {
      cancelled = true;
      gsapCtx?.revert();
    };
  }, [trackSize]);

  const handleCardHover = (entering) => {
    setIsHovered(entering);
    import('gsap').then(({ gsap }) => {
      const newSpeed = entering ? 0.5 : 1;
      rabbitSpeedRef.current = newSpeed;
      rabbitsRef.current.filter(Boolean).forEach((_, i) => {
        const tween = gsap.getById(`rabbit-${i}`);
        if (!tween) return;
        gsap.to(tween, { timeScale: entering ? 2.5 : 1, duration: 0.4, ease: 'power2.out' });
      });
    });
  };

  const handleCardMagnetic = (e) => {
    if (!devCardRef.current) return;
    const { left, top, width, height } = devCardRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.08;
    const y = (e.clientY - (top + height / 2)) * 0.08;
    import('gsap').then(({ gsap }) => {
      gsap.to(devCardRef.current, { x, y, duration: 0.4, ease: 'power2.out' });
    });
  };

  const handleCardMagneticLeave = () => {
    import('gsap').then(({ gsap }) => {
      gsap.to(devCardRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  };


  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      // Background movement
      gsap.to(bgOrbRef1.current, { x: 30, y: -25, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(bgOrbRef2.current, { x: -30, y: 30, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      // Entrances
      gsap.fromTo(headRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo(subRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.15 });

      gsap.fromTo(card1Ref.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.25 });
      gsap.fromTo(bentoRefs.current.filter(Boolean),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: 'power2.out', delay: 0.4 }
      );

      gsap.fromTo(card2Ref.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.5 });
      gsap.fromTo(techRefs.current.filter(Boolean),
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, duration: 0.35, ease: 'power2.out', delay: 0.6 }
      );

      gsap.fromTo(card3Ref.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.5 });

      // Counter numbers reveal
      bentoRefs.current.forEach((el) => {
        if (!el) return;
        const numEl = el.querySelector('.counter-val');
        if (numEl && numEl.dataset.target) {
          const target = parseInt(numEl.dataset.target, 10);
          gsap.fromTo({ val: 0 },
            { val: 0 },
            {
              val: target,
              duration: 1.5,
              ease: 'power2.out',
              delay: 0.8,
              onUpdate: function () {
                numEl.textContent = Math.round(this.targets()[0].val);
              }
            }
          );
        }
      });
    });
  }, []);

  return (
    <div className="relative min-h-screen pb-16 select-none">
      
      {/* ── BACKGROUND ORBS ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div ref={bgOrbRef1} className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ backgroundColor: '#fecdd3', opacity: 0.35 }} />
        <div ref={bgOrbRef2} className="absolute bottom-1/4 left-1/3 w-[360px] h-[360px] rounded-full blur-[90px]" style={{ backgroundColor: '#ffe4e6', opacity: 0.3 }} />
      </div>

      {/* ── HEADER ── */}
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full" style={{ backgroundColor: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}>
          Informasi &amp; Metodologi
        </div>
        <h1 ref={headRef} className="text-[2.2rem] font-extrabold tracking-tight flex items-center gap-2" style={{ color: '#881337' }}>
          Tentang Aplikasi
          <span className="w-1.5 h-1.5 rounded-full animate-pulse mt-3" style={{ backgroundColor: '#fda4af' }} />
        </h1>
        <p ref={subRef} className="text-base font-light" style={{ color: '#be123c' }}>
          Metodologi penelitian dan detail teknis sistem klasifikasi.
        </p>
      </div>

      {/* ── METHODOLOGY CONTAINER ── */}
      <div
        ref={card1Ref}
        className="rounded-3xl p-8 space-y-6 mb-8"
        style={{ backgroundColor: '#fff', border: '1px solid #fecdd3', boxShadow: '0 4px 30px rgba(244,63,94,0.05)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: '#fda4af' }} />
          <h2 className="text-base font-bold" style={{ color: '#881337' }}>Metodologi Penelitian</h2>
        </div>

        <p className="text-sm leading-relaxed max-w-3xl font-light" style={{ color: '#be123c' }}>
          Sistem ini dikembangkan menggunakan pendekatan <strong className="font-semibold" style={{ color: '#881337' }}>Deep Learning</strong> dengan{' '}
          <strong className="font-semibold" style={{ color: '#881337' }}>Convolutional Neural Network (CNN)</strong> dan teknik{' '}
          <strong className="font-semibold" style={{ color: '#881337' }}>Transfer Learning</strong> berbasis arsitektur MobileNetV2 yang telah
          dilatih sebelumnya pada dataset ImageNet.
        </p>

        {/* Bento Grid Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              ref={(el) => (bentoRefs.current[i] = el)}
              className="rounded-2xl p-5 flex flex-col justify-between min-h-[140px]"
              style={{ border: '1px solid #fecdd3', backgroundColor: '#fff8f8' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>{m.label}</span>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
                  {m.icon}
                </span>
              </div>
              <div className="mt-4">
                {m.isnum ? (
                  <p className="text-2xl font-black font-mono" style={{ color: '#881337' }}>
                    ±<span className="counter-val" data-target={m.value}>0</span>
                  </p>
                ) : (
                  <p className="text-sm font-extrabold" style={{ color: '#881337' }}>{m.value}</p>
                )}
                <p className="text-[10px] mt-1 leading-normal" style={{ color: '#fda4af' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ARSITEKTUR & PENGEMBANG (Side by side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Column Left: Arsitektur Sistem */}
        <div
          ref={card2Ref}
          className="lg:col-span-3 rounded-3xl p-8 space-y-6"
          style={{ backgroundColor: '#fff', border: '1px solid #fecdd3', boxShadow: '0 4px 30px rgba(244,63,94,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: '#fda4af' }} />
            <h2 className="text-base font-bold" style={{ color: '#881337' }}>Arsitektur Sistem</h2>
          </div>

          <div className="space-y-3">
            {STACK.map((item, i) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                ref={(el) => (techRefs.current[i] = el)}
                className="flex items-center justify-between p-3.5 rounded-2xl transition-colors group cursor-pointer"
                style={{ border: '1px solid #fecdd3', backgroundColor: '#fffafa' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fffafa'}
              >
                <div className="flex items-center gap-4">
                  {/* Number */}
                  <span className="text-xs font-bold font-mono w-5" style={{ color: '#fecdd3' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Color-coded dot */}
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ backgroundColor: item.dot }}
                  />
                  {/* Name */}
                  <span className="text-sm font-extrabold" style={{ color: '#881337' }}>{item.name}</span>
                </div>
                {/* Role */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium" style={{ color: '#fda4af' }}>{item.role}</span>
                  <svg className="w-3.5 h-3.5 transition-colors transform group-hover:translate-x-1 duration-200" style={{ color: '#fecdd3' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Column Right: Pengembang — Premium Rabbit Card */}
        <div ref={rabbitTrackContainerRef} className="lg:col-span-2 relative">
          {/* ── RABBIT SVG PATH + RUNNERS ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            style={{ zIndex: 20 }}
            aria-hidden="true"
          >
            {/* MotionPathPlugin requires a <path>, not <rect> */}
            {trackSize && (
              <path
                id="rabbit-track"
                d={buildRoundedRectPath(trackSize.w, trackSize.h)}
                fill="none"
                stroke="none"
              />
            )}
            {/* 4 running rabbit SVGs */}
            {[0, 1, 2, 3].map((i) => {
              const sizes = [20, 16, 22, 18];
              const colors = ['#f43f5e', '#fb7185', '#e11d48', '#fda4af'];
              const sz = sizes[i];
              return (
                <g
                  key={i}
                  ref={(el) => (rabbitsRef.current[i] = el)}
                  style={{ transformOrigin: `${sz / 2}px ${sz / 2}px` }}
                >
                  {/* Cute minimalist rabbit SVG */}
                  <svg width={sz} height={sz} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" x={-sz/2} y={-sz/2}>
                    {/* Ears */}
                    <ellipse cx="11" cy="8" rx="3" ry="6" fill={colors[i]} opacity="0.9" />
                    <ellipse cx="21" cy="8" rx="3" ry="6" fill={colors[i]} opacity="0.9" />
                    <ellipse cx="11" cy="8" rx="1.5" ry="4" fill="#ffe4e6" />
                    <ellipse cx="21" cy="8" rx="1.5" ry="4" fill="#ffe4e6" />
                    {/* Body */}
                    <ellipse cx="16" cy="20" rx="9" ry="8" fill={colors[i]} />
                    {/* Head */}
                    <circle cx="16" cy="14" r="7" fill={colors[i]} />
                    {/* Eyes */}
                    <circle cx="13.5" cy="13" r="1.2" fill="#881337" />
                    <circle cx="18.5" cy="13" r="1.2" fill="#881337" />
                    <circle cx="14" cy="12.5" r="0.4" fill="white" />
                    <circle cx="19" cy="12.5" r="0.4" fill="white" />
                    {/* Nose */}
                    <ellipse cx="16" cy="15.5" rx="1" ry="0.7" fill="#9f1239" />
                    {/* Tail */}
                    <circle cx="25" cy="22" r="3" fill="#ffe4e6" />
                    {/* Front legs running */}
                    <ellipse cx="10" cy="27" rx="2.5" ry="1.5" fill={colors[i]} transform="rotate(-20 10 27)" />
                    <ellipse cx="22" cy="27" rx="2.5" ry="1.5" fill={colors[i]} transform="rotate(20 22 27)" />
                  </svg>
                </g>
              );
            })}
          </svg>

          {/* ── ACTUAL CARD ── */}
          <div
            ref={(el) => { card3Ref.current = el; devCardRef.current = el; }}
            className="relative rounded-3xl p-7 space-y-5 overflow-hidden cursor-default"
            style={{
              backgroundColor: '#fff',
              border: '2px solid #fecdd3',
              boxShadow: isHovered
                ? '0 20px 60px rgba(244,63,94,0.18), 0 0 0 4px rgba(253,164,175,0.2)'
                : '0 4px 30px rgba(244,63,94,0.08)',
              transition: 'box-shadow 0.4s ease, transform 0.4s ease',
              zIndex: 10,
            }}
            onMouseEnter={() => handleCardHover(true)}
            onMouseLeave={() => { handleCardHover(false); handleCardMagneticLeave(); }}
            onMouseMove={handleCardMagnetic}
          >
            {/* Rose gradient mesh background */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #fffafa 50%, #fce7f3 100%)',
              opacity: 0.6,
            }} />
            {/* Floating blur orbs inside card */}
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: '#fecdd3', opacity: 0.4 }} />
            <div className="absolute bottom-8 left-4 w-20 h-20 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: '#ffe4e6', opacity: 0.5 }} />

            {/* ── SECTION TITLE ── */}
            <div className="relative flex items-center gap-2.5">
              <span className="w-[3px] h-5 rounded-full" style={{ backgroundColor: '#f43f5e' }} />
              <h2 className="text-base font-bold tracking-tight" style={{ color: '#881337' }}>Pengembang</h2>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff1f2', color: '#f43f5e', border: '1px solid #fecdd3' }}>2026</span>
            </div>

            {/* ── PROFILE HEADER: Photo + Name ── */}
            <div className="relative flex items-center gap-4 pt-1">
              {/* Photo ring */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'conic-gradient(from 0deg, #f43f5e, #fb7185, #fecdd3, #f43f5e)',
                  padding: '2px',
                  borderRadius: '9999px',
                  transform: 'scale(1.1)',
                  animation: 'spin 8s linear infinite',
                }} />
                <div
                  ref={devPhotoRef}
                  className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white"
                  style={{ boxShadow: '0 4px 16px rgba(244,63,94,0.25)' }}
                >
                  {!imgError ? (
                    <img
                      src="/images/foto-my.jpg"
                      alt="Foto profil Difa Fadhilah"
                      className="w-full h-full object-cover object-top"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-black" style={{ backgroundColor: '#fecaca', color: '#9f1239' }}>D</div>
                  )}
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: '#22c55e' }} />
              </div>

              {/* Name & NIM */}
              <div className="min-w-0 flex-1">
                <h3
                  ref={devNameRef}
                  className="text-lg font-extrabold leading-tight tracking-tight"
                  style={{ color: '#881337' }}
                >
                  Difa Fadhilah
                </h3>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: '#fda4af' }}>2311081010</p>
                {/* Role badge */}
                <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff1f2', color: '#f43f5e', border: '1px solid #fecdd3' }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  Full-Stack Dev
                </span>
              </div>
            </div>

            {/* ── GRADIENT DIVIDER ── */}
            <div className="relative h-px w-full" style={{
              background: 'linear-gradient(90deg, #f43f5e, #fb7185, #fecdd3, transparent)',
            }} />

            {/* ── META INFO ── */}
            <div ref={devInfoRef} className="relative space-y-3">
              {[
                { label: 'Program Studi', value: 'Teknologi Rekayasa Perangkat Lunak', icon: '🎓' },
                { label: 'Jurusan', value: 'Teknologi Informasi', icon: '💻' },
                { label: 'Institusi', value: 'Politeknik Negeri Padang', icon: '🏛️' },
                { label: 'Tahun Lulus', value: '2026', icon: '📅', mono: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                  style={{}}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#fda4af' }}>{item.label}</p>
                    <p className={`text-sm font-semibold leading-snug ${item.mono ? 'font-mono' : ''}`} style={{ color: '#881337' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── FOOTER: Rabbit emoji hint ── */}
            <div className="relative flex items-center justify-center gap-1 pt-1" style={{ color: '#fda4af' }}>
              <span className="text-[9px] font-bold uppercase tracking-widest">Kelinci menjaga proyek ini 🐰</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
