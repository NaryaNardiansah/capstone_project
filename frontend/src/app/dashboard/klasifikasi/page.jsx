'use client';
import React, { useState } from 'react';

const LABEL_STYLE = (label) => {
  const m = {
    'Cabai Setan':          { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', level: 5, desc: 'Cabai setan pedas dengan bentuk lonjong dan ujung runcing.' },
    'Cabai Celeng':         { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', level: 3, desc: 'Varietas cabai dengan tingkat kepedasan sedang.' },
    'Cabai Putih':          { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', level: 4, desc: 'Cabai berwarna pucat saat matang, aroma khas.' },
    'Cabai Merah Keriting': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', level: 3, desc: 'Cabai merah dengan permukaan berkerut.' },
    'Bukan Cabai':          { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', level: 0, desc: 'Objek yang terdeteksi bukan termasuk kategori cabai.' },
  };
  return m[label] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', level: 0, desc: '' };
};

const STEPS = [
  { id: 'upload', num: '01', label: 'Unggah' },
  { id: 'analyzing', num: '02', label: 'Analisis' },
  { id: 'result', num: '03', label: 'Hasil' },
];

const PHOTO_TIPS = [
  'Gunakan pencahayaan alami yang merata',
  'Foto dari atas dengan latar bersih',
  'Pastikan cabai terlihat utuh dan fokus',
];

export default function KlasifikasiPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const step = loading ? 'analyzing' : result ? 'result' : 'upload';

  const handleFile = (f) => {
    if (!f || !['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) return;
    setFile(f);
    setResult(null);
    setError('');
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  const handlePredict = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError('');
    
    const fd = new FormData();
    fd.append('file', file);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/predict`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Gagal memproses gambar');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepState = (stepId) => {
    const order = ['upload', 'analyzing', 'result'];
    const current = order.indexOf(step);
    const target = order.indexOf(stepId);
    if (target < current) return 'completed';
    if (target === current) return 'active';
    return 'pending';
  };

  const sStyle = result ? LABEL_STYLE(result.predicted_class) : {};
  const confDisplay = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="min-h-screen pb-16 bg-white">
      {/* Header */}
      <header className="mb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700">
          Model: MobileNetV2 V1.0
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Klasifikasi Cabai Rawit</h1>
        <p className="text-base text-gray-600 max-w-xl">
          Unggah citra cabai rawit untuk memulai analisis identifikasi visual secara real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT: Upload hero card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-gray-200 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Media Uji Citra</h2>
              {file && (
                <button onClick={clearFile} className="text-xs font-bold px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors">
                  Hapus
                </button>
              )}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && document.getElementById('file-input-id')?.click()}
              className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] transition-colors
                ${file ? 'cursor-default border-gray-200' : 'cursor-pointer hover:bg-gray-50'}
                ${isDragOver ? 'border-rose-500 bg-rose-50' : 'border-gray-300'}
              `}
            >
              {preview ? (
                <div className="p-5 w-full h-full flex items-center justify-center">
                  <img src={preview} alt="Preview" className="max-h-[280px] w-full object-contain rounded-lg" />
                </div>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {isDragOver ? 'Lepaskan gambar...' : 'Klik atau seret gambar ke sini'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Format file: JPG, JPEG, PNG</p>
                  </div>
                </div>
              )}
              <input id="file-input-id" type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </div>

            {/* File info */}
            {file && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            )}

            {/* Tips */}
            {!file && (
              <div className="rounded-xl p-4 bg-gray-50 border border-gray-200">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tips Foto Terbaik</p>
                <ul className="space-y-1">
                  {PHOTO_TIPS.map((tip) => (
                    <li key={tip} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-rose-500">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handlePredict}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-bold text-base transition-colors
                ${!file || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
            >
              {loading ? 'Menganalisis Citra...' : 'Analisis Gambar'}
            </button>
          </div>
        </div>

        {/* RIGHT: Stepper + Results */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stepper */}
          <div className="rounded-2xl p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-8 right-8 top-5 h-0.5 bg-gray-200 -z-0" />
              {STEPS.map((s) => {
                const state = getStepState(s.id);
                const isActive = state === 'active';
                const isCompleted = state === 'completed';
                return (
                  <div key={s.id} className="flex flex-col items-center gap-2 z-10 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2
                      ${isActive ? 'bg-rose-600 border-rose-600 text-white' : 
                        isCompleted ? 'bg-rose-100 border-rose-100 text-rose-600' : 
                        'bg-white border-gray-200 text-gray-400'}`}
                    >
                      {isCompleted && s.id !== step ? '✓' : s.num}
                    </div>
                    <span className={`text-xs font-bold uppercase ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results panel */}
          <div className="rounded-2xl p-6 bg-white border border-gray-200 min-h-[340px] flex flex-col justify-center">
            {step === 'upload' && (
              <div className="text-center text-gray-500">
                <p className="font-bold text-gray-900">Menunggu Analisis</p>
                <p className="text-sm mt-2">Unggah citra cabai di area kiri lalu klik tombol analisis.</p>
              </div>
            )}

            {step === 'analyzing' && (
              <div className="text-center text-gray-500">
                <p className="font-bold text-gray-900">Model Sedang Berjalan...</p>
                <p className="text-sm mt-2">Melakukan ekstraksi fitur MobileNetV2.</p>
              </div>
            )}

            {step === 'result' && result && (
              <div className="space-y-5">
                <h3 className="font-bold text-gray-900 pb-3 border-b border-gray-200">Hasil Pengenalan</h3>

                <div className={`rounded-xl p-5 border ${sStyle.bg} border-gray-200`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Prediksi Kategori</p>
                  <p className={`text-2xl font-bold mt-1 ${sStyle.text}`}>{result.predicted_class}</p>
                  {sStyle.desc && <p className={`text-sm mt-2 ${sStyle.text}`}>{sStyle.desc}</p>}
                </div>

                {sStyle.level > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Skala Kepedasan</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <span key={d} className={`w-2.5 h-2.5 rounded-full ${d <= sStyle.level ? sStyle.dot : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider text-gray-500">Keyakinan (Confidence)</span>
                    <span className="font-bold text-gray-900">{confDisplay}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${sStyle.dot}`} style={{ width: `${confDisplay}%` }} />
                  </div>
                </div>

                {result.all_probabilities && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Distribusi Probabilitas</p>
                    <div className="space-y-2">
                      {Object.entries(result.all_probabilities).map(([name, prob]) => (
                        <div key={name} className="flex items-center justify-between text-sm">
                          <span className={name === result.predicted_class ? 'font-bold text-gray-900' : 'text-gray-500'}>{name}</span>
                          <span className={name === result.predicted_class ? 'font-bold text-rose-600' : 'text-gray-400'}>{prob}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearFile}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors mt-4"
                >
                  Analisis Ulang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
