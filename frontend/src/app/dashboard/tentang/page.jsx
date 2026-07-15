'use client';
import React, { useEffect, useState } from 'react';

const STACK = [
  { name: 'Next.js', role: 'Frontend UI Framework', link: 'https://nextjs.org' },
  { name: 'FastAPI', role: 'Backend REST API', link: 'https://fastapi.tiangolo.com' },
  { name: 'MobileNetV2', role: 'CNN Deep Learning Model', link: 'https://keras.io/api/applications/mobilenet/' },
  { name: 'SQLite', role: 'Relational Database Store', link: 'https://www.sqlite.org' },
];

export default function TentangPage() {
  const [totalDataset, setTotalDataset] = useState(null);
  const [newCount, setNewCount] = useState('');

  const handleSetCount = async (e) => {
    e.preventDefault();
    const countNum = parseInt(newCount, 10);
    if (isNaN(countNum) || countNum < 0) {
      alert('Masukkan angka dataset yang valid');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/dataset/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: countNum })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Gagal mengatur dataset');
      setTotalDataset(countNum);
      setNewCount('');
    } catch (err) {
      console.error(err);
      alert('Gagal mengupdate dataset');
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/dataset/count`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total === 'number') setTotalDataset(data.total);
      })
      .catch((err) => console.error('Failed to fetch dataset count:', err));
  }, []);

  const METRICS = [
    {
      label: 'Arsitektur Model',
      value: 'MobileNetV2',
      desc: 'Arsitektur efisien berbasis CNN untuk perangkat komputasi terbatas.',
    },
    {
      label: 'Total Dataset',
      value: totalDataset !== null ? totalDataset.toString() : 'Loading...',
      desc: 'Citra berkualitas tinggi yang terbagi dalam set pelatihan dan validasi.',
    },
    {
      label: 'Komposisi Data',
      value: '100% Kaggle',
      desc: 'Penggunaan dataset sepenuhnya bersumber dari benchmark publik Kaggle.',
    },
    {
      label: 'Augmentasi Citra',
      value: 'Rotasi, Zoom, Flip, Shift',
      desc: 'Rekayasa variasi gambar untuk meningkatkan ketahanan akurasi model.',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-white">
      {/* ── HEADER ── */}
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-700">
          Informasi &amp; Metodologi
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Tentang Aplikasi
        </h1>
        <p className="text-base text-gray-600">
          Metodologi penelitian dan detail teknis sistem klasifikasi.
        </p>
      </div>

      {/* ── METHODOLOGY CONTAINER ── */}
      <div className="rounded-xl p-8 space-y-6 mb-8 border border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-900">Metodologi Penelitian</h2>
        <p className="text-sm leading-relaxed max-w-3xl text-gray-600">
          Sistem ini dikembangkan menggunakan pendekatan <strong className="font-semibold text-gray-900">Deep Learning</strong> dengan{' '}
          <strong className="font-semibold text-gray-900">Convolutional Neural Network (CNN)</strong> dan teknik{' '}
          <strong className="font-semibold text-gray-900">Transfer Learning</strong> berbasis arsitektur MobileNetV2 yang telah
          dilatih sebelumnya pada dataset ImageNet.
        </p>

        {/* Bento Grid Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl p-5 flex flex-col justify-between min-h-[140px] border border-gray-200 bg-gray-50"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{m.label}</span>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                <p className="text-xs mt-1 text-gray-500">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ARSITEKTUR & PENGEMBANG (Side by side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Column Left: Arsitektur Sistem */}
        <div className="lg:col-span-3 rounded-xl p-8 space-y-6 border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Arsitektur Sistem</h2>
          <div className="space-y-3">
            {STACK.map((item, i) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">{item.role}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Column Right: Pengembang */}
        <div className="lg:col-span-2 rounded-xl p-8 space-y-6 border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Pengembang</h2>

          {/* Profile Header */}
          <div className="flex items-center gap-4 pt-2">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xl">
              DF
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Difa Fadhilah</h3>
              <p className="text-xs font-mono text-gray-500 mt-1">2311081010</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 my-4" />

            {/* Form to update dataset count */}
            <form onSubmit={handleSetCount} className="mt-6 flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                placeholder="Jumlah dataset"
                className="w-32 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="rounded bg-rose-600 px-3 py-1 text-sm font-medium text-white hover:bg-rose-700 transition"
              >
                Update
              </button>
            </form>

          {/* Meta Info */}
          <div className="space-y-4">
            {[
              { label: 'Program Studi', value: 'Teknologi Rekayasa Perangkat Lunak' },
              { label: 'Jurusan', value: 'Teknologi Informasi' },
              { label: 'Institusi', value: 'Politeknik Negeri Padang' },
              { label: 'Tahun Lulus', value: '2026' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
