'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function CameraCapture({ onCapture, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // 'environment' = kamera belakang (default untuk foto cabai di pasar), 'user' = kamera depan
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraState, setCameraState] = useState('initializing'); // 'initializing' | 'active' | 'denied' | 'unsupported' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(true);

  // Hentikan semua track kamera aktif untuk hemat baterai & memori
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Memulai streaming kamera
  const startCamera = useCallback(async (targetFacing = facingMode) => {
    stopStream();
    setCameraState('initializing');
    setErrorMessage('');

    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Browser ini tidak mendukung akses kamera langsung. Gunakan opsi kamera bawaan atau unggah berkas.');
      return;
    }

    try {
      // Deteksi perangkat video yang tersedia
      if (navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        } catch {
          // Abaikan jika device enumeration dibatasi
        }
      }

      const constraints = {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Tunggu video metadata termuat agar play() berjalan lancar
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => setCameraState('active'))
            .catch(() => setCameraState('active'));
        };
      } else {
        setCameraState('active');
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Akses kamera ditolak. Izinkan izin kamera di peramban Anda untuk memotret langsung.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('error');
        setErrorMessage('Perangkat kamera tidak ditemukan pada sistem ini.');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Gagal menyalakan kamera.');
      }
      if (onError) onError(err.message);
    }
  }, [facingMode, stopStream, onError]);

  // Efek inisialisasi awal
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopStream();
    };
  }, [facingMode, startCamera, stopStream]);

  // Beralih antara kamera depan dan belakang
  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
  };

  // Mengambil foto dari frame video
  const takeSnapshot = () => {
    if (!videoRef.current || cameraState !== 'active') return;

    // Haptic feedback sederhana jika didukung HP
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // ignore
      }
    }

    // Efek visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Jika kamera depan, balik gambar secara horizontal (mirror) agar foto sesuai tampilan cermin
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `foto-cabai-${timestamp}.jpg`;
        const file = new File([blob], filename, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);

        stopStream();
        onCapture(file, previewUrl);
      },
      'image/jpeg',
      0.92
    );
  };

  // Fallback: input kamera bawaan OS HP
  const handleNativeCameraFallback = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const previewUrl = URL.createObjectURL(f);
    stopStream();
    onCapture(f, previewUrl);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-stone-900 aspect-[4/3] sm:aspect-[16/11] flex flex-col items-center justify-center border border-stone-800 shadow-inner">
      {/* Hidden canvas untuk capture snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          cameraState === 'active' ? 'opacity-100' : 'opacity-0'
        } ${facingMode === 'user' ? '-scale-x-100' : ''}`}
      />

      {/* Shutter Flash Animation */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-150" />
      )}

      {/* State Loading / Initializing */}
      {cameraState === 'initializing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-900/90 text-white p-6 text-center z-20">
          <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-200">Menghubungkan ke sensor kamera...</p>
        </div>
      )}

      {/* State Error atau Izin Ditolak */}
      {(cameraState === 'denied' || cameraState === 'error' || cameraState === 'unsupported') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-900 text-white p-6 text-center z-20">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl border border-rose-500/30">
            📷
          </div>
          <div className="max-w-xs space-y-1">
            <h4 className="font-bold text-white text-base">Tidak Dapat Membuka Kamera</h4>
            <p className="text-xs text-stone-300 leading-relaxed">{errorMessage}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs mt-2">
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
            >
              Coba Lagi
            </button>
            <label className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors shadow-sm text-center cursor-pointer">
              Kamera HP Bawaan
              <input
                type="file"
                accept="image/*"
                capture={facingMode}
                className="hidden"
                onChange={handleNativeCameraFallback}
              />
            </label>
          </div>
        </div>
      )}

      {/* Viewfinder UI Elements (Hanya aktif saat streaming kamera) */}
      {cameraState === 'active' && (
        <>
          {/* Target Reticle / Bingkai Panduan Fokus Cabai */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 z-10">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl border border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]">
              {/* Corner brackets aksen merah */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-rose-500 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-rose-500 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-rose-500 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-rose-500 rounded-br-lg" />
            </div>
          </div>

          {/* Top Bar: Petunjuk & Indikator Mode Kamera */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30 pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Arahkan cabai ke tengah kotak</span>
            </div>

            <div className="px-2.5 py-1.5 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 text-stone-200 text-[11px] font-semibold">
              {facingMode === 'environment' ? 'Belakang' : 'Depan'}
            </div>
          </div>

          {/* Bottom Bar: Kontrol Kamera (Tombol Shutter & Tombol Tukar Kamera) */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6 z-30 px-6">
            {/* Tombol Cadangan Kamera HP (Invisible placeholder untuk balance posisi) */}
            <div className="w-12 h-12 flex items-center justify-center" />

            {/* Tombol Shutter Utama (Jepret Foto) */}
            <button
              type="button"
              onClick={takeSnapshot}
              aria-label="Ambil Foto Cabai"
              className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-white/90 bg-white/20 p-1.5 shadow-2xl active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center group"
            >
              <span className="w-full h-full rounded-full bg-rose-600 group-hover:bg-rose-500 shadow-md flex items-center justify-center transition-colors">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </button>

            {/* Tombol Ganti Kamera Depan / Belakang */}
            <button
              type="button"
              onClick={toggleFacingMode}
              title={`Beralih ke kamera ${facingMode === 'environment' ? 'depan' : 'belakang'}`}
              aria-label="Ganti Kamera Depan atau Belakang"
              className="w-12 h-12 rounded-full bg-stone-900/75 hover:bg-stone-900 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center active:rotate-180 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5 text-stone-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
