'use client';
import React, { useEffect, useState } from 'react';

const CHILI_TYPES = [
  {
    name: 'Cabai Setan',
    heat: 5,
    tag: 'Sangat Pedas',
    desc: 'Bentuk bulat agak gendut, warna orange hingga merah menyala, serta tingkat kepedasan yang sangat tinggi.',
  },
  {
    name: 'Cabai Celeng',
    heat: 3,
    tag: 'Pedas Sedang',
    desc: 'Cabai rawit hijau panjang yang sering digunakan untuk lalapan gorengan. Rasa pedas sedang dan renyah.',
  },
  {
    name: 'Cabai Putih',
    heat: 4,
    tag: 'Pedas Tajam',
    desc: 'Putih gading saat muda, dan merah jingga saat matang. Rasa pedas tajam khas pasar lokal.',
  },
  {
    name: 'Cabai Merah Keriting',
    heat: 3,
    tag: 'Pedas Sedang',
    desc: 'Memiliki bentuk memanjang, ramping, bergelombang/keriting. Rasa pedas sedang untuk bumbu sambal.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Buka Menu Klasifikasi',
    desc: 'Klik menu "Klasifikasi Cabai" di panel navigasi sebelah kiri.',
  },
  {
    num: '02',
    title: 'Unggah Gambar',
    desc: 'Upload gambar cabai rawit dalam format JPG atau PNG.',
  },
  {
    num: '03',
    title: 'Proses & Analisis',
    desc: 'Sistem menganalisis citra menggunakan model MobileNetV2.',
  },
  {
    num: '04',
    title: 'Simpan Riwayat',
    desc: 'Simpan hasil prediksi ke database untuk referensi mendatang.',
  },
];

export default function BerandaPage() {
  const [totalDataset, setTotalDataset] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/dataset/count`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total === 'number') setTotalDataset(data.total);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pb-16 bg-white">
      {/* ── HERO ── */}
      <section className="space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
          Deep Learning · MobileNetV2
        </div>

        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Sistem Klasifikasi Cabai Rawit Indonesia
        </h1>

        <p className="text-base text-gray-600 max-w-2xl">
          Aplikasi web ini memanfaatkan arsitektur <strong className="font-semibold text-gray-900">MobileNetV2</strong> modern untuk mendeteksi secara cepat 4 jenis cabai rawit populer langsung dari citra digital Anda.
        </p>

        <div className="pt-4">
          <a
            href="/dashboard/klasifikasi"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-sm transition-opacity bg-rose-600 text-white hover:bg-rose-700"
          >
            Mulai Klasifikasi Sekarang
          </a>
        </div>
      </section>

      {/* ── BENTO STATS ── */}
      <section className="mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="lg:col-span-2 p-6 rounded-xl border border-gray-200 bg-white">
            <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Total Kelas Terdeteksi</p>
            <div className="mt-8">
              <p className="text-5xl font-bold text-gray-900">4</p>
              <p className="text-sm font-medium text-gray-600 mt-2">Kategori Jenis Cabai Rawit</p>
              <p className="text-xs text-gray-500 mt-1">Setan · Celeng · Putih · Merah Keriting</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Dataset</p>
            <div className="mt-8">
              <p className="text-3xl font-bold text-gray-900">
                {totalDataset !== null ? totalDataset.toLocaleString('id-ID') : '...'}
              </p>
              <p className="text-xs font-medium text-gray-600 mt-2">Gambar citra latih &amp; uji</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Arsitektur</p>
            <div className="mt-8">
              <p className="text-3xl font-bold text-gray-900">CNN</p>
              <p className="text-xs font-medium text-gray-600 mt-2">MobileNetV2 Layer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── JENIS CABAI ── */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Jenis Cabai yang Dideteksi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHILI_TYPES.map((c) => (
            <div key={c.name} className="p-5 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">
                  {c.tag}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3">{c.desc}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Level Kepedasan</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <span key={d} className={`w-2.5 h-2.5 rounded-full ${d <= c.heat ? 'bg-rose-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CARA PENGGUNAAN ── */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Cara Penggunaan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div key={s.num} className="p-5 rounded-xl border border-gray-200 bg-white">
              <span className="text-2xl font-black text-gray-200">{s.num}</span>
              <h3 className="font-bold text-gray-900 mt-2 text-sm">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
