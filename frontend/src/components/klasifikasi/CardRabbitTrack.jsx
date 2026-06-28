'use client';
import { useEffect, useRef, useState } from 'react';

export function buildRoundedRectPath(w, h, offset = 14, r = 32) {
  const x0 = -offset;
  const y0 = -offset;
  const x1 = w + offset;
  const y1 = h + offset;
  return `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
}

const RABBIT_CONFIG = [
  { size: 16, color: '#f43f5e', duration: 12, offset: 0, reverse: false },
  { size: 22, color: '#fb7185', duration: 9, offset: 0.2, reverse: true },
  { size: 14, color: '#fda4af', duration: 15, offset: 0.4, reverse: false },
  { size: 20, color: '#e11d48', duration: 11, offset: 0.6, reverse: true },
  { size: 18, color: '#f43f5e', duration: 13, offset: 0.8, reverse: false },
];

function RabbitSvg({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" x={-size / 2} y={-size / 2}>
      <ellipse cx="11" cy="8" rx="3" ry="6" fill={color} opacity="0.9" className="rabbit-ear" />
      <ellipse cx="21" cy="8" rx="3" ry="6" fill={color} opacity="0.9" className="rabbit-ear" />
      <ellipse cx="11" cy="8" rx="1.5" ry="4" fill="#ffe4e6" />
      <ellipse cx="21" cy="8" rx="1.5" ry="4" fill="#ffe4e6" />
      <ellipse cx="16" cy="20" rx="9" ry="8" fill={color} />
      <circle cx="16" cy="14" r="7" fill={color} />
      <circle cx="13.5" cy="13" r="1.2" fill="#4c0519" />
      <circle cx="18.5" cy="13" r="1.2" fill="#4c0519" />
      <circle cx="14" cy="12.5" r="0.4" fill="white" />
      <circle cx="19" cy="12.5" r="0.4" fill="white" />
      <ellipse cx="12" cy="15" rx="1.2" ry="0.8" fill="#fda4af" opacity="0.7" />
      <ellipse cx="20" cy="15" rx="1.2" ry="0.8" fill="#fda4af" opacity="0.7" />
      <ellipse cx="16" cy="15.5" rx="1" ry="0.7" fill="#881337" />
      <circle cx="25" cy="22" r="3" fill="#ffe4e6" className="rabbit-tail" />
      <ellipse cx="10" cy="27" rx="2.5" ry="1.5" fill={color} transform="rotate(-20 10 27)" className="rabbit-leg" />
      <ellipse cx="22" cy="27" rx="2.5" ry="1.5" fill={color} transform="rotate(20 22 27)" className="rabbit-leg-alt" />
    </svg>
  );
}

export default function CardRabbitTrack({
  children,
  trackId = 'upload-rabbit-track',
  speedMultiplier = 1,
  enabled = true,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const rabbitsRef = useRef([]);
  const [trackSize, setTrackSize] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateTrackSize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setTrackSize({ w: width, h: height });
      }
    };

    updateTrackSize();
    const observer = new ResizeObserver(updateTrackSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trackSize || !enabled || reducedMotion || isMobile) return;

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
      if (rabbits.length === 0) return;

      const path = `#${trackId}`;

      gsapCtx = gsap.context(() => {
        rabbits.forEach((el, i) => {
          const cfg = RABBIT_CONFIG[i];
          if (!el || !cfg) return;

          gsap.fromTo(el, { scale: 0, opacity: 0 }, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.6 + i * 0.12,
            ease: 'back.out(1.6)',
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
            duration: 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          gsap.to(el.querySelector('.rabbit-tail'), {
            scale: 1.15,
            duration: 0.25,
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
  }, [trackSize, enabled, reducedMotion, isMobile, trackId]);

  useEffect(() => {
    if (reducedMotion) return;
    import('gsap').then(({ gsap }) => {
      RABBIT_CONFIG.forEach((_, i) => {
        const tween = gsap.getById(`${trackId}-rabbit-${i}`);
        if (!tween) return;
        gsap.to(tween, { timeScale: speedMultiplier, duration: 0.35, ease: 'power2.out' });
      });
    });
  }, [speedMultiplier, trackId, reducedMotion]);

  return (
    <div ref={containerRef} className={`relative overflow-visible ${className}`} style={style}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ zIndex: 30 }}
        aria-hidden="true"
      >
        {trackSize && (
          <path
            id={trackId}
            d={buildRoundedRectPath(trackSize.w, trackSize.h)}
            fill="none"
            stroke="none"
          />
        )}
        {!reducedMotion && !isMobile &&
          RABBIT_CONFIG.map((cfg, i) => (
            <g
              key={i}
              ref={(el) => { rabbitsRef.current[i] = el; }}
              style={{ transformOrigin: `${cfg.size / 2}px ${cfg.size / 2}px`, willChange: 'transform' }}
            >
              <RabbitSvg size={cfg.size} color={cfg.color} />
            </g>
          ))}
      </svg>
      {children}
    </div>
  );
}
