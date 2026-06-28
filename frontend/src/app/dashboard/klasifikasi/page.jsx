'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CardRabbitTrack from '../../../components/klasifikasi/CardRabbitTrack';

const LABEL_STYLE = (label) => {
  const m = {
    'Cabai Setan':          { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', dot: '#ef4444', level: 5, desc: 'Cabai rawit pedas dengan bentuk lonjong dan ujung runcing.' },
    'Cabai Celeng':         { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', dot: '#22c55e', level: 3, desc: 'Varietas cabai dengan tingkat kepedasan sedang.' },
    'Cabai Putih':          { bg: '#fefce8', text: '#ca8a04', border: '#fef08a', dot: '#eab308', level: 4, desc: 'Cabai berwarna pucat saat matang, aroma khas.' },
    'Cabai Merah Keriting': { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', dot: '#f97316', level: 3, desc: 'Cabai merah dengan permukaan berkerut.' },
    'Bukan Cabai':          { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0', dot: '#94a3b8', level: 0, desc: 'Objek yang terdeteksi bukan termasuk kategori cabai.' },
  };
  return m[label] || { bg: '#f8fafc', text: '#475569', border: '#e2e8f0', dot: '#94a3b8', level: 0, desc: '' };
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

const TITLE_TEXT = 'Klasifikasi Cabai Rawit';

export default function KlasifikasiPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [step, setStep] = useState('upload');
  const [confDisplay, setConfDisplay] = useState(0);

  const badgeRef = useRef(null);
  const titleCharsRef = useRef([]);
  const subRef = useRef(null);
  const uploadCardRef = useRef(null);
  const dropZoneRef = useRef(null);
  const uploadIconRef = useRef(null);
  const btnRef = useRef(null);
  const stepperRef = useRef(null);
  const stepRefs = useRef([]);
  const stepLineRef = useRef(null);
  const resultPanelRef = useRef(null);
  const emptyIconRef = useRef(null);
  const bgOrb1 = useRef(null);
  const bgOrb2 = useRef(null);
  const bgOrb3 = useRef(null);
  const accentLineRef = useRef(null);
  const previewRef = useRef(null);

  const rabbitSpeed = useMemo(() => {
    if (loading) return 3;
    if (isDragOver) return 2;
    if (file && !result) return 0.7;
    if (result) return 0.5;
    return 1;
  }, [loading, isDragOver, file, result]);

  const handleMagnetic = (e, element) => {
    if (!element || loading || !file) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    import('gsap').then(({ gsap }) => {
      gsap.to(element, { x: x * 0.25, y: y * 0.25, duration: 0.25, ease: 'power2.out' });
    });
  };

  const resetMagnetic = (element) => {
    if (!element) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(element, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.35)' });
    });
  };

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(badgeRef.current, { y: 12, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)', delay: 0.1 });
      gsap.fromTo(titleCharsRef.current.filter(Boolean), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.45, ease: 'power3.out', delay: 0.15 });
      gsap.fromTo(subRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.4 });
      gsap.fromTo(uploadCardRef.current, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.1)', delay: 0.25 });
      gsap.fromTo(accentLineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power2.out', delay: 0.45, transformOrigin: 'top' });
      gsap.fromTo(dropZoneRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.35 });
      gsap.fromTo(btnRef.current, { y: 16, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)', delay: 0.5 });
      gsap.fromTo(stepperRef.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.35 });
      gsap.fromTo(stepRefs.current.filter(Boolean), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(1.2)', delay: 0.45 });
      gsap.fromTo(stepLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut', delay: 0.5, transformOrigin: 'left' });
      gsap.fromTo(resultPanelRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.55 });
      gsap.fromTo(emptyIconRef.current, { y: 0 }, { y: -6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
      gsap.to(bgOrb1.current, { x: 35, y: -25, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(bgOrb2.current, { x: -30, y: 20, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(bgOrb3.current, { x: 20, y: 30, duration: 26, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }, []);

  useEffect(() => {
    if (loading) setStep('analyzing');
    else if (result) setStep('result');
    else setStep('upload');
  }, [loading, result]);

  useEffect(() => {
    if (isDragOver && uploadIconRef.current) {
      import('gsap').then(({ gsap }) => {
        gsap.to(uploadIconRef.current, { scale: 1.12, y: -4, duration: 0.35, ease: 'back.out(2)' });
      });
    } else if (uploadIconRef.current) {
      import('gsap').then(({ gsap }) => {
        gsap.to(uploadIconRef.current, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      });
    }
  }, [isDragOver]);

  useEffect(() => {
    if (preview && previewRef.current) {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(previewRef.current, { scale: 0.85, opacity: 0, clipPath: 'inset(20% 20% 20% 20% round 16px)' }, {
          scale: 1, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 0.55, ease: 'power3.out',
        });
      });
    }
  }, [preview]);

  useEffect(() => {
    if (step === 'result' && result) {
      setTimeout(() => {
        import('gsap').then(({ gsap }) => {
          const els = resultPanelRef.current?.querySelectorAll('.res-anim');
          if (els?.length) {
            gsap.fromTo(els, { y: 20, opacity: 0, rotateX: -8 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' });
          }
          const bar = resultPanelRef.current?.querySelector('.confidence-progress');
          if (bar) {
            gsap.fromTo(bar, { width: 0 }, { width: bar.dataset.width, duration: 1, ease: 'power2.out', delay: 0.15 });
          }
          const target = Math.round(result.confidence * 100);
          gsap.fromTo({ val: 0 }, { val: 0 }, {
            val: target,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.2,
            onUpdate: function () {
              setConfDisplay(Math.round(this.targets()[0].val));
            },
          });
        });
      }, 50);
    } else {
      setConfDisplay(0);
    }
  }, [step, result]);

  const handleFile = useCallback((f) => {
    if (!f || !['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) return;
    setFile(f);
    setResult(null);
    setError('');
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(f);
  }, []);

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
    setStep('upload');
  };

  const handlePredict = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError('');
    import('gsap').then(({ gsap }) => {
      gsap.to(btnRef.current, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    });
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
      setStep('upload');
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

  const pct = result ? Math.round(result.confidence * 100) : 0;
  const sStyle = result ? LABEL_STYLE(result.predicted_class) : {};

  return (
    <div className="relative min-h-screen pb-16 select-none overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div ref={bgOrb1} className="gradient-mesh-orb absolute -top-20 right-0 w-[420px] h-[420px] rounded-full blur-[120px]" style={{ background: 'linear-gradient(135deg, #fecdd3, #fbcfe8, #fed7aa)', opacity: 0.45 }} />
        <div ref={bgOrb2} className="gradient-mesh-orb absolute top-1/3 -left-32 w-[380px] h-[380px] rounded-full blur-[100px]" style={{ background: 'linear-gradient(135deg, #ffe4e6, #fce7f3)', opacity: 0.4, animationDelay: '-8s' }} />
        <div ref={bgOrb3} className="gradient-mesh-orb absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[90px]" style={{ background: 'linear-gradient(135deg, #fda4af, #fecdd3)', opacity: 0.35, animationDelay: '-14s' }} />
        <div className="cinema-grain absolute inset-0 opacity-[0.03]" />
      </div>

      {/* Header */}
      <header className="mb-10 space-y-4">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(255,241,242,0.85)', color: '#be123c', border: '1px solid rgba(254,205,211,0.8)', boxShadow: '0 4px 20px rgba(244,63,94,0.08)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f43f5e' }} />
          Model: MobileNetV2 V1.0
        </div>

        <h1 className="font-display text-[2.5rem] sm:text-[3rem] font-bold tracking-tight leading-[1.1]" style={{
          background: 'linear-gradient(135deg, #881337 0%, #be123c 40%, #9f1239 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {TITLE_TEXT.split('').map((char, i) => (
            <span key={i} ref={(el) => { titleCharsRef.current[i] = el; }} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p ref={subRef} className="text-lg font-light max-w-xl leading-relaxed" style={{ color: '#be123c' }}>
          Unggah citra cabai rawit untuk memulai analisis identifikasi visual secara real-time.
        </p>
      </header>

      {/* Main grid — asymmetric */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* LEFT: Upload hero card */}
        <div className="lg:col-span-7">
          <CardRabbitTrack
            trackId="upload-rabbit-track"
            speedMultiplier={rabbitSpeed}
            className="rounded-[2rem]"
            style={{ zIndex: 1 }}
          >
            <div
              ref={uploadCardRef}
              className="relative rounded-[2rem] p-8 sm:p-10 space-y-6 backdrop-blur-xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.82)',
                border: '2px solid rgba(254,205,211,0.65)',
                boxShadow: isDragOver
                  ? '0 24px 60px rgba(244,63,94,0.18), 0 0 0 4px rgba(253,164,175,0.15)'
                  : '0 20px 50px rgba(244,63,94,0.1)',
                transition: 'box-shadow 0.35s ease',
                zIndex: 10,
              }}
            >
              {/* Section title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span ref={accentLineRef} className="w-[3px] h-7 rounded-full block" style={{ background: 'linear-gradient(180deg, #f43f5e, #fda4af)' }} />
                  <h2 className="font-display text-2xl font-semibold tracking-tight" style={{ color: '#881337' }}>Media Uji Citra</h2>
                </div>
                {file && (
                  <button
                    onClick={clearFile}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105"
                    style={{ color: '#be123c', backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Drop zone */}
              <div
                ref={dropZoneRef}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !file && document.getElementById('file-input-id')?.click()}
                className={`relative rounded-2xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px]
                  ${file ? 'cursor-default' : 'cursor-pointer'}
                  ${isDragOver ? 'scale-[1.015]' : ''}`}
                style={{
                  border: isDragOver ? '2px solid #f43f5e' : '2px dashed rgba(253,164,175,0.7)',
                  backgroundColor: isDragOver ? 'rgba(255,241,242,0.85)' : 'rgba(255,250,250,0.6)',
                  boxShadow: isDragOver ? '0 8px 32px rgba(244,63,94,0.15)' : 'none',
                }}
                role="button"
                tabIndex={0}
                aria-label="Area unggah citra cabai"
                onKeyDown={(e) => { if (e.key === 'Enter' && !file) document.getElementById('file-input-id')?.click(); }}
              >
                {!file && (
                  <div className={`absolute inset-0 rounded-2xl p-[2px] pointer-events-none upload-zone-shimmer ${isDragOver ? 'upload-zone-shimmer-active' : ''}`} style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', opacity: 0.35 }} />
                )}

                {preview ? (
                  <div ref={previewRef} className="p-5 w-full h-full flex items-center justify-center relative">
                    <img src={preview} alt="Preview citra cabai" className="max-h-[280px] w-full object-contain rounded-xl" style={{ boxShadow: '0 12px 40px rgba(244,63,94,0.12)' }} />
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-5 relative z-10">
                    <div
                      ref={uploadIconRef}
                      className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mx-auto float-icon"
                      style={{ background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', border: '2px solid #fecdd3', color: '#f43f5e', boxShadow: '0 8px 24px rgba(244,63,94,0.1)' }}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold" style={{ color: '#881337' }}>
                        {isDragOver ? 'Lepaskan untuk mengunggah...' : 'Klik atau seret gambar ke sini'}
                      </p>
                      <p className="text-sm mt-2" style={{ color: '#fda4af' }}>Format file yang didukung: JPG, JPEG, PNG</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-1">
                      {['JPG', 'JPEG', 'PNG'].map((ext) => (
                        <span key={ext} className="text-[11px] font-bold uppercase px-3 py-1 rounded-lg transition-transform hover:scale-105" style={{ color: '#be123c', border: '1px solid #fecdd3', backgroundColor: '#fff1f2' }}>
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <input id="file-input-id" type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              </div>

              {/* File info */}
              {file && (
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #fecaca, #fda4af)', color: '#881337' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#881337' }}>{file.name}</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: '#fda4af' }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              {/* Tips */}
              {!file && (
                <div className="rounded-2xl p-4 space-y-2" style={{ backgroundColor: 'rgba(255,241,242,0.5)', border: '1px dashed #fecdd3' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fda4af' }}>Tips Foto Terbaik</p>
                  <ul className="space-y-1.5">
                    {PHOTO_TIPS.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: '#be123c' }}>
                        <span style={{ color: '#f43f5e' }}>•</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 rounded-2xl p-4" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                  <span className="text-red-500 text-lg">⚠</span>
                  <p className="text-sm font-semibold text-red-600">{error}</p>
                </div>
              )}

              {/* CTA Button */}
              <button
                ref={btnRef}
                onMouseMove={(e) => handleMagnetic(e, btnRef.current)}
                onMouseLeave={() => resetMagnetic(btnRef.current)}
                onClick={handlePredict}
                disabled={!file || loading}
                className={`group relative w-full py-4 sm:py-5 rounded-2xl font-bold text-base overflow-hidden transition-all duration-200
                  ${!file || loading ? 'cursor-not-allowed opacity-50' : 'active:scale-[0.97] hover:shadow-2xl'}`}
                style={{
                  background: file && !loading ? 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)' : '#fff1f2',
                  color: file && !loading ? '#fff' : '#fda4af',
                  border: file && !loading ? 'none' : '1px solid #fecdd3',
                  boxShadow: file && !loading ? '0 12px 32px rgba(244,63,94,0.35)' : 'none',
                }}
                aria-label="Analisis gambar cabai"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Menganalisis Citra...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Analisis Gambar
                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </CardRabbitTrack>
        </div>

        {/* RIGHT: Stepper + Results */}
        <div className="lg:col-span-5 space-y-6">

          {/* Stepper */}
          <div
            ref={stepperRef}
            className="rounded-[1.75rem] p-7 sm:p-8 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.82)', border: '2px solid rgba(254,205,211,0.6)', boxShadow: '0 16px 40px rgba(244,63,94,0.08)' }}
          >
            <div className="flex items-center justify-between relative px-1">
              <div
                ref={stepLineRef}
                className="absolute left-8 right-8 top-[26px] h-[2px] -z-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #fecdd3, #fda4af, #fecdd3)' }}
              />
              {STEPS.map((s, idx) => {
                const state = getStepState(s.id);
                const isActive = state === 'active';
                const isCompleted = state === 'completed';
                return (
                  <div key={s.id} ref={(el) => { stepRefs.current[idx] = el; }} className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-sm font-mono font-bold transition-all duration-400
                        ${isActive ? 'step-active-glow' : ''}`}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #fb7185, #f43f5e)'
                          : isCompleted
                            ? '#fecaca'
                            : '#fff1f2',
                        border: `2px solid ${isActive || isCompleted ? '#fda4af' : '#fecdd3'}`,
                        color: isActive ? '#fff' : isCompleted ? '#9f1239' : '#fda4af',
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      {isCompleted && s.id !== step ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : s.num}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isActive ? '#881337' : '#fda4af' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results panel */}
          <div
            ref={resultPanelRef}
            className="rounded-[1.75rem] p-7 sm:p-8 min-h-[340px] flex flex-col justify-center backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.82)', border: '2px solid rgba(254,205,211,0.6)', boxShadow: '0 16px 40px rgba(244,63,94,0.08)' }}
          >
            {step === 'upload' && (
              <div className="text-center py-6 space-y-5">
                <div
                  ref={emptyIconRef}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto float-icon"
                  style={{ backgroundColor: '#fff1f2', border: '2px solid #fecdd3', color: '#fda4af' }}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="font-display text-lg font-bold" style={{ color: '#881337' }}>Menunggu Analisis</p>
                  <p className="text-sm leading-relaxed max-w-[240px] mx-auto" style={{ color: '#fda4af' }}>
                    Unggah citra cabai di area kiri lalu klik tombol analisis untuk memulai deteksi.
                  </p>
                </div>
              </div>
            )}

            {step === 'analyzing' && (
              <div className="text-center py-6 space-y-5">
                <div className="relative w-14 h-14 mx-auto">
                  <div className="w-14 h-14 rounded-full border-4 absolute inset-0" style={{ borderColor: '#fecdd3' }} />
                  <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin absolute inset-0" style={{ borderColor: '#f43f5e', borderTopColor: 'transparent' }} />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg font-bold" style={{ color: '#881337' }}>Model Sedang Berjalan</p>
                  <p className="text-sm" style={{ color: '#fda4af' }}>Melakukan ekstraksi fitur MobileNetV2...</p>
                </div>
                <div className="space-y-3 pt-2 max-w-[220px] mx-auto">
                  <div className="h-2.5 w-full rounded-full skeleton-shimmer" style={{ backgroundColor: '#fecdd3' }} />
                  <div className="h-2.5 w-3/4 rounded-full skeleton-shimmer mx-auto" style={{ backgroundColor: '#fecdd3' }} />
                  <div className="h-2.5 w-1/2 rounded-full skeleton-shimmer mx-auto" style={{ backgroundColor: '#fecdd3' }} />
                </div>
              </div>
            )}

            {step === 'result' && result && (
              <div className="space-y-5 relative">
                {result && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce pointer-events-none" style={{ animationDuration: '1.5s' }}>🎉</div>
                )}

                <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #fecdd3' }}>
                  <span className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #f43f5e, #fda4af)' }} />
                  <h3 className="font-display font-bold text-base" style={{ color: '#881337' }}>Hasil Pengenalan</h3>
                </div>

                <div
                  className="res-anim rounded-2xl border p-5 flex items-center justify-between"
                  style={{ backgroundColor: sStyle.bg, borderColor: sStyle.border }}
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Prediksi Kategori</span>
                    <p className="font-display text-2xl sm:text-3xl font-black mt-1" style={{ color: sStyle.text }}>{result.predicted_class}</p>
                    {sStyle.desc && <p className="text-xs mt-2 leading-relaxed opacity-80" style={{ color: sStyle.text }}>{sStyle.desc}</p>}
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: sStyle.dot + '25' }}>🌶️</div>
                </div>

                {sStyle.level > 0 && (
                  <div className="res-anim flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skala Kepedasan</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <span key={d} className="w-2.5 h-2.5 rounded-full transition-colors" style={{ backgroundColor: d <= sStyle.level ? sStyle.dot : '#fecdd3' }} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="res-anim space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyakinan (Confidence)</span>
                    <span className="font-mono font-bold text-lg" style={{ color: '#881337' }}>{confDisplay}%</span>
                  </div>
                  <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: '#fecdd3' }}>
                    <div
                      className="confidence-progress h-2.5 rounded-full"
                      data-width={`${pct}%`}
                      style={{ width: 0, background: `linear-gradient(90deg, ${sStyle.dot}, ${sStyle.dot}cc)` }}
                    />
                  </div>
                </div>

                {result.all_probabilities && (
                  <div className="res-anim space-y-3 pt-3" style={{ borderTop: '1px solid #fecdd3' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Distribusi Probabilitas</p>
                    <div className="space-y-2">
                      {Object.entries(result.all_probabilities).map(([name, prob]) => {
                        const isTop = name === result.predicted_class;
                        const ls = LABEL_STYLE(name);
                        return (
                          <div key={name} className="flex items-center gap-3 text-xs">
                            <span className={`flex-1 truncate ${isTop ? 'font-bold' : ''}`} style={{ color: isTop ? '#881337' : '#94a3b8' }}>{name}</span>
                            <span className="font-mono font-bold" style={{ color: isTop ? ls.dot : '#cbd5e1' }}>{prob}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {result.database_saved && (
                  <div className="res-anim flex items-center gap-2 rounded-2xl px-4 py-3" style={{ backgroundColor: '#ecfdf5', border: '1px solid #bbf7d0' }}>
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs font-semibold text-emerald-800">Riwayat pengujian disimpan otomatis</span>
                  </div>
                )}

                <div className="res-anim flex gap-3 pt-2">
                  <button
                    onClick={clearFile}
                    className="flex-1 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
                  >
                    Analisis Ulang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
