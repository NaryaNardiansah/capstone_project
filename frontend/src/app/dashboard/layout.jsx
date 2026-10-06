'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoutScreen from '../../components/auth/LogoutScreen';

/* ─── Karakter Maskot Kelinci SVG Interaktif ────────────────── */
function InteractiveRabbitSVG({ size = 32, color = '#f43f5e', earColor = '#fb7185', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Telinga Kelinci */}
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

      {/* Mata Kelinci */}
      <circle cx="50" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="70" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="52" cy="47" r="1.8" fill="white" />
      <circle cx="72" cy="47" r="1.8" fill="white" />

      {/* Pipi Merona */}
      <ellipse cx="44" cy="58" rx="6" ry="4" fill="#fda4af" opacity={0.7} />
      <ellipse cx="76" cy="58" rx="6" ry="4" fill="#fda4af" opacity={0.7} />
      <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill="#e11d48" />

      {/* Senyum */}
      <path d="M57 65 Q60 68 63 65" stroke="#4c0519" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Ekor & Kaki */}
      <circle cx="91" cy="84" r="10" fill="#ffe4e6" />
      <ellipse cx="42" cy="96" rx="9" ry="7" fill={color} transform="rotate(-20 42 96)" />
      <ellipse cx="78" cy="96" rx="9" ry="7" fill={color} transform="rotate(20 78 96)" />
    </svg>
  );
}

/* ─── 50 Kata-Kata Edukatif & Motivasi Maskot Kelinci ───────── */
const RABBIT_TIPS = [
  'Cabai Rawit Putih berubah merah cerah saat matang sempurna! 🌶️',
  'Kapsaisin terbanyak ada di plasenta putih penyangga biji cabai! 🔬',
  'Model MobileNetV2 mengklasifikasikan dalam <100 milidetik! ⚡',
  'WebP Engine menghemat ruang simpan hingga 85% lebih ringan! 📦',
  'Cabai Habanero bisa mencapai lebih dari 350.000 SHU lho! 🔥',
  'Warna merah cabai dipengaruhi oleh pigmen kapsantin alami! 🌿',
  'Pencahayaan foto yang merata meningkatkan akurasi deteksi AI! 📸',
  'Satu buah cabai rawit mengandung vitamin C lebih tinggi dari jeruk! 🍊',
  'Cabai Gendot memiliki bentuk lonjong unik dan aroma khas dataran tinggi! 🏔️',
  'Kapsaisin larut dalam lemak dan susu, bukan dalam air dingin! 🥛',
  'Sistem ini dilatih dengan ribuan variasi sudut dan pencahayaan! 📐',
  'Cabai Keriting populer untuk masakan Minang karena warna merahnya kuat! 🥘',
  'Skala Scoville pertama kali diciptakan Wilbur Scoville pada 1912! 📜',
  'Inverted Residual Block menjaga detail fitur cabai tanpa komputasi berat! 🧠',
  'Cabai Rawit Hijau kaya klorofil dan memiliki rasa pedas segar menusuk! 🌱',
  'Jangan lupa cuci tangan dengan sabun setelah memegang cabai segar! 🧼',
  'Format WebP menjaga ketajaman tekstur tangkai dan kulit cabai! 🔍',
  'Akurasi model mencapai 95.1% berkat augmentasi citra cerdas! 🎯',
  'Cabai Merah Besar memiliki kulit tebal dan rasa manis yang seimbang! 🍅',
  'Rasa pedas sebenarnya sensasi panas yang dirasakan reseptor lidah! 👅',
  'Cabai Jalapeno berasal dari Meksiko dan dipanen saat hijau berkilau! 🇲🇽',
  'Dataset seimbang membantu model AI tidak bias pada satu jenis cabai! ⚖️',
  'Setiap citra yang kamu uji membantu validasi riset ini lebih baik! 🤝',
  'Gunakan latar belakang polos saat memotret cabai agar hasil maksimal! 🖼️',
  'Kelinci peneliti selalu siap menemanimu kapan saja di laboratorium AI! 🐰',
  'Burung tidak merasakan pedasnya cabai karena tidak punya reseptor TRPV1! 🐦',
  'Penyimpanan cabai bersama tangkainya membuat cabai lebih tahan lama! 🧺',
  'Cabai Rawit Domba dikenal juga sebagai cabai setan karena sangat pedas! 😈',
  'Proses inferensi Deep Learning berjalan asynchronous agar web tetap mulus! 🚀',
  'Tekstur keriput cabai keriting membantu menahan bumbu saat dimasak! 🌶️',
  'Fitur riwayat prediksi otomatis menyimpan hasil foto dalam format cerdas! 💾',
  'Cabai kaya antioksidan alami yang baik untuk menjaga imunitas tubuh! 🛡️',
  'Semakin tua warna cabai rawit, umumnya kadar kapsaisinnya makin pekat! 🎨',
  'Model AI memisahkan konvolusi spasial dan kanal agar super efisien! 🧩',
  'Cabai pertama kali dibawa penjelajah Spanyol dan Portugis ke Asia! ⛵',
  'Kamu bisa klik kartu ini kapan saja untuk membaca wawasan baru! 👆',
  'Cabai segar memiliki tangkai hijau cerah yang belum mengering! 🍃',
  'Kadar air cabai merah besar lebih tinggi dibanding cabai rawit kecil! 💧',
  'Arsitektur MobileNetV2 sangat ramah dijalankan pada perangkat ponsel! 📱',
  'Makan cabai merangsang produksi hormon endorfin yang bikin bahagia! 😊',
  'Tahukah kamu? Paprika dan cabai rawit masih satu keluarga Solanaceae! 🌸',
  'Semua riwayat pengujianmu tersimpan rapi dan dapat diekspor kapan saja! 📊',
  'Senang melihat semangatmu meneliti cabai nusantara hari ini! ✨',
  'Cabai yang dikeringkan dapat mempertahankan kepedasannya berbulan-bulan! ☀️',
  'Pencocokan fitur warna RGB dinormalisasi ke rentang 0 hingga 1! 🔢',
  'Kelinci ini senang sekali jika kamu sering berkunjung ke dashboard! 🥕',
  'Biji cabai sendiri tidak pedas; rasa pedas berasal dari selaput putihnya! 💡',
  'Uji foto cabai dari jarak 15–30 cm untuk fokus detail paling tajam! 📏',
  'Riset capstone ini dibuat dengan dedikasi di Politeknik Negeri Padang! 🎓',
  'Terus eksplorasi kekayaan agrikultur Indonesia bersama ChiliDetect! 🇮🇩✨',
];

