'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { buildRoundedRectPath } from '../klasifikasi/CardRabbitTrack';

const ALL_RABBITS = [
  { size: 14, color: '#fda4af', duration: 10, offset: 0, reverse: false },
  { size: 18, color: '#fb7185', duration: 14, offset: 0.125, reverse: true },
  { size: 16, color: '#f43f5e', duration: 11, offset: 0.25, reverse: false },
  { size: 22, color: '#e11d48', duration: 9, offset: 0.375, reverse: true },
  { size: 15, color: '#fda4af', duration: 16, offset: 0.5, reverse: false },
  { size: 20, color: '#fb7185', duration: 12, offset: 0.625, reverse: true },
  { size: 24, color: '#f43f5e', duration: 8, offset: 0.75, reverse: false },
  { size: 17, color: '#fda4af', duration: 13, offset: 0.875, reverse: true },
];

function RabbitSvg({ size, color, dizzy = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" x={-size / 2} y={-size / 2}>
      <ellipse cx="11" cy="8" rx="3" ry="6" fill={color} opacity="0.9" className="rabbit-ear" />
      <ellipse cx="21" cy="8" rx="3" ry="6" fill={color} opacity="0.9" className="rabbit-ear" />
      <ellipse cx="11" cy="8" rx="1.5" ry="4" fill="#fff1f2" />
      <ellipse cx="21" cy="8" rx="1.5" ry="4" fill="#fff1f2" />
      <ellipse cx="16" cy="20" rx="9" ry="8" fill={color} />
      <circle cx="16" cy="14" r="7" fill={color} />
      {dizzy ? (
        <>
          <text x="12" y="14" fontSize="4" fill="#4c0519" fontWeight="bold">×</text>
          <text x="17" y="14" fontSize="4" fill="#4c0519" fontWeight="bold">×</text>
        </>
      ) : (
        <>
          <circle cx="13.5" cy="13" r="1.2" fill="#4c0519" />
          <circle cx="18.5" cy="13" r="1.2" fill="#4c0519" />
          <circle cx="14" cy="12.5" r="0.4" fill="white" />
          <circle cx="19" cy="12.5" r="0.4" fill="white" />
        </>
      )}
      <ellipse cx="12" cy="15" rx="1.2" ry="0.8" fill="#fda4af" opacity="0.7" />
      <ellipse cx="20" cy="15" rx="1.2" ry="0.8" fill="#fda4af" opacity="0.7" />
      <ellipse cx="16" cy="15.5" rx="1" ry="0.7" fill="#e11d48" />
      <circle cx="25" cy="22" r="3" fill="#ffe4e6" className="rabbit-tail" />
      <ellipse cx="10" cy="27" rx="2.5" ry="1.5" fill={color} transform="rotate(-20 10 27)" className="rabbit-leg" />
      <ellipse cx="22" cy="27" rx="2.5" ry="1.5" fill={color} transform="rotate(20 22 27)" className="rabbit-leg-alt" />
    </svg>
  );
}

function getRabbitCount(width) {
  if (width >= 1024) return 8;
  if (width >= 768) return 4;
  return 3;
}

