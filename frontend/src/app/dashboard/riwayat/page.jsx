'use client';
import React, { useEffect, useState } from 'react';

const LABEL_STYLE = (label) => {
  const m = {
    'Cabai Setan':          { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    'Cabai Celeng':         { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    'Cabai Putih':          { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Cabai Merah Keriting': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    'Bukan Cabai':          { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
  };
  return m[label] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
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

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
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

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Hapus riwayat prediksi ini dari database?')) return;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
    <div className="min-h-screen pb-16 bg-white">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Riwayat Prediksi</h1>
          <p className="mt-1 text-sm text-gray-600">Pantau, filter, dan kelola semua riwayat klasifikasi yang tersimpan.</p>
        </div>
        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Segarkan Data
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 p-6 rounded-xl border border-gray-200 bg-white">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Prediksi</span>
          <div className="mt-6">
            <p className="text-4xl font-bold text-gray-900">{total}</p>
            <p className="text-sm text-gray-500 mt-1">Seluruh riwayat aktif tersimpan.</p>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Rata-rata Keyakinan</span>
          <div className="mt-6">
            <p className="text-3xl font-bold text-gray-900">{avgConf}%</p>
            <p className="text-xs text-gray-500 mt-1">Tingkat keandalan model.</p>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Dominan Terdeteksi</span>
          <div className="mt-6">
            <p className="text-lg font-bold text-gray-900 truncate">{topChili}</p>
            <p className="text-xs text-gray-500 mt-1">Hasil prediksi terbanyak.</p>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari berdasarkan nama file atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-rose-500"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-rose-500 bg-white"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Cabai Setan">Cabai Setan</option>
            <option value="Cabai Celeng">Cabai Celeng</option>
            <option value="Cabai Putih">Cabai Putih</option>
            <option value="Cabai Merah Keriting">Cabai Merah Keriting</option>
            <option value="Bukan Cabai">Bukan Cabai</option>
          </select>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-rose-500 bg-white"
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
            <option value="Keyakinan Tertinggi">Keyakinan Tertinggi</option>
            <option value="Keyakinan Terendah">Keyakinan Terendah</option>
          </select>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">Mengambil data...</div>
        ) : error ? (
          <div className="py-20 text-center text-sm text-red-500">{error}</div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">Tidak ada riwayat ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Nama File</th>
                  <th className="px-6 py-4 font-medium">Hasil Klasifikasi</th>
                  <th className="px-6 py-4 font-medium">Keyakinan</th>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => {
                  const s = LABEL_STYLE(item.hasil_prediksi);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-mono">{item.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]">{item.nama_file}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${s.bg} ${s.text}`}>
                          {item.hasil_prediksi}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${s.dot}`} style={{ width: `${item.confidence_score}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{item.confidence_score.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(item.tanggal_prediksi).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => setSelectedItem(item)} className="text-rose-600 hover:text-rose-800 text-xs font-semibold">Detail</button>
                          <button onClick={(e) => handleDelete(item.id, e)} className="text-red-600 hover:text-red-800 text-xs font-semibold">Hapus</button>
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
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-medium text-gray-900">{firstIdx + 1}</span> -{' '}
            <span className="font-medium text-gray-900">{Math.min(lastIdx, filteredHistory.length)}</span> dari{' '}
            <span className="font-medium text-gray-900">{filteredHistory.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DETAIL ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 truncate">Detail Prediksi</h3>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Nama File</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedItem.nama_file}</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase">Hasil Klasifikasi</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-md text-sm font-semibold ${LABEL_STYLE(selectedItem.hasil_prediksi).bg} ${LABEL_STYLE(selectedItem.hasil_prediksi).text}`}>
                  {selectedItem.hasil_prediksi}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase mb-2">Keyakinan (Confidence)</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${LABEL_STYLE(selectedItem.hasil_prediksi).dot}`} style={{ width: `${selectedItem.confidence_score}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{selectedItem.confidence_score.toFixed(2)}%</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase">Tanggal Uji</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(selectedItem.tanggal_prediksi).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded-lg"
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