const NAV_ITEMS = [
  {
    name: 'Beranda',
    path: '/dashboard',
    badge: null,
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Klasifikasi Cabai',
    path: '/dashboard/klasifikasi',
    badge: 'AI',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m12-9l3 3m0 0l-3 3m3-3H9" />
      </svg>
    ),
  },
  {
    name: 'Riwayat Prediksi',
    path: '/dashboard/riwayat',
    badge: null,
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Tentang Aplikasi',
    path: '/dashboard/tentang',
    badge: null,
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('Pengguna');
  const [showLogout, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipPop, setTipPop] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username') || 'Pengguna';
    setUsername(user);
    if (!token) router.push('/');
  }, [router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Fungsi rotasi otomatis setiap 10 detik
  const startAutoRotate = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTipPop(true);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % RABBIT_TIPS.length);
        setTipPop(false);
      }, 200);
    }, 10000);
  };

  useEffect(() => {
    if (showLogout) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    startAutoRotate();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showLogout]);

  const handleNextTip = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // ignore
    }
    setTipPop(true);
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % RABBIT_TIPS.length);
      setTipPop(false);
    }, 180);

    // Reset hitungan waktu 10 detik setelah interaksi manual
    startAutoRotate();
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    setShowLogout(true);
  };

  const handleLogoutComplete = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.replace('/');
  }, []);

  if (!mounted) return null;

  return (
    <>
      {showLogout && <LogoutScreen onComplete={handleLogoutComplete} />}

      {/* Sembunyikan seluruh UI dashboard saat proses logout agar tidak pernah berkedip ke layar */}
      {!showLogout && (
        <>
          {/* Top Bar Khusus Mobile (< lg) */}
          <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-b border-rose-100/90 px-4 flex items-center justify-between z-30">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <span className="text-xl transform group-hover:scale-110 transition-transform">🌶️</span>
              <div>
                <span className="font-extrabold text-stone-900 tracking-tight font-display text-base">ChiliDetect</span>
                <span className="ml-1 text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">AI</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-stone-700 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-95 transition-all"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </header>

          {/* Backdrop Gelap untuk Laci Mobile */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
              aria-hidden="true"
            />
          )}

          <div className="min-h-screen bg-[#fffafa] flex">
            {/* Sidebar Navigasi (Laci pada mobile, Permanen pada desktop) */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-white/95 backdrop-blur-md border-r border-rose-100/90 flex flex-col justify-between transition-transform duration-300 ease-in-out overflow-y-auto ${
                mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
              } lg:translate-x-0 lg:shadow-none`}
            >
              {/* Bagian Atas: Brand & Menu */}
              <div>
                {/* Logo & Tombol Tutup Mobile */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-rose-100/80">
                  <Link href="/dashboard" className="flex items-center gap-2.5 group cursor-pointer">
                    <span className="text-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🌶️</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-stone-900 tracking-tight font-display text-lg">ChiliDetect</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md">
                          AI
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-600 font-medium -mt-0.5">Klasifikasi Cabai Rawit</p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    aria-label="Tutup menu navigasi"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Info Akun Pengguna */}
                <div className="px-5 py-3.5 border-b border-rose-100/80 bg-gradient-to-r from-rose-50/50 via-transparent to-pink-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shadow-rose-300 flex-shrink-0">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-stone-900 truncate">{username}</p>
                      <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-0.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                        Sesi Aktif
                      </p>
                    </div>
                  </div>
                </div>

                {/* Daftar Tautan Menu */}
                <nav className="px-3 py-3 space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 min-h-[42px] ${
                          isActive 
                            ? 'bg-rose-50 text-rose-700 shadow-2xs border border-rose-200/90 translate-x-0.5' 
                            : 'text-stone-600 hover:bg-rose-50/50 hover:text-stone-900 hover:translate-x-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Glowing active vertical accent strip */}
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-rose-500 to-pink-500 rounded-r-full shadow-xs shadow-rose-500/50" />
                          )}
                          <span className={`transform transition-transform duration-200 flex-shrink-0 ${isActive ? 'text-rose-600 scale-110' : 'text-stone-400 group-hover:text-rose-500 group-hover:scale-110'}`}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive 
                              ? 'bg-rose-600 text-white shadow-2xs animate-pulse' 
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bagian Tengah: Kartu Mini Maskot "Sapaan & Tips Hari Ini" */}
              <div className="px-3.5 py-2">
                <div
                  onClick={handleNextTip}
                  className={`group relative p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/95 via-pink-50/60 to-amber-50/50 border border-rose-200/90 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                    tipPop ? 'scale-95' : 'hover:-translate-y-0.5'
                  }`}
                  title="Klik untuk tips riset cabai berikutnya! 🐰🥕"
                >
                  {/* Ambient Glow di pojok */}
                  <div className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-rose-200/40 blur-md -z-0" />

                  <div className="flex items-start gap-2.5 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                      <InteractiveRabbitSVG size={32} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1 truncate">
                          <span>Semangat, {username}!</span>
                          <span className="text-xs shrink-0">🥕</span>
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shrink-0" title="Tips berganti otomatis" />
                      </div>

                      <p className={`text-[11px] text-stone-700 font-medium mt-1 leading-snug line-clamp-3 transition-opacity duration-200 ${tipPop ? 'opacity-30' : 'opacity-100'}`}>
                        "{RABBIT_TIPS[tipIndex]}"
                      </p>

                      <div className="mt-2 pt-1.5 border-t border-rose-100/90 flex items-center justify-between text-[10px]">
                        <span className="text-stone-400 font-medium">Tips Riset</span>
                        <span className="text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Ganti tips <span>➔</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian Bawah: Tombol Keluar & Identitas Footer */}
              <div className="p-3.5 border-t border-rose-100/80 bg-stone-50/40">
                <button
                  onClick={handleLogout}
                  className="w-full min-h-[40px] flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent transition-all duration-200 group active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4 text-stone-400 group-hover:text-rose-600 group-hover:-translate-x-0.5 transition-transform flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Keluar dari Sesi</span>
                </button>

                {/* Identitas Footer Akademik / Author */}
                <div className="mt-2.5 pt-2 border-t border-rose-100/60 text-center select-none">
                  <p className="text-[11px] font-bold text-stone-700 tracking-tight">
                    Anasera Kaluna © 2026
                  </p>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                    ChiliDetect AI · Capstone Project
                  </p>
                </div>
              </div>
            </aside>

            {/* Konten Utama Responsif */}
            <main className="flex-1 ml-0 lg:ml-64 pt-16 lg:pt-0 bg-[#fffafa] min-h-screen w-full overflow-x-hidden">
              <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
}