export default function AuthRabbitTrack({
  children,
  trackId = 'auth-rabbit-track',
  speedMultiplier = 1,
  wobble = false,
  celebrate = false,
  flipKey = 0,
  className = '',
}) {
  const containerRef = useRef(null);
  const rabbitsRef = useRef([]);
  const [trackSize, setTrackSize] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);

  const activeRabbits = useMemo(
    () => ALL_RABBITS.slice(0, getRabbitCount(viewportWidth)),
    [viewportWidth]
  );

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setViewportWidth(window.innerWidth);
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setTrackSize({ w: width, h: height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trackSize || reducedMotion) return;

    let gsapCtx;
    let cancelled = false;

    (async () => {
      const { gsap } = await import('gsap');
      const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
      if (cancelled) return;

      const pathEl = document.querySelector(`#${trackId}`);
      if (!pathEl) return;

      gsap.registerPlugin(MotionPathPlugin);
      const rabbits = rabbitsRef.current.filter(Boolean);
      if (!rabbits.length) return;

      const path = `#${trackId}`;

      gsapCtx = gsap.context(() => {
        rabbits.forEach((el, i) => {
          const cfg = activeRabbits[i];
          if (!el || !cfg) return;

          gsap.fromTo(el, { scale: 0, opacity: 0 }, {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            delay: 2 + i * 0.1,
            ease: 'back.out(1.7)',
          });

          gsap.to(el, {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
              start: cfg.reverse ? cfg.offset + 1 : cfg.offset,
              end: cfg.reverse ? cfg.offset : cfg.offset + 1,
            },
            duration: cfg.duration,
            ease: 'none',
            repeat: -1,
            id: `${trackId}-rabbit-${i}`,
          });

          gsap.to(el.querySelectorAll('.rabbit-ear'), {
            y: -1.5,
            duration: 0.25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          gsap.to(el.querySelector('.rabbit-tail'), {
            rotate: 8,
            duration: 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      });
    })();

    return () => {
      cancelled = true;
      gsapCtx?.revert();
    };
  }, [trackSize, reducedMotion, trackId, activeRabbits, flipKey]);

  useEffect(() => {
    if (reducedMotion) return;
    import('gsap').then(({ gsap }) => {
      activeRabbits.forEach((_, i) => {
        const tween = gsap.getById(`${trackId}-rabbit-${i}`);
        if (!tween) return;
        gsap.to(tween, { timeScale: speedMultiplier, duration: 0.35, ease: 'power2.out' });
      });
    });
  }, [speedMultiplier, trackId, reducedMotion, activeRabbits]);

  useEffect(() => {
    if (!wobble || reducedMotion) return;
    import('gsap').then(({ gsap }) => {
      rabbitsRef.current.filter(Boolean).forEach((el) => {
        gsap.to(el, { rotation: '+=12', duration: 0.08, repeat: 7, yoyo: true, ease: 'sine.inOut' });
      });
    });
  }, [wobble, reducedMotion]);

  useEffect(() => {
    if (!celebrate || reducedMotion) return;
    import('gsap').then(({ gsap }) => {
      activeRabbits.forEach((_, i) => {
        const tween = gsap.getById(`${trackId}-rabbit-${i}`);
        if (tween) gsap.to(tween, { timeScale: 4, duration: 0.2 });
      });
      rabbitsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.to(el, { y: -8, duration: 0.25, repeat: 3, yoyo: true, delay: i * 0.05, ease: 'power2.out' });
      });
    });
  }, [celebrate, reducedMotion, trackId, activeRabbits]);

  useEffect(() => {
    if (reducedMotion || flipKey === 0) return;
    import('gsap').then(({ gsap }) => {
      rabbitsRef.current.filter(Boolean).forEach((el) => {
        gsap.fromTo(el, { scaleX: -1 }, { scaleX: 1, duration: 0.5, ease: 'back.out(1.5)' });
      });
    });
  }, [flipKey, reducedMotion]);

  return (
    <div ref={containerRef} className={`relative overflow-visible ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ zIndex: 40 }}
        aria-hidden="true"
      >
        {trackSize && (
          <path
            id={trackId}
            d={buildRoundedRectPath(trackSize.w, trackSize.h, 16, 36)}
            fill="none"
            stroke="none"
          />
        )}
        {!reducedMotion &&
          activeRabbits.map((cfg, i) => (
            <g
              key={`${flipKey}-${i}`}
              ref={(el) => { rabbitsRef.current[i] = el; }}
              style={{ transformOrigin: `${cfg.size / 2}px ${cfg.size / 2}px`, willChange: 'transform' }}
            >
              <RabbitSvg size={cfg.size} color={cfg.color} dizzy={wobble} />
            </g>
          ))}
      </svg>
      {celebrate && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 45 }} aria-hidden="true">
          {['💕', '🎉', '✨', '💗', '🌸'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-lg animate-bounce"
              style={{
                left: `${15 + i * 18}%`,
                top: `${10 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
