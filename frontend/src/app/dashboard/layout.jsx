'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoutScreen from '../../components/auth/LogoutScreen';

const NAV_ITEMS = [
  {
    name: 'Beranda',
    path: '/dashboard',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    name: 'Klasifikasi Cabai',
    path: '/dashboard/klasifikasi',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m12-9l3 3m0 0l-3 3m3-3H9" />
      </svg>
    ),
  },
  {
    name: 'Riwayat Prediksi',
    path: '/dashboard/riwayat',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    name: 'Tentang Aplikasi',
    path: '/dashboard/tentang',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.028M12 7.5h.008v.008H12V7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('Pengguna');
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutScreen, setShowLogoutScreen] = useState(false);

  const sidebarRef = useRef(null);
  const logoRef = useRef(null);
  const userCardRef = useRef(null);
  const navItemsRefs = useRef([]);
  const logoutBtnRef = useRef(null);
  const indicatorRef = useRef(null);
  const mainContentRef = useRef(null);
  const arrowRef = useRef(null);
  const sidebarRabbitsRef = useRef([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(600);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarHeight(window.innerHeight - 32);
      const handleResize = () => setSidebarHeight(window.innerHeight - 32);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username') || 'difaa';
    setUsername(user);
    if (!token) router.push('/');
  }, [router]);

  // Entrance animations
  useEffect(() => {
    if (!mounted) return;
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(sidebarRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.65, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      )
      .fromTo(logoRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.35')
      .fromTo(userCardRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.2')
      .fromTo(navItemsRefs.current.filter(Boolean),
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.4 }, '-=0.15'
      )
      .fromTo(logoutBtnRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.15');

      // Stagger sidebar rabbits appearance
      gsap.fromTo(sidebarRabbitsRef.current.filter(Boolean),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.6 }
      );

      // Micro-interactions hover links
      navItemsRefs.current.forEach((el, index) => {
        if (!el) return;
        const icon = el.querySelector('svg');
        const text = el.querySelector('.item-text');
        
        el.addEventListener('mouseenter', () => {
          gsap.to(text, { x: 6, duration: 0.2, ease: 'power2.out' });
          gsap.to(icon, { scale: 1.15, color: '#f43f5e', duration: 0.2 });
        });
        
        el.addEventListener('mouseleave', () => {
          gsap.to(text, { x: 0, duration: 0.2 });
          const isActive = NAV_ITEMS[index].path === pathname;
          gsap.to(icon, { scale: 1, color: isActive ? '#9f1239' : '#fda4af', duration: 0.2 });
        });
      });
    });
  }, [mounted, pathname]);

  // Sliding active indicator pill animation
  useEffect(() => {
    if (!mounted) return;
    const activeIdx = NAV_ITEMS.findIndex((item) => item.path === pathname);
    const activeEl = navItemsRefs.current[activeIdx];
    
    if (activeEl && indicatorRef.current) {
      import('gsap').then(({ gsap }) => {
        gsap.to(indicatorRef.current, {
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out'
        });
      });
    }
  }, [mounted, pathname, collapsed]);

  // Running rabbits along the sidebar border
  useEffect(() => {
    if (!mounted) return;

    let gsapCtx;
    let cancelled = false;

    (async () => {
      const { gsap } = await import('gsap');
      const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
      if (cancelled) return;

      const pathEl = document.querySelector('#sidebar-rabbit-track');
      if (!pathEl) return;

      gsap.registerPlugin(MotionPathPlugin);
      const rabbits = sidebarRabbitsRef.current.filter(Boolean);
      if (rabbits.length === 0) return;

      const path = '#sidebar-rabbit-track';
      const speeds = [12, 16, 9, 14, 11];
      const offsets = [0, 0.2, 0.4, 0.6, 0.8];

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
            duration: speeds[i],
            ease: 'none',
            repeat: -1,
            id: `sidebar-rabbit-${i}`,
          });
        });
      });
    })();

    return () => {
      cancelled = true;
      gsapCtx?.revert();
    };
  }, [mounted, collapsed, sidebarHeight]);

  const handleSidebarHover = (entering) => {
    setIsSidebarHovered(entering);
    import('gsap').then(({ gsap }) => {
      sidebarRabbitsRef.current.filter(Boolean).forEach((_, i) => {
        const tween = gsap.getById(`sidebar-rabbit-${i}`);
        if (!tween) return;
        gsap.to(tween, {
          timeScale: entering ? 1.6 : 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  };

  // Toggle Collapse
  const handleToggleCollapse = () => {
    import('gsap').then(({ gsap }) => {
      const nextCollapsed = !collapsed;
      setCollapsed(nextCollapsed);

      const texts = sidebarRef.current.querySelectorAll('.item-text, .brand-text, .user-text');
      
      gsap.to(texts, {
        opacity: nextCollapsed ? 0 : 1,
        display: nextCollapsed ? 'none' : 'block',
        duration: 0.15,
        onComplete: () => {
          gsap.to(sidebarRef.current, {
            width: nextCollapsed ? 82 : 260,
            duration: 0.45,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
          gsap.to(mainContentRef.current, {
            paddingLeft: nextCollapsed ? 98 : 276,
            duration: 0.45,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
        }
      });

      // Rotate arrow
      gsap.to(arrowRef.current, {
        rotate: nextCollapsed ? 180 : 0,
        duration: 0.35,
        ease: 'power2.inOut'
      });
    });
  };

  const handleLogout = () => {
    import('gsap').then(({ gsap }) => {
      gsap.to([sidebarRef.current, mainContentRef.current], {
        opacity: 0,
        y: -15,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setShowLogoutScreen(true);
        }
      });
    });
  };

  const handleLogoutComplete = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex relative" style={{ backgroundColor: '#fffafa' }}>
      
      {/* ══════════════ FLOATING DETACHED SIDEBAR CONTAINER ══════════════ */}
      <div
        className="fixed top-4 left-4 z-40 overflow-visible"
        style={{ width: collapsed ? 82 : 260, height: 'calc(100vh - 2rem)' }}
        onMouseEnter={() => handleSidebarHover(true)}
        onMouseLeave={() => handleSidebarHover(false)}
      >
        {/* ── RUNNING RABBITS BORDER TRACK ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={{ zIndex: 50 }}
        >
          {/* Path follows exactly the bounding box of the sidebar offset by 10px */}
          <path
            id="sidebar-rabbit-track"
            d={`M 18 -10 
                H ${collapsed ? 72 : 250} 
                A 28 28 0 0 1 ${collapsed ? 100 : 278} 18 
                V ${sidebarHeight - 18} 
                A 28 28 0 0 1 ${collapsed ? 72 : 250} ${sidebarHeight + 10} 
                H 18 
                A 28 28 0 0 1 -10 ${sidebarHeight - 18} 
                V 18 
                A 28 28 0 0 1 18 -10 Z`}
            fill="none" stroke="none"
          />
          {/* 5 running rabbits */}
          {[0, 1, 2, 3, 4].map((i) => {
            const sizes = [16, 22, 14, 20, 18];
            const colors = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#f43f5e'];
            const sz = sizes[i];
            // Render only 3 rabbits on tablet/collapsed, else all 5
            if (collapsed && i >= 3) return null;
            return (
              <g
                key={i}
                ref={(el) => (sidebarRabbitsRef.current[i] = el)}
                style={{ transformOrigin: `${sz / 2}px ${sz / 2}px` }}
              >
                <svg width={sz} height={sz} viewBox="0 0 32 32" fill="none" x={-sz/2} y={-sz/2}>
                  <ellipse cx="11" cy="8" rx="3" ry="6" fill={colors[i]} opacity="0.9" />
                  <ellipse cx="21" cy="8" rx="3" ry="6" fill={colors[i]} opacity="0.9" />
                  <ellipse cx="11" cy="8" rx="1.5" ry="4" fill="#ffe4e6" />
                  <ellipse cx="21" cy="8" rx="1.5" ry="4" fill="#ffe4e6" />
                  <ellipse cx="16" cy="20" rx="9" ry="8" fill={colors[i]} />
                  <circle cx="16" cy="14" r="7" fill={colors[i]} />
                  <circle cx="13.5" cy="13" r="1.2" fill="#881337" />
                  <circle cx="18.5" cy="13" r="1.2" fill="#881337" />
                  <circle cx="14" cy="12.5" r="0.4" fill="white" />
                  <circle cx="19" cy="12.5" r="0.4" fill="white" />
                  <ellipse cx="16" cy="15.5" rx="1" ry="0.7" fill="#9f1239" />
                  <circle cx="25" cy="22" r="3" fill="#ffe4e6" />
                  <ellipse cx="10" cy="27" rx="2.5" ry="1.5" fill={colors[i]} transform="rotate(-20 10 27)" />
                  <ellipse cx="22" cy="27" rx="2.5" ry="1.5" fill={colors[i]} transform="rotate(20 22 27)" />
                </svg>
              </g>
            );
          })}
        </svg>

        <aside
          ref={sidebarRef}
          className="w-full h-full rounded-3xl flex flex-col overflow-hidden relative"
          style={{
            backgroundColor: '#fff8f8',
            border: '2px solid #fecdd3',
            boxShadow: isSidebarHovered
              ? '0 20px 50px rgba(244,63,94,0.12), 0 0 0 2px rgba(253,164,175,0.15)'
              : '0 8px 32px rgba(244,63,94,0.06)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'linear-gradient(160deg, #fff1f2 0%, #fffafa 60%, #fff8f8 100%)' }} />

          {/* ── Logo Area ── */}
          <div ref={logoRef} className="flex items-center justify-between px-5 pt-6 pb-4" style={{ borderBottom: '1px solid #fecdd3' }}>
            <div className="flex items-center gap-3">
              <span className="text-xl animate-bounce flex-shrink-0" style={{ animationDuration: '3.3s' }}>🌶️</span>
              <span className="brand-text font-black tracking-tight text-sm" style={{ color: '#881337', display: collapsed ? 'none' : 'block' }}>Deteksi Cabai</span>
            </div>
            {/* Collapse button */}
            <button
              onClick={handleToggleCollapse}
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors"
              style={{ color: '#fda4af' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#be123c'; e.currentTarget.style.backgroundColor = '#fff1f2'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#fda4af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <svg
                ref={arrowRef}
                className="w-4 h-4 transform transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* ── User Profile Card ── */}
          <div
            ref={userCardRef}
            className="mx-3.5 mt-4 p-3 rounded-2xl flex items-center gap-3 hover:translate-y-[-2px] transition-transform duration-200 cursor-default"
            style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', boxShadow: '0 2px 8px rgba(244,63,94,0.04)' }}
          >
            {/* Conic glowing spinner around avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full" style={{
                background: 'conic-gradient(from 0deg, #f43f5e, #fb7185, #fecdd3, #f43f5e)',
                padding: '1.5px',
                borderRadius: '9999px',
                transform: 'scale(1.08)',
                animation: 'spin 6s linear infinite'
              }} />
              <div className="relative w-8 h-8 rounded-full font-black flex items-center justify-center text-xs border border-white" style={{ backgroundColor: '#fecaca', color: '#9f1239' }}>
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="min-w-0 user-text" style={{ display: collapsed ? 'none' : 'block' }}>
              <p className="text-xs font-bold truncate flex items-center gap-1" style={{ color: '#881337' }}>
                {username}
                <svg className="w-3.5 h-3.5" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <span className="text-[10px] whitespace-nowrap" style={{ color: '#fda4af' }}>Sesi Aktif</span>
              </div>
            </div>
          </div>

          {/* Separator line */}
          <div className="px-5 pt-5 pb-2">
            <div className="h-px" style={{ backgroundColor: '#fecdd3' }} />
          </div>

          {/* ── Nav Links ── */}
          <nav className="relative flex-1 px-3 space-y-1.5 overflow-y-auto">
            {/* ── Active Indicator Slide Pill ── */}
            <div
              ref={indicatorRef}
              className="absolute left-3 w-[calc(100%-1.5rem)] rounded-2xl pointer-events-none -z-10"
              style={{
                opacity: 0,
                backgroundColor: '#fff',
                borderLeft: '4px solid #f43f5e',
                boxShadow: '0 4px 12px rgba(244,63,94,0.1)'
              }}
            />
            {NAV_ITEMS.map((item, idx) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  ref={(el) => (navItemsRefs.current[idx] = el)}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl text-xs transition-colors duration-200"
                  style={{
                    color: isActive ? '#9f1239' : '#fda4af',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <span style={{ color: isActive ? '#9f1239' : '#fda4af' }}>
                    {item.icon}
                  </span>
                  <span className="item-text truncate" style={{ display: collapsed ? 'none' : 'block' }}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Separator line */}
          <div className="px-5">
            <div className="h-px" style={{ backgroundColor: '#fecdd3' }} />
          </div>

          {/* ── Logout Button ── */}
          <div ref={logoutBtnRef} className="p-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-xs transition-colors"
              style={{ color: '#fda4af' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#be123c'; e.currentTarget.style.backgroundColor = '#fff1f2'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#fda4af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="item-text font-bold" style={{ display: collapsed ? 'none' : 'block' }}>Keluar</span>
            </button>
          </div>

        </aside>
      </div>

      {/* ── MAIN CONTAINER ── */}
      <main
        ref={mainContentRef}
        className="flex-1 min-h-screen transition-all"
        style={{ paddingLeft: 276 }}
      >
        <div className="max-w-4xl mx-auto px-10 py-12">
          {children}
        </div>
      </main>

      {showLogoutScreen && (
        <LogoutScreen onComplete={handleLogoutComplete} />
      )}

    </div>
  );
}
