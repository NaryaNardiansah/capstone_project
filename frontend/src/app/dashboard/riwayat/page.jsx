'use client';
import { useEffect, useState, useRef } from 'react';

const LABEL_STYLE = (label) => {
  const m = {
    'Cabai Setan':          { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', dot: '#ef4444' },
    'Cabai Celeng':         { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', dot: '#22c55e' },
    'Cabai Putih':          { bg: '#fefce8', text: '#ca8a04', border: '#fef08a', dot: '#eab308' },
    'Cabai Merah Keriting': { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', dot: '#f97316' },
    'Bukan Cabai':          { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0', dot: '#94a3b8' },
  };
  return m[label] || { bg: '#f8fafc', text: '#475569', border: '#e2e8f0', dot: '#94a3b8' };
};

export default function RiwayatPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('Semua');
  const [sortBy, setSortBy] = useState('Terbaru');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected item for drawer/modal details
  const [selectedItem, setSelectedItem] = useState(null);

  // Animation Refs
  const headRef = useRef(null);
  const statsRefs = useRef([]);
  const filterRef = useRef(null);
  const rowsRef = useRef([]);
  const drawerRef = useRef(null);
  const drawerBgRef = useRef(null);
  const refreshBtnRef = useRef(null);
  const bgOrb1 = useRef(null);
  const bgOrb2 = useRef(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    // Spin refresh button
    if (refreshBtnRef.current) {
      import('gsap').then(({ gsap }) => {
        gsap.to(refreshBtnRef.current.querySelector('.refresh-icon'), {
          rotate: '+=360',
          duration: 0.8,
          ease: 'power2.inOut'
        });
      });
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
    }
  };

  useEffect(() => {
    fetchHistory();
    import('gsap').then(({ gsap }) => {
      // Entrance
      gsap.fromTo(headRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo(filterRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.25 });
      
      // Floating backgrounds
      gsap.to(bgOrb1.current, { x: 30, y: -30, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(bgOrb2.current, { x: -40, y: 20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }, []);

  // Filter/Sort logic
  useEffect(() => {
    let result = [...history];

    if (search.trim() !== '') {
      result = result.filter(item =>
        item.nama_file.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toString().includes(search)
      );
    }

    if (filterClass !== 'Semua') {
      result = result.filter(item => item.hasil_prediksi === filterClass);
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

  // Stagger entry animations on content loads
  useEffect(() => {
    if (!loading) {
      import('gsap').then(({ gsap }) => {
        // Bento Stats Grid Stagger
        gsap.fromTo(statsRefs.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.2)', overwrite: 'auto' }
        );

        // Row Staggers
        const rows = rowsRef.current.filter(Boolean);
        if (rows.length > 0) {
          gsap.fromTo(rows,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' }
          );
        }

        // Fill Progress bars
        const bars = document.querySelectorAll('.prog-bar');
        bars.forEach((bar) => {
          const targetW = bar.dataset.width;
          gsap.fromTo(bar, { width: 0 }, { width: targetW, duration: 1, ease: 'power2.out', delay: 0.1 });
        });

        // Numeric counters on stats
        statsRefs.current.forEach((card) => {
          if (!card) return;
          const valEl = card.querySelector('.stat-val');
          if (valEl && valEl.dataset.target) {
            const target = parseFloat(valEl.dataset.target);
            if (!isNaN(target)) {
              gsap.fromTo({ val: 0 },
                { val: 0 },
                {
                  val: target,
                  duration: 1.2,
                  ease: 'power2.out',
                  onUpdate: function () {
                    const curr = this.targets()[0].val;
                    valEl.textContent = valEl.dataset.ispercent ? `${curr.toFixed(1)}%` : Math.round(curr);
                  }
                }
              );
            }
          }
        });
      });
    }
  }, [loading, filteredHistory, currentPage]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Hapus riwayat prediksi ini dari database?')) return;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Gagal menghapus riwayat');
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (selectedItem?.id === id) {
        closeDrawer();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openDrawer = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(drawerBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' });
      });
    }, 10);
  };

  const closeDrawer = () => {
    import('gsap').then(({ gsap }) => {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.25, ease: 'power3.in' });
      gsap.to(drawerBgRef.current, {
        opacity: 0, duration: 0.25, onComplete: () => {
          setSelectedItem(null);
        }
      });
    });
  };

  // Magnetic Button Effect
  const handleMagnetic = (e, element) => {
    if (!element) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    import('gsap').then(({ gsap }) => {
      gsap.to(element, { x: x * 0.3, y: y * 0.3, duration: 0.2, ease: 'power1.out' });
    });
  };

  const resetMagnetic = (element) => {
    if (!element) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(element, { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1, 0.3)' });
    });
  };

  // Stats
  const total = history.length;
  const avgConf = total > 0
    ? parseFloat((history.reduce((a, c) => a + c.confidence_score, 0) / total).toFixed(1))
    : 0;
  const getTopChili = () => {
    if (total === 0) return '-';
    const m = {};
    history.forEach(h => m[h.hasil_prediksi] = (m[h.hasil_prediksi] || 0) + 1);
    return Object.keys(m).reduce((a, b) => m[a] > m[b] ? a : b);
  };
  const topChili = getTopChili();

  // Pagination
  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const currentItems = filteredHistory.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="relative min-h-screen pb-16 select-none">
      
      {/* ── BACKGROUND ORBS ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div ref={bgOrb1} className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full blur-[110px]" style={{ backgroundColor: '#fecdd3', opacity: 0.35 }} />
        <div ref={bgOrb2} className="absolute bottom-20 left-10 w-[320px] h-[320px] rounded-full blur-[100px]" style={{ backgroundColor: '#ffe4e6', opacity: 0.3 }} />
      </div>

      {/* ── HEADER ── */}
      <div ref={headRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-[2.2rem] font-extrabold tracking-tight flex items-center gap-2" style={{ color: '#881337' }}>
            Riwayat Prediksi
            <span className="w-1.5 h-1.5 rounded-full animate-pulse mt-3" style={{ backgroundColor: '#fda4af' }} />
          </h1>
          <p className="mt-2 text-base font-light" style={{ color: '#be123c' }}>Pantau, filter, dan kelola semua riwayat klasifikasi yang tersimpan.</p>
        </div>
        
        {/* Magnetic Refresh button */}
        <button
          ref={refreshBtnRef}
          onMouseMove={(e) => handleMagnetic(e, refreshBtnRef.current)}
          onMouseLeave={() => resetMagnetic(refreshBtnRef.current)}
          onClick={fetchHistory}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl transition-colors"
          style={{ backgroundColor: '#fff', border: '1px solid #fecdd3', color: '#be123c', boxShadow: '0 2px 10px rgba(244,63,94,0.07)' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <svg className="refresh-icon w-4 h-4 transition-transform" style={{ color: '#fda4af' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Segarkan Data
        </button>
      </div>

      {/* ── ASYMMETRIC BENTO GRID STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        
        {/* Bento Stat 1: Total Prediksi (Dark Theme Accent) */}
        <div
          ref={(el) => (statsRefs.current[0] = el)}
          className="md:col-span-2 p-6 rounded-3xl flex flex-col justify-between"
          style={{ backgroundColor: '#fecaca', boxShadow: '0 4px 20px rgba(244,63,94,0.12)' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#f43f5e' }}>Total Prediksi</span>
            <svg className="w-5 h-5" style={{ color: '#fb7185' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="mt-8">
            <p className="text-5xl font-black tracking-tight stat-val" style={{ color: '#9f1239' }} data-target={total}>0</p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#fb7185' }}>Seluruh riwayat aktif tersimpan.</p>
          </div>
        </div>

        {/* Bento Stat 2: Avg Confidence */}
        <div
          ref={(el) => (statsRefs.current[1] = el)}
          className="md:col-span-1.5 p-6 rounded-3xl flex flex-col justify-between bg-white"
          style={{ border: '1px solid #fecdd3', boxShadow: '0 4px 20px rgba(244,63,94,0.04)' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>Rata-rata Keyakinan</span>
            <svg className="w-5 h-5" style={{ color: '#fecdd3' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-extrabold tracking-tight stat-val" style={{ color: '#881337' }} data-target={avgConf} data-ispercent="true">0.0%</p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#fda4af' }}>Tingkat keandalan model.</p>
          </div>
        </div>

        {/* Bento Stat 3: Dominan */}
        <div
          ref={(el) => (statsRefs.current[2] = el)}
          className="md:col-span-1.5 p-6 rounded-3xl flex flex-col justify-between bg-white"
          style={{ border: '1px solid #fecdd3', boxShadow: '0 4px 20px rgba(244,63,94,0.04)' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>Dominan Terdeteksi</span>
            <span className="text-lg">🔥</span>
          </div>
          <div className="mt-8">
            <p className="text-xl font-extrabold truncate tracking-tight" style={{ color: '#881337' }}>{topChili}</p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#fda4af' }}>Hasil prediksi terbanyak.</p>
          </div>
        </div>

      </div>

      {/* ── FILTER BAR ── */}
      <div
        ref={filterRef}
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl mb-6"
        style={{ backgroundColor: 'rgba(255,248,248,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #fecdd3', boxShadow: '0 2px 10px rgba(244,63,94,0.05)' }}
      >
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#fda4af' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama file atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-rose-300 focus:outline-none transition-colors"
            style={{ border: '1px solid #fecdd3', backgroundColor: '#fff', color: '#881337' }}
          />
        </div>

        <div className="w-full sm:w-52">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors cursor-pointer font-semibold"
            style={{ border: '1px solid #fecdd3', backgroundColor: '#fff', color: '#881337' }}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Cabai Setan">Cabai Setan</option>
            <option value="Cabai Celeng">Cabai Celeng</option>
            <option value="Cabai Putih">Cabai Putih</option>
            <option value="Cabai Merah Keriting">Cabai Merah Keriting</option>
            <option value="Bukan Cabai">Bukan Cabai</option>
          </select>
        </div>

        <div className="w-full sm:w-44">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors cursor-pointer font-semibold"
            style={{ border: '1px solid #fecdd3', backgroundColor: '#fff', color: '#881337' }}
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
            <option value="Keyakinan Tertinggi">Keyakinan Tertinggi</option>
            <option value="Keyakinan Terendah">Keyakinan Terendah</option>
          </select>
        </div>
      </div>

      {/* ── HYBRID TABLE-CARD DATA DISPLAY ── */}
      <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#fff', border: '1px solid #fecdd3', boxShadow: '0 4px 20px rgba(244,63,94,0.05)' }}>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-400">
            <svg className="animate-spin w-8 h-8" style={{ color: '#fda4af' }} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <p className="text-sm font-semibold" style={{ color: '#fda4af' }}>Mengambil data riwayat...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-500 gap-2">
            <span className="text-xl">⚠</span>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl select-none" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>🌶️</div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#881337' }}>Tidak ada riwayat</p>
              <p className="text-xs max-w-[200px] leading-relaxed mt-1" style={{ color: '#fda4af' }}>Data klasifikasi tidak ditemukan.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ backgroundColor: '#fff1f2', borderBottom: '1px solid #fecdd3' }}>
                  {['ID', 'Nama File', 'Hasil Klasifikasi', 'Keyakinan', 'Tanggal', ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => {
                  const s = LABEL_STYLE(item.hasil_prediksi);
                  return (
                    <tr
                      key={item.id}
                      ref={(el) => (rowsRef.current[index] = el)}
                      onClick={() => openDrawer(item)}
                      className="border-b cursor-pointer transition-colors duration-150 group"
                      style={{ borderColor: '#fecdd3' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff8f8'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold" style={{ color: '#fecdd3' }}>{item.id}</td>
                      <td className="px-6 py-4 font-bold max-w-[170px] truncate" style={{ color: '#881337' }}>{item.nama_file}</td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border inline-block"
                          style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
                        >
                          {item.hasil_prediksi}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: '#fecdd3' }}>
                            <div
                              className="prog-bar h-1.5 rounded-full"
                              data-width={`${Math.min(item.confidence_score, 100)}%`}
                              style={{ width: 0, backgroundColor: s.dot }}
                            />
                          </div>
                          <span className="text-xs font-bold" style={{ color: '#881337' }}>{item.confidence_score.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap" style={{ color: '#fda4af' }}>
                        {new Date(item.tanggal_prediksi).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                            className="text-xs font-bold transition-colors"
                            style={{ color: '#fda4af' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#9f1239'}
                            onMouseLeave={e => e.currentTarget.style.color = '#fda4af'}
                          >
                            Detail
                          </button>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-xs font-bold transition-colors"
                            style={{ color: '#fecdd3' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                            onMouseLeave={e => e.currentTarget.style.color = '#fecdd3'}
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

      </div>

      {/* ── PAGINATION ── */}
      {!loading && filteredHistory.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-5 mt-4" style={{ borderTop: '1px solid #fecdd3' }}>
          <p className="text-xs text-slate-400 font-medium">
            Menampilkan <span className="font-semibold" style={{ color: '#881337' }}>{firstIdx + 1}</span> -{' '}
            <span className="font-semibold" style={{ color: '#881337' }}>{Math.min(lastIdx, filteredHistory.length)}</span> dari{' '}
            <span className="font-semibold" style={{ color: '#881337' }}>{filteredHistory.length}</span> data
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150
                ${currentPage === 1
                  ? 'cursor-not-allowed'
                  : 'active:scale-95'
                }`}
              style={currentPage === 1
                ? { borderColor: '#fecdd3', color: '#fda4af' }
                : { borderColor: '#fecdd3', color: '#be123c', backgroundColor: '#fff' }}
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-150`}
                style={currentPage === idx + 1
                  ? { backgroundColor: '#fecaca', color: '#9f1239' }
                  : { color: '#fda4af' }}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150
                ${currentPage === totalPages
                  ? 'cursor-not-allowed'
                  : 'active:scale-95'
                }`}
              style={currentPage === totalPages
                ? { borderColor: '#fecdd3', color: '#fda4af' }
                : { borderColor: '#fecdd3', color: '#be123c', backgroundColor: '#fff' }}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* ── DETAIL DRAWER (SLIDE-IN FROM RIGHT) ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop */}
          <div
            ref={drawerBgRef}
            onClick={closeDrawer}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <div
            ref={drawerRef}
            className="relative bg-white w-full max-w-[460px] h-full flex flex-col p-8 z-10"
            style={{ borderLeft: '1px solid #fecdd3', boxShadow: '-8px 0 32px rgba(244,63,94,0.07)' }}
          >
            {/* Top row */}
            <div className="flex justify-between items-start pb-5" style={{ borderBottom: '1px solid #fecdd3' }}>
              <div>
                <span className="text-[10px] font-mono font-bold" style={{ color: '#fecdd3' }}>ID: {selectedItem.id}</span>
                <h3 className="text-xl font-extrabold mt-1 max-w-[300px] truncate" style={{ color: '#881337' }}>{selectedItem.nama_file}</h3>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#fda4af' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fecaca'; e.currentTarget.style.color = '#9f1239'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff1f2'; e.currentTarget.style.color = '#fda4af'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              
              {/* Highlight badge */}
              <div
                className="rounded-2xl border p-5 flex items-center justify-between"
                style={{
                  backgroundColor: LABEL_STYLE(selectedItem.hasil_prediksi).bg,
                  borderColor: LABEL_STYLE(selectedItem.hasil_prediksi).border
                }}
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Hasil Klasifikasi</span>
                  <p
                    className="text-2xl font-black mt-1"
                    style={{ color: LABEL_STYLE(selectedItem.hasil_prediksi).text }}
                  >
                    {selectedItem.hasil_prediksi}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: LABEL_STYLE(selectedItem.hasil_prediksi).dot + '20' }}
                >
                  🌶️
                </div>
              </div>

              {/* Confidence metric */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keyakinan (Confidence)</span>
                  <span className="font-mono font-bold text-slate-800">{selectedItem.confidence_score.toFixed(2)}%</span>
                </div>
                <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: '#fecdd3' }}>
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(selectedItem.confidence_score, 100)}%`,
                      backgroundColor: LABEL_STYLE(selectedItem.hasil_prediksi).dot
                    }}
                  />
                </div>
              </div>

              {/* Metadata Details */}
              <div className="pt-4 space-y-3.5 text-xs" style={{ borderTop: '1px solid #fecdd3' }}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Tanggal Uji</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedItem.tanggal_prediksi).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Model</span>
                  <span className="font-semibold text-slate-800">MobileNetV2 V1.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Format File</span>
                  <span className="font-semibold text-slate-800">Citra Digital (.png / .jpg)</span>
                </div>
              </div>

            </div>

            {/* Actions Footer inside drawer */}
            <div className="pt-4 flex gap-3" style={{ borderTop: '1px solid #fecdd3' }}>
              <button
                onClick={(e) => handleDelete(selectedItem.id, e)}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs transition-colors"
                style={{ backgroundColor: '#fecaca', color: '#be123c' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fda4af'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fecaca'}
              >
                Hapus Permanen
              </button>
              <button
                onClick={closeDrawer}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs transition-colors"
                style={{ backgroundColor: '#fff1f2', color: '#dc2626' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
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
