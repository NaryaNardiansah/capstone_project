'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

/* ─── Karakter Maskot Kelinci SVG Interaktif ───────────────── */
function InteractiveRabbitSVG({ size = 52, color = '#f43f5e', earColor = '#fb7185', className = '' }) {
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

/* ─── Metadata Lengkap Varietas Cabai ──────────────────────── */
const CHILI_META = {
  'Cabai Rawit Merah': {
    scientific: 'Capsicum frutescens / chinense',
    bg: 'bg-red-50/90',
    border: 'border-red-200',
    text: 'text-red-700',
    bar: 'from-orange-500 via-rose-500 to-red-600',
    icon: '🔥',
    shu: '50.000 - 100.000+ SHU',
    spiceLevel: 5,
    tag: 'Sangat Pedas',
  },
  'Cabai Rawit Hijau': {
    scientific: 'Capsicum frutescens L.',
    bg: 'bg-emerald-50/90',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    bar: 'from-emerald-500 to-teal-600',
    icon: '🥗',
    shu: '25.000 - 50.000 SHU',
    spiceLevel: 3,
    tag: 'Pedas Segar',
  },
  'Cabai Merah Keriting': {
    scientific: 'Capsicum annuum var. acuminatum',
    bg: 'bg-rose-50/90',
    border: 'border-rose-200',
    text: 'text-rose-700',
    bar: 'from-pink-500 via-rose-500 to-red-600',
    icon: '🌶️',
    shu: '15.000 - 35.000 SHU',
    spiceLevel: 3,
    tag: 'Pedas Harum',
  },
  'Cabai Merah Besar': {
    scientific: 'Capsicum annuum L. var. grossum',
    bg: 'bg-red-50/90',
    border: 'border-red-200',
    text: 'text-red-800',
    bar: 'from-red-400 via-rose-500 to-red-700',
    icon: '🔴',
    shu: '5.000 - 15.000 SHU',
    spiceLevel: 2,
    tag: 'Pedas Ringan',
  },
  'Cabai Hijau Besar': {
    scientific: 'Capsicum annuum L. (fase hijau)',
    bg: 'bg-green-50/90',
    border: 'border-green-200',
    text: 'text-green-800',
    bar: 'from-green-500 to-emerald-600',
    icon: '🥦',
    shu: '5.000 - 15.000 SHU',
    spiceLevel: 2,
    tag: 'Pedas Renyah',
  },
  'Cabai Hijau Keriting': {
    scientific: 'Capsicum annuum var. acuminatum (fase hijau)',
    bg: 'bg-teal-50/90',
    border: 'border-teal-200',
    text: 'text-teal-800',
    bar: 'from-teal-500 to-green-600',
    icon: '🌿',
    shu: '15.000 - 30.000 SHU',
    spiceLevel: 3,
    tag: 'Pedas Sedang',
  },
  'Paprika': {
    scientific: 'Capsicum annuum Group',
    bg: 'bg-amber-50/90',
    border: 'border-amber-200',
    text: 'text-amber-800',
    bar: 'from-yellow-400 via-amber-500 to-orange-500',
    icon: '🫑',
    shu: '0 - 500 SHU',
    spiceLevel: 1,
    tag: 'Manis Lembut',
  },
  'Bukan Cabai': {
    scientific: 'Non-Capsicum Object',
    bg: 'bg-stone-100',
    border: 'border-stone-300',
    text: 'text-stone-700',
    bar: 'from-stone-400 to-stone-600',
    icon: '❓',
    shu: '0 SHU',
    spiceLevel: 0,
    tag: 'Non-Cabai',
  },
  // Kompatibilitas data lama
  'Cabai Setan': {
    scientific: 'Capsicum chinense',
    bg: 'bg-red-50/90',
    border: 'border-red-200',
    text: 'text-red-700',
    bar: 'from-orange-500 to-red-600',
    icon: '🔥',
    shu: '50.000+ SHU',
    spiceLevel: 5,
    tag: 'Super Pedas',
  },
  'Cabai Celeng': {
    scientific: 'Capsicum frutescens',
    bg: 'bg-emerald-50/90',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    bar: 'from-emerald-500 to-green-600',
    icon: '🥗',
    shu: '30.000 SHU',
    spiceLevel: 3,
    tag: 'Pedas Segar',
  },
  'Cabai Putih': {
    scientific: 'Capsicum annuum',
    bg: 'bg-amber-50/90',
    border: 'border-amber-200',
    text: 'text-amber-700',
    bar: 'from-yellow-400 to-amber-500',
    icon: '⚡',
    shu: '20.000 SHU',
    spiceLevel: 4,
    tag: 'Pedas Tajam',
  },
};

const getChiliMeta = (name) => {
  return CHILI_META[name] || {
    scientific: 'Capsicum sp.',
    bg: 'bg-rose-50/90',
    border: 'border-rose-200',
    text: 'text-rose-700',
    bar: 'from-rose-400 to-red-500',
    icon: '🌶️',
    shu: 'Skala Standar',
    spiceLevel: 2,
    tag: 'Varietas Cabai',
  };
};

/* ─── Komponen Counter Animasi Bertambah Halus ──────────────── */
function AnimatedCounter({ target, duration = 800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === null || target === undefined) return;
    let start = 0;
    const end = typeof target === 'number' ? target : parseFloat(target) || 0;
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

export default function RiwayatPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('Semua');
  const [sortBy, setSortBy] = useState('Terbaru');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected item for modal details
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setRefreshing(true);
    setError('');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Gagal mengambil riwayat');
      setHistory(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter & Sort logic
  useEffect(() => {
    let result = [...history];

    if (search.trim() !== '') {
      result = result.filter(
        (item) =>
          item.nama_file.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toString().includes(search)
      );
    }

    if (filterClass !== 'Semua') {
      result = result.filter((item) => item.hasil_prediksi === filterClass);
    }

    if (sortBy === 'Terbaru') {
      result.sort((a, b) => new Date(b.tanggal_prediksi) - new Date(a.tanggal_prediksi));
    } else if (sortBy === 'Terlama') {
      result.sort((a, b) => new Date(a.tanggal_prediksi) - new Date(b.tanggal_prediksi));
    } else if (sortBy === 'Keyakinan Tertinggi') {
      result.sort((a, b) => b.confidence_score - a.confidence_score);
    } else if (sortBy === 'Keyakinan Terendah') {
      result.sort((a, b) => a.confidence_score - b.confidence_score);
    }

    setFilteredHistory(result);
    setCurrentPage(1);
  }, [history, search, filterClass, sortBy]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Hapus riwayat prediksi ini dari database?')) return;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Gagal menghapus riwayat');
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Stats
  const total = history.length;
  const avgConf =
    total > 0
      ? parseFloat(
          (history.reduce((a, c) => a + c.confidence_score, 0) / total).toFixed(1)
        )
      : 0;

  const getTopChili = () => {
    if (total === 0) return { name: '-', count: 0 };
    const m = {};
    history.forEach((h) => (m[h.hasil_prediksi] = (m[h.hasil_prediksi] || 0) + 1));
    const topKey = Object.keys(m).reduce((a, b) => (m[a] > m[b] ? a : b));
    return { name: topKey, count: m[topKey] };
  };
  const topChili = getTopChili();

  // Pagination
  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const currentItems = filteredHistory.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="space-y-8 relative pb-20">
      
      {/* ── Ambient Background Glows ── */}
      <div className="pointer-events-none absolute -top-16 -right-12 w-96 h-96 rounded-full bg-rose-200/35 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 -left-16 w-80 h-80 rounded-full bg-pink-100/40 blur-3xl -z-10" />

      {/* ── HEADER HALAMAN RIWAYAT ── */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cloud Database: Tersinkron Otomatis</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight flex items-center gap-2">
              <span>Riwayat Prediksi</span>
              <span className="text-2xl">📋</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
              Pantau, filter, dan kelola seluruh arsip klasifikasi citra cabai yang telah dianalisis model AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchHistory}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl bg-white text-stone-700 border border-rose-100 hover:border-rose-300 hover:bg-rose-50/60 hover:text-rose-700 shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 group cursor-pointer"
            >
              <svg
                className={`w-4 h-4 text-stone-400 group-hover:text-rose-600 transition-transform ${
                  refreshing ? 'animate-spin text-rose-600' : 'group-hover:rotate-180 duration-500'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Menyinkronkan...' : 'Segarkan Data'}</span>
            </button>
          </div>
        </div>

        {/* Banner Sapaan & Status Asisten */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/60 to-white border border-rose-100/80 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">🐰💾</span>
            <p className="text-xs text-stone-700 leading-relaxed">
              Semua hasil prediksi tersimpan rapi beserta metrik akurasi dan thumbnail WebP teroptimasi.
            </p>
          </div>
          <Link
            href="/dashboard/klasifikasi"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors shadow-2xs"
          >
            <span>+ Uji Citra Baru</span>
            <span>📸</span>
          </Link>
        </div>
      </header>

      {/* ── BENTO STATS CARDS RIWAYAT (BALANCED & COHESIVE) ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Total Prediksi */}
        <div className="p-6 rounded-3xl border border-rose-100/90 bg-white/95 backdrop-blur-xs hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(244,63,94,0.08)] hover:border-rose-300 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-red-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Total Prediksi</span>
            <span className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-base shadow-2xs">
              📊
            </span>
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-2.5">
              <p className="text-4xl font-extrabold text-stone-900 font-display">
                <AnimatedCounter target={total} />
              </p>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Data Tersimpan
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2">Seluruh citra cabai yang berhasil dianalisis ke database akun.</p>
          </div>
        </div>

        {/* Card 2: Rata-Rata Keyakinan */}
        <div className="p-6 rounded-3xl border border-emerald-100/90 bg-white/95 backdrop-blur-xs hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,185,129,0.08)] hover:border-emerald-300 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rata-Rata Akurasi</span>
            <span className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-base shadow-2xs">
              🎯
            </span>
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold text-stone-900 font-display">
                {avgConf}%
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Tinggi
              </span>
            </div>
            {/* Visual mini bar */}
            <div className="w-full bg-stone-100 rounded-full h-2 mt-3 overflow-hidden p-0.5 border border-stone-200/60">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-1000 shadow-2xs"
                style={{ width: `${avgConf}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 mt-2">Tingkat keyakinan rata-rata model MobileNetV2.</p>
          </div>
        </div>

        {/* Card 3: Dominan Terdeteksi */}
        <div className="p-6 rounded-3xl border border-amber-100/90 bg-white/95 backdrop-blur-xs hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(245,158,11,0.08)] hover:border-amber-300 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Dominan Terdeteksi</span>
            <span className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-base shadow-2xs">
              🏆
            </span>
          </div>
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getChiliMeta(topChili.name).icon}</span>
              <p className="text-lg font-bold text-stone-900 truncate">
                {topChili.name}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {topChili.count} kali terdeteksi
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ── FILTER & SEARCH BAR INTERAKTIF ── */}
      <section className="p-4 sm:p-5 rounded-3xl border border-rose-100/90 bg-white/95 backdrop-blur-xs shadow-sm flex flex-col md:flex-row gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama file atau ID (#)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-stone-200/80 bg-stone-50/50 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Kategori Varietas */}
        <div className="w-full md:w-56">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 bg-stone-50/50 focus:bg-white font-medium transition-all cursor-pointer"
          >
            <option value="Semua">🌶️ Semua Kategori</option>
            <option value="Cabai Rawit Merah">🔥 Cabai Rawit Merah</option>
            <option value="Cabai Rawit Hijau">🥗 Cabai Rawit Hijau</option>
            <option value="Cabai Merah Keriting">🌶️ Cabai Merah Keriting</option>
            <option value="Cabai Merah Besar">🔴 Cabai Merah Besar</option>
            <option value="Cabai Hijau Besar">🥦 Cabai Hijau Besar</option>
            <option value="Cabai Hijau Keriting">🌿 Cabai Hijau Keriting</option>
            <option value="Paprika">🫑 Paprika</option>
            <option value="Bukan Cabai">❓ Bukan Cabai</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-52">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 bg-stone-50/50 focus:bg-white font-medium transition-all cursor-pointer"
          >
            <option value="Terbaru">📅 Waktu Terbaru</option>
            <option value="Terlama">⏳ Waktu Terlama</option>
            <option value="Keyakinan Tertinggi">📈 Akurasi Tertinggi</option>
            <option value="Keyakinan Terendah">📉 Akurasi Terendah</option>
          </select>
        </div>

      </section>

      {/* ── BANNER KEBIJAKAN PENYIMPANAN CERDAS ── */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-white border border-rose-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-stone-600 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            ⚡
          </span>
          <div>
            <span className="font-bold text-stone-800">Optimasi Penyimpanan Cerdas Aktif:</span>{' '}
            <span className="text-stone-600">
              Kompresi WebP otomatis (~20 KB), kuota 10 foto/akun (FIFO), dan retensi 7 hari untuk menghemat ruang disk server.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-rose-100 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Batas FIFO: 10 Foto/Akun</span>
        </div>
      </section>

      {/* ── TABEL RIWAYAT MODERN DENGAN TAMPILAN ELEGAN ── */}
      <section className="rounded-3xl border border-rose-100/90 bg-white/95 backdrop-blur-xs shadow-[0_12px_36px_rgba(244,63,94,0.08)] overflow-hidden">
        
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs sm:text-sm font-semibold text-stone-600">Memuat data riwayat prediksi...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-2">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm font-bold text-rose-600">{error}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-20 text-center space-y-4 px-4">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto shadow-sm">
              <InteractiveRabbitSVG size={50} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-base font-bold text-stone-900 font-display">Belum ada riwayat prediksi</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                Kelinci belum menemukan riwayat klasifikasi. Yuk coba unggah atau jepret foto cabai pertamamu!
              </p>
            </div>
            <Link
              href="/dashboard/klasifikasi"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs shadow-md hover:shadow-lg shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Uji Foto Cabai Sekarang</span>
              <span>📸</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-stone-50/90 border-b border-rose-100 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Citra Cabai</th>
                  <th className="px-6 py-4">Hasil Klasifikasi</th>
                  <th className="px-6 py-4">Akurasi Keyakinan</th>
                  <th className="px-6 py-4">Waktu Uji</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {currentItems.map((item) => {
                  const meta = getChiliMeta(item.hasil_prediksi);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-rose-50/40 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100/90 text-stone-700 border border-stone-200/80 shadow-2xs">
                          #{String(item.id).padStart(2, '0')}
                        </span>
                      </td>

                      {/* Nama File & Foto WebP Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.nama_file}
                              className="w-12 h-12 rounded-2xl object-cover border border-rose-100 shadow-2xs group-hover:scale-105 transition-transform bg-stone-100 shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-stone-400 shrink-0" title="Foto fisik dibersihkan otomatis sesuai kebijakan kuota/retensi">
                              <span className="text-base">📷</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-stone-900 group-hover:text-rose-600 transition-colors truncate block max-w-[200px]" title={item.nama_file}>
                              {item.nama_file}
                            </span>
                            <span className="text-[10px] text-stone-500 block font-mono mt-0.5">
                              {item.image_url ? 'WebP Thumbnail' : 'Log Teks Aman'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Hasil Klasifikasi */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.border} ${meta.text} shadow-2xs`}>
                          <span>{meta.icon}</span>
                          <span>{item.hasil_prediksi}</span>
                        </span>
                      </td>

                      {/* Keyakinan & Mini Flame Bar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                            <div
                              className={`h-full bg-gradient-to-r ${meta.bar} rounded-full transition-all duration-500 shadow-xs relative overflow-hidden`}
                              style={{ width: `${Math.min(item.confidence_score, 100)}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-2/5 h-full animate-magma-shimmer" />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-stone-800 font-mono">
                            {item.confidence_score.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="px-6 py-4 text-xs text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <span>📅</span>
                          <span>{new Date(item.tanggal_prediksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          >
                            Detail
                          </button>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-200 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── PAGINATION ── */}
      {!loading && filteredHistory.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <p className="text-xs text-stone-500 font-medium">
            Menampilkan <span className="font-bold text-stone-800">{firstIdx + 1}</span> -{' '}
            <span className="font-bold text-stone-800">{Math.min(lastIdx, filteredHistory.length)}</span> dari{' '}
            <span className="font-bold text-stone-800">{filteredHistory.length}</span> data tersimpan
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-rose-100 bg-white rounded-xl text-xs font-bold text-stone-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
            >
              ← Sebelumnya
            </button>
            <span className="text-xs font-bold text-stone-700 px-2 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 border border-rose-100 bg-white rounded-xl text-xs font-bold text-stone-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DETAIL PREDIKSI INTERAKTIF ── */}
      {selectedItem && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.2)] w-full max-w-lg overflow-hidden border border-rose-100 animate-bubble-pop relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Top Glow */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-rose-200/50 blur-2xl" />

            {/* Header Modal */}
            <div className="p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50/50 border-b border-rose-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-2xl shadow-sm">
                  {getChiliMeta(selectedItem.hasil_prediksi).icon}
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg font-display">Detail Riwayat Klasifikasi</h3>
                  <p className="text-xs text-stone-500 font-mono">Log ID #{selectedItem.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Isi Detail Modal */}
            <div className="p-6 sm:p-7 space-y-4 max-h-[78vh] overflow-y-auto text-stone-800">
              
              {/* Pratinjau Citra WebP Terkompresi */}
              {selectedItem.image_url ? (
                <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-rose-200/80 bg-stone-950 flex items-center justify-center group shadow-inner">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.nama_file}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-stone-900/80 text-emerald-300 text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1.5 border border-stone-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>WebP Terkompresi (~20 KB)</span>
                  </div>
                  <a
                    href={selectedItem.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white/95 text-stone-800 text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-1 group-hover:scale-105"
                  >
                    <span>Buka Penuh</span>
                    <span>↗</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-stone-600 flex items-start gap-2.5">
                  <span className="text-xl shrink-0">🛡️</span>
                  <div>
                    <p className="font-bold text-stone-800">Foto Fisik Telah Dibereskan Otomatis</p>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      Sesuai kebijakan kuota FIFO (maks 10 foto/akun) atau batas retensi 7 hari untuk efisiensi ruang disk server. Data teks, waktu, dan akurasi tetap tersimpan aman di database.
                    </p>
                  </div>
                </div>
              )}

              {/* Nama File */}
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Nama File Citra</p>
                <p className="text-xs font-mono font-semibold text-stone-800 mt-1 break-all bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  {selectedItem.nama_file}
                </p>
              </div>

              {/* Varietas Terdeteksi */}
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Varietas Terdeteksi</p>
                <div className={`p-4 rounded-2xl border ${getChiliMeta(selectedItem.hasil_prediksi).bg} ${getChiliMeta(selectedItem.hasil_prediksi).border} shadow-2xs`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-stone-900 font-display">
                        {selectedItem.hasil_prediksi}
                      </span>
                      <p className="text-xs italic text-stone-500 mt-0.5">
                        {getChiliMeta(selectedItem.hasil_prediksi).scientific}
                      </p>
                    </div>
                    <span className="text-3xl">{getChiliMeta(selectedItem.hasil_prediksi).icon}</span>
                  </div>
                </div>
              </div>

              {/* Bar Keyakinan dengan Magma Shimmer */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-stone-500 text-[11px]">Tingkat Keyakinan Model</span>
                  <span className="font-extrabold text-stone-900 font-mono">{selectedItem.confidence_score.toFixed(2)}%</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div
                    className={`h-full bg-gradient-to-r ${getChiliMeta(selectedItem.hasil_prediksi).bar} rounded-full transition-all duration-700 relative overflow-hidden`}
                    style={{ width: `${selectedItem.confidence_score}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-2/5 h-full animate-magma-shimmer" />
                  </div>
                </div>
              </div>

              {/* Waktu Uji */}
              <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Waktu Prediksi:</span>
                <span className="font-semibold text-stone-800">
                  {new Date(selectedItem.tanggal_prediksi).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-rose-100 flex justify-between items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleDelete(selectedItem.id, e)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                Hapus Data
              </button>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
