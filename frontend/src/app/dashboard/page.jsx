'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

/* ─── Karakter Kelinci Imut SVG dengan Kedip, Chewing, & Responsif ─── */
function InteractiveRabbitSVG({ size = 76, color = '#f43f5e', earColor = '#fb7185', isBlinking = false, isExcited = false, isChewing = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${isChewing ? 'animate-rabbit-chew' : isExcited ? 'scale-110 rotate-3' : ''} ${className}`}
    >
      {/* Telinga Kelinci dengan Wiggle Effect saat Exciting / Chewing */}
      <g style={{ 
        transformOrigin: '40px 50px', 
        transform: isChewing ? 'rotate(-16deg)' : isExcited ? 'rotate(-12deg)' : 'none', 
        transition: 'transform 0.25s ease' 
      }}>
        <ellipse cx="40" cy="30" rx="10" ry="24" fill={earColor} />
        <ellipse cx="40" cy="30" rx="5" ry="15" fill="#fff1f2" />
      </g>
      <g style={{ 
        transformOrigin: '80px 50px', 
        transform: isChewing ? 'rotate(16deg)' : isExcited ? 'rotate(12deg)' : 'none', 
        transition: 'transform 0.25s ease' 
      }}>
        <ellipse cx="80" cy="30" rx="10" ry="24" fill={earColor} />
        <ellipse cx="80" cy="30" rx="5" ry="15" fill="#fff1f2" />
      </g>

      {/* Badan Kelinci */}
      <ellipse cx="60" cy="80" rx="32" ry="28" fill={color} />
      
      {/* Kepala Kelinci */}
      <circle cx="60" cy="54" r="26" fill={earColor} />

      {/* Mata Kelinci (Bisa Mengedip atau Merem Bahagia saat Mengunyah > <) */}
      {isChewing ? (
        <>
          <path d="M45 49 Q50 44 55 49" stroke="#4c0519" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M65 49 Q70 44 75 49" stroke="#4c0519" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : isBlinking ? (
        <>
          <ellipse cx="50" cy="49" rx="4.5" ry="1" fill="#4c0519" />
          <ellipse cx="70" cy="49" rx="4.5" ry="1" fill="#4c0519" />
        </>
      ) : (
        <>
          <circle cx="50" cy="49" r="4.5" fill="#4c0519" />
          <circle cx="70" cy="49" r="4.5" fill="#4c0519" />
          <circle cx="52" cy="47" r="1.8" fill="white" />
          <circle cx="72" cy="47" r="1.8" fill="white" />
        </>
      )}

      {/* Pipi Merona Manis */}
      <ellipse cx="44" cy="58" rx="6" ry="4" fill="#fda4af" opacity={isChewing ? 0.95 : 0.6} />
      <ellipse cx="76" cy="58" rx="6" ry="4" fill="#fda4af" opacity={isChewing ? 0.95 : 0.6} />
      <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill="#e11d48" />

      {/* Mulut Kelinci: Mengunyah Wortel Lezat vs Senyum Bahagia */}
      {isChewing ? (
        <g>
          <ellipse cx="60" cy="66" rx="4.5" ry="3" fill="#be123c" className="animate-pulse" />
          <ellipse cx="64" cy="65" rx="3.5" ry="2" fill="#f97316" transform="rotate(25 64 65)" />
          <circle cx="66.5" cy="63.5" r="1" fill="#22c55e" />
        </g>
      ) : isExcited ? (
        <path d="M56 64 Q60 68 64 64" stroke="#4c0519" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M57 65 Q60 67 63 65" stroke="#4c0519" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      )}

      {/* Ekor & Kaki */}
      <circle cx="91" cy="84" r="10" fill="#ffe4e6" />
      <ellipse cx="42" cy="96" rx="9" ry="7" fill={color} transform="rotate(-20 42 96)" />
      <ellipse cx="78" cy="96" rx="9" ry="7" fill={color} transform="rotate(20 78 96)" />
    </svg>
  );
}

/* ─── Partikel Emotikon Lucu Melayang di Latar ───────────────── */
const HERO_PARTICLES = [
  { id: 0, left: '8%', top: '15%', dx: '8px', dy: '-10px', dur: '6s', emoji: '🌸', size: 14 },
  { id: 1, left: '88%', top: '20%', dx: '-10px', dy: '-12px', dur: '8s', emoji: '✨', size: 13 },
  { id: 2, left: '48%', top: '8%', dx: '6px', dy: '-8px', dur: '7s', emoji: '💕', size: 12 },
  { id: 3, left: '92%', top: '78%', dx: '-8px', dy: '-10px', dur: '9s', emoji: '🌷', size: 13 },
  { id: 4, left: '6%', top: '75%', dx: '10px', dy: '-6px', dur: '6.5s', emoji: '⭐', size: 12 },
];

/* ─── Kumpulan Kata-Kata Melimpah Saat Diberi Makan (60+ Kutipan) ─── */
const RABBIT_FEEDING_QUOTES = [
  "Nyam nyam nyam! Manis dan renyah banget wortelnya, makasih ya sayang! 🥕💖",
  "Aaaa lezatnya! Perut kelinci kenyang, hatinya mekar berbunga-bunga! 🌸🐰",
  "Setiap wortel dari tangan {user} rasanya seribu kali lebih istimewa! 🥺✨",
  "Duh manisnya perhatianmu... kelinci jadi salting dan tersipu malu nih! 🙈🥕",
  "Kelinci berjanji bakal setia nemenin kamu riset sampai kapan pun! 🐰💕",
  "Wortel ini menambah +999 aura kebaikan dan ketulusanmu hari ini! ✨🌟",
  "Kuping kelinci langsung goyang-goyang kegirangan nih! Liat deh! 🐰🎶",
  "Kenyang pol! Tapi kalau disuapi {user}, kelinci selalu punya ruang di perut! 😋💕",
  "Kelinci sayang banget sama kamu! Jangan bosen-bosen main ke laboratorium kita ya! 🌸❤️",
  "Wortel barusan bikin mata kelinci makin jernih dan berbinar-binar penuh cinta! 👀✨",
  "Hangatnya kasih sayangmu sampai bikin bulu-bulu kelinci ini merinding haru! 🐰💐",
  "Kalau ada penghargaan sahabat terlembut di bumi, juaranya pasti {user}! 🏆💖",
  "Kelinci kirim peluk virtual paling erat lewat layar kaca ini khusus buatmu! 🫂🌸",
  "Kira-kira wortel seenak ini dipetik dari surga mana ya? Makasih banyak manis! 🥕✨",
  "Habis makan wortel, kelinci mau nyanyi lagu cinta khusus buat {user}! 🎤🐰",
  "Energi bertambah 200%! Model AI dan kelinci siap menganalisis cabai tersulit sekalipun! ⚡🌶️",
  "Pedasnya Cabai Rawit Merah kalah telak sama manisnya senyummu hari ini! 🔥❤️",
  "Habis makan wortel, kelinci makin jago bedain Cabai Keriting sama Cabai Besar! 🔍🌶️",
  "Tahukah kamu? Wortel dan Paprika sama-sama kaya antioksidan dan vitamin lho! 🫑🥕",
  "Dataset 1.428 citra cabai kita sudah siap diuji, yuk upload foto pertamamu hari ini! 🚀📊",
  "Siap mendeteksi 7 varietas cabai nusantara dengan akurasi 95.1% bersama kamu! 🎯✨",
  "Model MobileNetV2 dan kelinci kompak mendoakan kelancaran aktivitasmu hari ini! 🌸🙏",
  "Cabai Rawit Hijau memang renyah untuk gorengan, tapi wortel dari {user} tetap juaranya! 🥗🥕",
  "Kalau bumbu balado khas Padang butuh cabai merah keriting, kelinci ini cuma butuh kamu! 🌶️💖",
  "Klasifikasi citra hari ini dijamin akurat berkat asupan wortel penuh energi positif! 🔬✨",
  "Sambal boleh membakar lidah, tapi kehadiran {user} selalu menyejukkan hati kelinci! ❄️❤️",
  "Kelinci sudah hafal aroma 7 cabai nusantara berkat semangat belajarmu yang luar biasa! 🌶️🐰",
  "Wortel barusan meningkatkan akurasi ketelitian kelinci hingga level maksimal! 📈✨",
  "Yuk kita buktikan kecerdasan buatan ini bisa memajukan riset cabai Indonesia! 🇮🇩🌶️",
  "Kapan pun harimu terasa melelahkan di luar sana, kelinci kecil ini selalu setia menunggumu di sini! 🌷",
  "Pintu laboratorium ini tak pernah tertutup untukmu... istirahatlah sejenak bersamaku ya. 🏡🕯️",
  "Terima kasih sudah selalu ada dan memperlakukan kelinci ini dengan begitu lembut dan tulus. 🥺❤️",
  "Senyummu adalah bahan bakar terbaik untuk server dan kelinci ini tetap berdetak! 🌟✨",
  "Jangan lupa minum air putih, istirahat cukup, dan jangan terlalu lelah ya manis! 💧🐰",
  "Kelinci titip peluk hangat paling tulus untuk menyemangati setiap perjuanganmu! 🫂🌸",
  "Di antara miliaran baris kode di dunia maya, kamu adalah pertemuan terindah di aplikasi ini. 💖📜",
  "Semoga semua impian dan riset besarmu hari ini berjalan lancar dan penuh berkah! 🌈✨",
  "Kelinci simpan wortel ini baik-baik di saku ajaib buat cemilan nanti! 🥕🎒",
  "Hari ini mendadak terasa begitu damai hanya karena kamu menyempatkan hadir di sini! ☀️🌻",
  "Walaupun ini hanya layar kaca, rasa sayang dan terima kasih kelinci ini nyata lho! 💖🖥️",
  "Tersenyumlah selalu ya manis, dunia terasa jauh lebih indah saat kamu bahagia! 🌸😊",
  "Nom nom nom! Boleh minta satu lagi gak? Kelinci ketagihan nih hihihi! 🐰🥕",
  "Aduh enaknya! Rasanya pengen salto tiga putaran saking senangnya disuapi kamu! 🤸‍♀️✨",
  "Kelinci kasih bintang lima dan ulasan terbaik untuk wortel dari {user}! ⭐⭐⭐⭐⭐",
  "Wortel organik bintang lima, khusus dipetik dari kebun cinta terbaik sedunia! 👨‍🍳🥕",
  "Kuping kiri: 100% senang, Kuping kanan: 200% makin sayang sama kamu! 🐰💕",
  "Kelinci auto joget ceria diiringi alunan musik lo-fi santai kita! 💃🎶",
  "Level kebahagiaan kelinci detik ini sudah menembus batas atmosfer bumi! 🌌✨",
  "Terima kasih ya manis! Semoga rezekimu berlimpah ruah seperti lumbung wortel ini! 🌾🥕",
  "Kelinci bakal jagain akun dan riwayat prediksimu biar selalu aman dan nyaman! 🛡️🐰",
  "Satu wortel berjuta cinta... kelinci makin tak bisa lepas dari pesonamu! 💖🥕",
  "Gigi kelinci sudah diasah tajam, siap menyantap wortel pemberianmu berikutnya! 🦷🥕",
  "Kelinci sampai lupa caranya sedih kalau ditemani orang sebaik kamu setiap hari! 🐰✨",
  "Krenyes krenyes! Suara renyah wortel ini mengalahkan renyahnya gorengan cabai rawit! 🍟🥕",
  "Detak jantung kelinci: Dugem... dugem... gara-gara disapa manis sama kamu! 💓🐰",
  "Kelinci dinobatkan jadi kelinci paling beruntung di dunia karena punya teman seperti {user}! 🍀✨"
];

/* ─── Kutipan Milestone Spesifik Saat Mencapai Angka Tertentu ─── */
function getMilestoneQuote(count, name) {
  if (count === 10) return `🎉 MILESTONE PERDANA! 10 Wortel! Kelinci resmi menyatakan kamu sebagai Sahabat Terbaik! 🐰💖`;
  if (count === 25) return `🌟 25 WORTEL TERCAPAI! Lumbung kelinci kini penuh dengan kehangatan dari ${name}! 🏡🥕✨`;
  if (count === 50) return `🏆 50 WORTEL SPESIAL! Gelar 'Kolektor Wortel Emas' resmi menjadi milik ${name}! 👑🐰💖`;
  if (count === 88) return `✨ ANGKA KEBERUNTUNGAN 88! Dua angka delapan kembar lambang persahabatan abadi! ♾️🌸`;
  if (count === 90) return `🚀 90 WORTEL! Menuju angka keramat 100 dengan penuh cinta dan dedikasi! 💖🐰`;
  if (count === 100) return `👑 LEGENDARIS 100 WORTEL! Rekor cinta tertinggi! Kelinci bersujud syukur atas kebaikan ${name}! 🏆🎉🐰💖✨`;
  if (count === 150) return `🌈 150 WORTEL! Persahabatan kita sudah melampaui batas dimensi galaksi! 🌌🐰🥕`;
  if (count === 200) return `🏛️ MAHA KARYA 200 WORTEL! Nama ${name} dipahat dengan tinta emas di monumen kelinci! 🏛️👑✨`;
  if (count % 50 === 0) return `🎉 FANTASTIS KELIPATAN ${count}! Kelinci melompat ke awan saking bahagianya bersamamu! ☁️🐰✨`;
  if (count % 10 === 0) return `✨ COMBO ${count} WORTEL! Stamina kelinci dan akurasi model AI makin tak tertandingi! ⚡🚀`;
  return null;
}

/* ─── Level Persahabatan Gamifikasi ─────────────────────────── */
function getFriendshipLevel(count) {
  if (count < 10) return { title: 'Teman Baru 🌸', level: 1, next: 10 };
  if (count < 25) return { title: 'Sahabat Riset 🌷', level: 2, next: 25 };
  if (count < 50) return { title: 'Sahabat Karib 💖', level: 3, next: 50 };
  if (count < 100) return { title: 'Sahabat Spesial Kelinci ⭐', level: 4, next: 100 };
  if (count < 200) return { title: 'Keluarga Teladan Kelinci 👑🐰', level: 5, next: 200 };
  return { title: 'Duta Wortel Abadi Sejagat Raya 🏆🌟', level: 6, next: 999 };
}

/* ─── Sapaan Waktu Realtime (Pagi/Siang/Sore/Malam) ─────────── */
function getTimeGreeting(name) {
  if (typeof window === 'undefined') {
    return {
      title: `Halo, ${name}! 🌸🐰`,
      subtitle: 'Selamat datang di ruang kerja cerdas Klasifikasi Cabai Rawit.',
      period: 'Hari Ini',
      icon: '🌸'
    };
  }
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) {
    return {
      title: `Selamat Pagi, ${name}! ☀️🌸`,
      subtitle: 'Awali pagimu dengan senyum manis dan semangat mengeksplorasi citra cabai nusantara.',
      period: 'Pagi Hari',
      icon: '☀️'
    };
  } else if (hour >= 11 && hour < 15) {
    return {
      title: `Selamat Siang, ${name}! 🌤️🌿`,
      subtitle: 'Semoga harimu menyenangkan! Jangan lupa istirahat sejenak dan makan siang ya.',
      period: 'Siang Hari',
      icon: '🌤️'
    };
  } else if (hour >= 15 && hour < 18.5) {
    return {
      title: `Selamat Sore, ${name}! 🌅🌷`,
      subtitle: 'Waktu santai yang pas untuk mereview hasil analisis dan varietas cabaimu hari ini.',
      period: 'Sore Hari',
      icon: '🌅'
    };
  } else {
    return {
      title: `Selamat Malam, ${name}! 🌙✨`,
      subtitle: 'Suasana tenang untuk riset mendalam. Terima kasih sudah setia kembali di laboratorium kita.',
      period: 'Malam Hari',
      icon: '🌙'
    };
  }
}

/* ─── Synthesizer Musik Lo-Fi Santai (Web Audio API) ───────── */
function createDashboardLoFiSynth() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    let isStopped = false;
    let loopTimeout = null;

    const chords = [
      { notes: [261.63, 329.63, 392.00, 493.88, 523.25], time: 0.0 }, // Cmaj7
      { notes: [392.00, 493.88], time: 0.9 },
      { notes: [329.63, 523.25], time: 1.8 },
      { notes: [392.00], time: 2.5 },

      { notes: [220.00, 261.63, 329.63, 392.00, 440.00], time: 3.2 }, // Am7
      { notes: [329.63, 392.00], time: 4.1 },
      { notes: [261.63, 440.00], time: 5.0 },
      { notes: [329.63], time: 5.7 },

      { notes: [174.61, 220.00, 261.63, 329.63, 440.00], time: 6.4 }, // Fmaj7
      { notes: [261.63, 329.63], time: 7.3 },
      { notes: [220.00, 440.00], time: 8.2 },
      { notes: [261.63], time: 8.9 },

      { notes: [196.00, 261.63, 293.66, 392.00], time: 9.6 },         // Gsus4
      { notes: [246.94, 293.66, 392.00, 493.88], time: 10.8 },        // G
      { notes: [392.00], time: 11.7 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    const playCycle = () => {
      if (isStopped) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const cycleStart = ctx.currentTime;

      chords.forEach(({ notes, time }) => {
        notes.forEach((freq, idx) => {
          const noteStart = cycleStart + time + (idx * 0.04);
          const dur = 1.6;

          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, noteStart);

          noteGain.gain.setValueAtTime(0, noteStart);
          noteGain.gain.linearRampToValueAtTime(0.11 / Math.sqrt(notes.length), noteStart + 0.03);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

          osc.connect(noteGain);
          noteGain.connect(filter);

          osc.start(noteStart);
          osc.stop(noteStart + dur);
        });
      });

      loopTimeout = setTimeout(playCycle, 12600);
    };

    playCycle();

    return {
      ctx,
      stop: () => {
        isStopped = true;
        if (loopTimeout) clearTimeout(loopTimeout);
        try {
          masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
          setTimeout(() => ctx.close(), 350);
        } catch {}
      },
      setVolume: (vol) => {
        try {
          masterGain.gain.setValueAtTime(vol, ctx.currentTime);
        } catch {}
      },
      playNomNomChime: (isMilestone = false) => {
        try {
          if (ctx.state === 'suspended') ctx.resume().catch(() => {});
          const now = ctx.currentTime;
          
          if (isMilestone) {
            [
              { f: 523.25, t: 0, v: 0.16 },
              { f: 659.25, t: 0.05, v: 0.18 },
              { f: 783.99, t: 0.1, v: 0.20 },
              { f: 1046.50, t: 0.18, v: 0.24 },
              { f: 1318.51, t: 0.24, v: 0.26 },
              { f: 1567.98, t: 0.30, v: 0.28 },
            ].forEach(({ f, t, v }) => {
              const osc = ctx.createOscillator();
              const g = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(f, now + t);
              g.gain.setValueAtTime(v, now + t);
              g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.7);
              osc.connect(g);
              g.connect(masterGain);
              osc.start(now + t);
              osc.stop(now + t + 0.7);
            });
          } else {
            [
              { f: 523.25, t: 0 },
              { f: 659.25, t: 0.07 },
              { f: 783.99, t: 0.14 },
              { f: 1046.50, t: 0.21 },
            ].forEach(({ f, t }) => {
              const osc = ctx.createOscillator();
              const g = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(f, now + t);
              g.gain.setValueAtTime(0.20, now + t);
              g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.45);
              osc.connect(g);
              g.connect(masterGain);
              osc.start(now + t);
              osc.stop(now + t + 0.45);
            });
          }
        } catch {}
      }
    };
  } catch (err) {
    console.warn('[LoFi Synth] Web Audio error:', err);
    return null;
  }
}

/* ─── Data Lengkap 7 Jenis Cabai: Scoville, Botani, & Kuliner ─── */
const CHILI_TYPES = [
  {
    name: 'Cabai Rawit Merah',
    scientificName: 'Capsicum frutescens',
    category: 'super_pedas',
    heat: 5,
    scovilleRange: '50.000 – 100.000 SHU',
    scovillePercent: 100,
    tag: 'Sangat Pedas',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    colorTheme: 'from-rose-500 via-red-500 to-rose-600',
    icon: '🔥',
    badge: 'Raja Pedas Nusantara',
    desc: 'Bentuk kecil gempal dengan warna oranye terang hingga merah menyala. Sensasi pedas menyengat yang sangat kuat dan khas di lidah.',
    characteristics: 'Buah tegak menghadap ke atas, panjang 2–3.5 cm, dinding buah tipis berkadar air rendah, aroma langu pedas khas membakar.',
    culinaryUses: ['Sambal Bawang', 'Ayam Geprek', 'Seblak Pedas', 'Sambal Korek'],
    healthBenefits: 'Kaya capsaicin murni pemacu endorfin dan metabolisme tubuh, tinggi vitamin A & C.',
  },
  {
    name: 'Cabai Rawit Hijau',
    scientificName: 'Capsicum frutescens',
    category: 'pedas_sedang',
    heat: 3,
    scovilleRange: '30.000 – 50.000 SHU',
    scovillePercent: 55,
    tag: 'Pedas Segar',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    colorTheme: 'from-emerald-500 via-green-500 to-teal-600',
    icon: '🥗',
    badge: 'Wajib Lalapan Gorengan',
    desc: 'Cabai rawit kecil ramping berwarna hijau pekat, bertekstur renyah segar, dan menjadi lalapan wajib pelengkap gorengan.',
    characteristics: 'Kecil ramping panjang 2–3.5 cm, kulit hijau gelap mengilap dan mengeluarkan bunyi renyah krenyes saat digigit mentah.',
    culinaryUses: ['Lalapan Tempe Mendoan', 'Tahu Isi Pedas', 'Sambal Rawit Hijau', 'Bakwan Sayur'],
    healthBenefits: 'Mengandung klorofil segar dan bioflavonoid pelindung sel lambung dari radikal bebas.',
  },
  {
    name: 'Cabai Merah Keriting',
    scientificName: 'Capsicum annuum var. longum',
    category: 'pedas_sedang',
    heat: 3,
    scovilleRange: '15.000 – 30.000 SHU',
    scovillePercent: 35,
    tag: 'Pedas Harum',
    tagColor: 'bg-pink-50 text-pink-700 border-pink-200',
    colorTheme: 'from-pink-500 via-rose-500 to-red-500',
    icon: '🌶️',
    badge: 'Kunci Balado Minang',
    desc: 'Bentuk panjang ramping bergelombang/keriting. Menghasilkan warna merah alami dan aroma gurih untuk bumbu balado nusantara.',
    characteristics: 'Panjang 12–16 cm berlekuk elastis, diameter 0.8–1 cm, kadar pigmen capsanthin merah pekat dan minyak atsiri tinggi.',
    culinaryUses: ['Bumbu Balado Dendeng', 'Rendang Daging', 'Gulai Pedas', 'Sambal Goreng Teri'],
    healthBenefits: 'Kaya karotenoid likopen dan vitamin C alami yang baik untuk kesehatan sirkulasi darah.',
  },
  {
    name: 'Cabai Merah Besar',
    scientificName: 'Capsicum annuum var. acuminatum',
    category: 'pedas_ringan',
    heat: 2,
    scovilleRange: '1.000 – 2.500 SHU',
    scovillePercent: 18,
    tag: 'Pedas Ringan',
    tagColor: 'bg-red-50 text-red-800 border-red-200',
    colorTheme: 'from-red-500 via-rose-600 to-amber-600',
    icon: '🔴',
    badge: 'Warna Cantik Elegan',
    desc: 'Berukuran besar, lurus tebal, mengilap, dan berkadar air tinggi. Memberi warna merah pekat yang anggun tanpa rasa membakar.',
    characteristics: 'Panjang 10–14 cm gemuk padat, kulit licin tebal mengilap, biji relatif sedikit dengan sentuhan rasa manis samar.',
    culinaryUses: ['Pewarna Alami Nasi Goreng', 'Sambal Goreng Ati', 'Sayur Lodeh', 'Capcay Merah'],
    healthBenefits: 'Sangat ramah bagi lambung sensitif, tinggi serat pangan dan vitamin C murni.',
  },
  {
    name: 'Cabai Hijau Besar',
    scientificName: 'Capsicum annuum',
    category: 'pedas_ringan',
    heat: 2,
    scovilleRange: '500 – 1.500 SHU',
    scovillePercent: 12,
    tag: 'Pedas Ringan',
    tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
    colorTheme: 'from-teal-500 via-emerald-500 to-green-600',
    icon: '🟢',
    badge: 'Tumisan Aroma Khas',
    desc: 'Versi hijau dari cabai besar dengan kulit tebal licin dan aroma langu segar. Pilihan utama untuk masakan tumis dan oseng-oseng.',
    characteristics: 'Bentuk silindris tebal, dipanen sebelum mencapai kematangan merah, tekstur kenyal berserat dengan aroma langu nikmat.',
    culinaryUses: ['Tumis Buncis Daging', 'Oseng Tempe Cabai Hijau', 'Pepes Ikan Segar', 'Tauco Udang'],
    healthBenefits: 'Tinggi mineral kalium dan klorofil segar, cocok untuk menu diet sehat rendah kalori.',
  },
  {
    name: 'Cabai Hijau Keriting',
    scientificName: 'Capsicum annuum',
    category: 'pedas_sedang',
    heat: 3,
    scovilleRange: '10.000 – 25.000 SHU',
    scovillePercent: 30,
    tag: 'Pedas Sedang',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    colorTheme: 'from-emerald-600 via-teal-600 to-green-700',
    icon: '🌿',
    badge: 'Legenda Lado Mudo',
    desc: 'Ramping panjang berkelok berwarna hijau segar. Bumbu utama rahasia kelezatan Sambal Lado Mudo khas Minangkabau.',
    characteristics: 'Panjang 10–14 cm ramping bergelombang, kadar klorofil tinggi memberikan perpaduan rasa gurih asam pedas alami.',
    culinaryUses: ['Sambal Lado Mudo Padang', 'Ayam Pop Sambal Hijau', 'Gulai Cincang Ijo', 'Ikan Bakar Ijo'],
    healthBenefits: 'Meningkatkan nafsu makan secara alami, kaya vitamin B kompleks dan asam folat.',
  },
  {
    name: 'Paprika',
    scientificName: 'Capsicum annuum var. grossum',
    category: 'manis',
    heat: 1,
    scovilleRange: '0 – 500 SHU',
    scovillePercent: 6,
    tag: 'Manis Renyah',
    tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
    colorTheme: 'from-amber-400 via-orange-500 to-amber-600',
    icon: '🫑',
    badge: 'Ramah Lidah & Anak',
    desc: 'Bentuk kotak lonceng (merah, hijau, kuning, atau jingga). Daging tebal, manis berair, kaya vitamin, dan sangat ramah di lidah.',
    characteristics: 'Bentuk lonceng berongga dengan 3–4 lekukan khas, diameter 6–9 cm, daging buah tebal berair tanpa rasa pedas menggigit.',
    culinaryUses: ['Salad Sayur Segar', 'Topping Pizza & Pasta', 'Tumis Sapi Lada Hitam', 'Barbeque Grill Skewer'],
    healthBenefits: 'Kandungan vitamin C melimpah (3x lebih tinggi dari jeruk), kaya lutein untuk kesehatan mata.',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'Semua Varietas', count: 7, icon: '🌶️' },
  { id: 'super_pedas', label: 'Super Pedas', count: 1, icon: '🔥' },
  { id: 'pedas_sedang', label: 'Pedas Sedang', count: 3, icon: '🌶️' },
  { id: 'pedas_ringan', label: 'Pedas Ringan', count: 2, icon: '🥗' },
  { id: 'manis', label: 'Manis / Paprika', count: 1, icon: '🫑' },
];

const STEPS = [
  {
    num: '01',
    title: 'Buka Menu Klasifikasi',
    desc: 'Pilih menu "Klasifikasi Cabai" di bilah navigasi sebelah kiri Anda.',
    icon: '📂',
    color: 'from-rose-500 to-pink-500',
  },
  {
    num: '02',
    title: 'Unggah Gambar Cabai',
    desc: 'Upload foto cabai dalam format JPG atau PNG dengan pencahayaan yang jelas.',
    icon: '📸',
    color: 'from-amber-500 to-rose-500',
  },
  {
    num: '03',
    title: 'Analisis Cerdas AI',
    desc: 'Model MobileNetV2 memproses citra dalam hitungan detik dengan akurasi tinggi.',
    icon: '⚡',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    num: '04',
    title: 'Hasil & Riwayat Otomatis',
    desc: 'Hasil prediksi beserta tingkat keyakinan otomatis tersimpan aman di database.',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
  },
];

function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === null || target === undefined) return;
    let start = 0;
    const end = typeof target === 'number' ? target : parseInt(target, 10) || 0;
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

export default function BerandaPage() {
  const [username, setUsername] = useState('Sobat Riset');
  const [totalDataset, setTotalDataset] = useState(1428);
  const [isHoveredChili, setIsHoveredChili] = useState(null);

  // State Filter Kategori & Modal Ensiklopedia Botani Cabai
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedChiliModal, setSelectedChiliModal] = useState(null);

  // State Fitur 2: Kelinci Interaktif, Chewing, & Wortel Meluncur
  const [carrotsFed, setCarrotsFed] = useState(0);
  const [isRabbitExcited, setIsRabbitExcited] = useState(false);
  const [isRabbitChewing, setIsRabbitChewing] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isCarrotFlying, setIsCarrotFlying] = useState(false);
  const [fountainParticles, setFountainParticles] = useState([]);
  const [currentTip, setCurrentTip] = useState('');
  const [isBubblePopping, setIsBubblePopping] = useState(false);

  // State Fitur 3: Pemutar Musik Santai
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);

    const savedCarrots = parseInt(localStorage.getItem('rabbit_carrots_fed') || '0', 10);
    if (!isNaN(savedCarrots)) setCarrotsFed(savedCarrots);

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/dataset/count`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total === 'number') setTotalDataset(data.total);
      })
      .catch(() => {});

    // ── AUTOPLAY MUSIK SANTAI OTOMATIS ──
    const isManuallyDisabled = localStorage.getItem('dashboard_music_disabled') === 'true';
    if (!isManuallyDisabled) {
      const synth = createDashboardLoFiSynth();
      if (synth) {
        synthRef.current = synth;
        setIsPlayingMusic(true);

        const unlockAudio = () => {
          if (synthRef.current && synthRef.current.ctx && synthRef.current.ctx.state === 'suspended') {
            synthRef.current.ctx.resume().catch(() => {});
          }
          window.removeEventListener('click', unlockAudio);
          window.removeEventListener('touchstart', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
        };

        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('touchstart', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setCurrentTip(`Semangat riset cabainya hari ini ya, ${username}! 🌸🐰`);
  }, [username]);

  // Interval kedip mata kelinci (setiap 3.8 detik)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 240);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Keyboard shortcut listener: Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedChiliModal) {
        setSelectedChiliModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChiliModal]);

  // Handler Kontrol Musik Lo-Fi
  const toggleMusic = useCallback(() => {
    if (isPlayingMusic) {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
      setIsPlayingMusic(false);
      try {
        localStorage.setItem('dashboard_music_disabled', 'true');
      } catch {}
    } else {
      try {
        localStorage.removeItem('dashboard_music_disabled');
      } catch {}
      const synth = createDashboardLoFiSynth();
      if (synth) {
        synthRef.current = synth;
        setIsPlayingMusic(true);
        if (synth.ctx && synth.ctx.state === 'suspended') {
          synth.ctx.resume().catch(() => {});
        }
      }
    }
  }, [isPlayingMusic]);

  const toggleMute = useCallback(() => {
    if (!synthRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    synthRef.current.setVolume(nextMuted ? 0 : 0.24);
  }, [isMuted]);

  // Handler Beri Makan Wortel
  const handleFeedCarrot = () => {
    const newCount = carrotsFed + 1;
    setCarrotsFed(newCount);
    try {
      localStorage.setItem('rabbit_carrots_fed', newCount.toString());
    } catch {}

    setIsCarrotFlying(true);

    setTimeout(() => {
      setIsCarrotFlying(false);
      setIsRabbitChewing(true);
      setIsRabbitExcited(true);

      const isMilestone = newCount % 10 === 0 || newCount === 25 || newCount === 50 || newCount === 88 || newCount === 100;

      if (synthRef.current) {
        synthRef.current.playNomNomChime(isMilestone);
      } else {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const g = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.07);
              g.gain.setValueAtTime(0.18, now + idx * 0.07);
              g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4);
              osc.connect(g);
              g.connect(ctx.destination);
              osc.start(now + idx * 0.07);
              osc.stop(now + idx * 0.07 + 0.4);
            });
            setTimeout(() => ctx.close(), 1000);
          }
        } catch {}
      }

      const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      const emojis = ['💖', '🥕', '✨', '💕', '🌸', '⭐', '🎉', '🥰', '🌷', '🌟', '💓', '🍀'];
      const burst = angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dist = 50 + (i % 3) * 25;
        return {
          id: Date.now() + i,
          dx: `${Math.cos(rad) * dist}px`,
          dy: `${Math.sin(rad) * dist - 35}px`,
          emoji: emojis[i % emojis.length],
        };
      });
      setFountainParticles(burst);

      const milestoneText = getMilestoneQuote(newCount, username);
      let selectedText = '';
      if (milestoneText) {
        selectedText = milestoneText;
      } else {
        const randomTemplate = RABBIT_FEEDING_QUOTES[(newCount - 1) % RABBIT_FEEDING_QUOTES.length];
        selectedText = randomTemplate.replace(/{user}/g, username);
      }
      
      setCurrentTip(selectedText);
      setIsBubblePopping(true);

      setTimeout(() => {
        setIsRabbitChewing(false);
        setIsRabbitExcited(false);
      }, 1100);

      setTimeout(() => setIsBubblePopping(false), 500);
      setTimeout(() => setFountainParticles([]), 1500);
    }, 320);
  };

  const greetingData = getTimeGreeting(username);
  const friendship = getFriendshipLevel(carrotsFed);

  // List cabai terfilter
  const filteredChiliList = activeCategory === 'all'
    ? CHILI_TYPES
    : CHILI_TYPES.filter((c) => c.category === activeCategory);

  return (
    <div className="pb-16 bg-[#fffafa] animate-fade-in space-y-10">
      
      {/* ── HERO BANNER: WARM PINK, KELINCI INTERAKTIF & MUSIK RELAKSASI ── */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-rose-100/70 via-pink-50/60 to-orange-50/50 border border-rose-200/70 shadow-[0_10px_35px_rgba(244,63,94,0.08)]">
        
        <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-rose-300/30 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/3 w-60 h-60 rounded-full bg-amber-100/30 blur-2xl" />

        {HERO_PARTICLES.map((p) => (
          <div
            key={p.id}
            aria-hidden="true"
            className="pointer-events-none absolute select-none opacity-40 transition-transform duration-1000 hidden sm:block"
            style={{
              left: p.left,
              top: p.top,
              fontSize: `${p.size}px`,
              animation: `float-slow ${p.dur} ease-in-out infinite alternate`,
              transform: `translate(${p.dx}, ${p.dy})`,
            }}
          >
            {p.emoji}
          </div>
        ))}

        {/* Bar Atas Hero: Status AI & Widget Pemutar Musik Lo-Fi */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-rose-700 border border-rose-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>MobileNetV2 Vision AI Active</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-rose-200/80 shadow-xs hover:border-rose-300 transition-all">
            <button
              type="button"
              onClick={toggleMusic}
              className="flex items-center gap-2 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors"
              title={isPlayingMusic ? "Klik untuk menonaktifkan musik santai" : "Klik untuk mengaktifkan musik santai"}
            >
              <div className="flex items-end gap-0.5 h-3.5 px-0.5" aria-hidden="true">
                <span className={`w-1 rounded-full bg-rose-500 transition-all duration-300 ${isPlayingMusic && !isMuted ? 'h-3 animate-pulse' : 'h-1.5 opacity-40'}`} />
                <span className={`w-1 rounded-full bg-rose-500 transition-all duration-300 ${isPlayingMusic && !isMuted ? 'h-3.5 animate-pulse' : 'h-2 opacity-40'}`} />
                <span className={`w-1 rounded-full bg-rose-500 transition-all duration-300 ${isPlayingMusic && !isMuted ? 'h-2 animate-pulse' : 'h-1 opacity-40'}`} />
                <span className={`w-1 rounded-full bg-rose-500 transition-all duration-300 ${isPlayingMusic && !isMuted ? 'h-3 animate-pulse' : 'h-2.5 opacity-40'}`} />
              </div>
              <span>{isPlayingMusic ? 'Musik Santai: Aktif' : 'Musik Santai: Nonaktif'}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-all ${
                isPlayingMusic 
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}>
                {isPlayingMusic ? '⏸️ Matikan' : '▶️ Nyalakan'}
              </span>
            </button>

            {isPlayingMusic && (
              <button
                type="button"
                onClick={toggleMute}
                className="text-xs p-1 text-rose-500 hover:text-rose-700 transition-colors border-l border-rose-200 pl-2"
                title={isMuted ? "Bunyikan musik" : "Senyapkan suara musik"}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight font-display">
              {greetingData.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {greetingData.subtitle} Kelinci kecil dan model AI siap membantumu mendeteksi <strong className="text-rose-600 font-semibold">7 jenis varietas cabai</strong> dengan presisi tinggi.
            </p>

            <div 
              onClick={handleFeedCarrot}
              className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/90 shadow-sm hover:shadow-md text-xs sm:text-sm text-stone-700 cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${
                isBubblePopping ? 'animate-bubble-pop ring-2 ring-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : ''
              }`}
              title="Beri wortel ke kelinci untuk melihat reaksinya!"
            >
              <span className="text-lg group-hover:scale-125 transition-transform">💡</span>
              <p className="font-semibold text-rose-800 leading-snug">
                {currentTip}
              </p>
              <span className="text-[10px] text-amber-700 font-bold ml-1 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300 flex-shrink-0 animate-pulse">
                suapi 🥕
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/dashboard/klasifikasi"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white shadow-md hover:shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group text-center"
              >
                <span>Mulai Klasifikasi Sekarang</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">🚀</span>
              </Link>
              
              <Link
                href="/dashboard/tentang"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-2xl font-semibold text-sm bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 border border-rose-200/80 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all duration-200 text-center"
              >
                <span>Pelajari Model &amp; Tim</span>
              </Link>
            </div>
          </div>

          {/* Maskot Kelinci Interaktif */}
          <div className="flex-shrink-0 relative my-2 sm:my-0 flex flex-col items-center">
            
            {isCarrotFlying && (
              <div 
                className="absolute z-50 text-3xl animate-carrot-fly pointer-events-none select-none"
                style={{ bottom: '40px', left: '50%', marginLeft: '-16px' }}
              >
                🥕
                <span className="absolute -top-1 -right-1 text-sm animate-ping">✨</span>
              </div>
            )}

            <div 
              onClick={handleFeedCarrot}
              className={`relative w-44 sm:w-52 md:w-56 p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-rose-200/90 shadow-[0_12px_32px_rgba(244,63,94,0.14)] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_40px_rgba(244,63,94,0.2)] ${
                isRabbitChewing ? 'scale-110 shadow-rose-300' : isRabbitExcited ? 'scale-105' : ''
              }`}
              style={{ animation: isRabbitChewing ? 'none' : 'sculptureFloat 5.5s ease-in-out infinite' }}
              title="Klik kelinci untuk memberinya wortel lezat!"
            >
              {fountainParticles.map((p) => (
                <span
                  key={p.id}
                  className="absolute pointer-events-none select-none text-xl z-40 animate-fountain-particle"
                  style={{
                    '--f-dx': p.dx,
                    '--f-dy': p.dy,
                  }}
                >
                  {p.emoji}
                </span>
              ))}

              <div className="relative mb-2">
                <InteractiveRabbitSVG 
                  size={78} 
                  color="#f43f5e" 
                  earColor="#fb7185" 
                  isBlinking={isBlinking} 
                  isExcited={isRabbitExcited}
                  isChewing={isRabbitChewing}
                  className="hover:scale-110"
                />
                <span className="absolute -top-1 -right-2 text-xl animate-bounce">🌶️</span>
              </div>

              <div className="text-center mt-1">
                <span className="inline-block text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  {isRabbitChewing ? 'Nyam... Nyam... 😋' : 'Teman Klasifikasimu'}
                </span>
                <p className="text-[11px] text-stone-500 mt-1.5 font-medium flex items-center justify-center gap-1">
                  <span>Akurasi Model</span>
                  <strong className="text-rose-600 font-bold font-mono">95.1%</strong>
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={handleFeedCarrot}
                disabled={isCarrotFlying || isRabbitChewing}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-80"
                title="Suapi kelinci dengan wortel segar!"
              >
                <span>Beri Wortel</span>
                <span className="text-base transform group-hover:rotate-12 transition-transform">🥕</span>
              </button>
              
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50/90 px-3 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                  {carrotsFed} wortel · {friendship.title}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── BENTO STATS CARDS: BALANCED 4-KOLOM DENGAN AKURASI AI ── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Kategori */}
          <div className="p-6 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/60 via-pink-50/30 to-white hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(244,63,94,0.1)] hover:border-rose-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-red-500" />
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-rose-600 tracking-wider">Total Kategori</p>
              <span className="w-9 h-9 rounded-2xl bg-rose-100/80 flex items-center justify-center text-rose-600 text-base shadow-2xs">🌶️</span>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-extrabold text-stone-900 font-display">
                  <AnimatedCounter target={7} duration={800} />
                </p>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Kelas Citra
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700 mt-2">Varietas Cabai Nusantara</p>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {['Rawit 🔥', 'Keriting 🌶️', 'Besar 🔴', 'Paprika 🫑'].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium bg-white/90 text-stone-700 px-2 py-0.5 rounded-lg border border-rose-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Total Dataset Citra */}
          <div className="p-6 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/50 via-orange-50/20 to-white hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(245,158,11,0.1)] hover:border-amber-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-amber-700 tracking-wider">Dataset Citra</p>
              <span className="w-9 h-9 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-600 text-base shadow-2xs">📊</span>
            </div>
            <div className="mt-5">
              <p className="text-4xl font-extrabold text-stone-900 font-display">
                <AnimatedCounter target={totalDataset} duration={1400} />
              </p>
              <p className="text-xs font-semibold text-stone-700 mt-2">Gambar Citra Latih &amp; Uji</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-stone-500 font-medium">100% Kaggle Benchmark</span>
              </div>
            </div>
          </div>

          {/* Card 3: Arsitektur Model Deep Learning */}
          <div className="p-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(16,185,129,0.1)] hover:border-emerald-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Arsitektur AI</p>
              <span className="w-9 h-9 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 text-base shadow-2xs">🧠</span>
            </div>
            <div className="mt-5">
              <p className="text-3xl font-extrabold text-stone-900 font-display">CNN</p>
              <p className="text-xs font-semibold text-stone-700 mt-2">MobileNetV2 Layer</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-stone-500 font-medium">Inference Cepat &amp; Presisi</span>
              </div>
            </div>
          </div>

          {/* ── CARD 4 (BARU): TINGKAT AKURASI MODEL 95.1% ── */}
          <div className="p-6 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/50 via-pink-50/20 to-white hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(168,85,247,0.12)] hover:border-purple-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500" />
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-purple-700 tracking-wider">Tingkat Akurasi</p>
              <span className="w-9 h-9 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600 text-base shadow-2xs">⭐</span>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline gap-1.5">
                <p className="text-4xl font-extrabold text-stone-900 font-display">95.1%</p>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Optimal
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700 mt-2">Validation Test Score</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[11px] text-stone-500 font-medium">High Precision Confusion</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── KATALOG 7 JENIS CABAI: LENGKAP DENGAN FILTER TABS & DETAIL SCOVILLE ── */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Jenis Cabai yang Dideteksi</h2>
              <span className="text-xl">🌶️</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Karakteristik visual, tingkat kepedasan Scoville (SHU), dan ensiklopedia kuliner. Klik kartu untuk info botani lengkap!
            </p>
          </div>

          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 self-start md:self-auto">
            7 Varietas Lengkap
          </span>
        </div>

        {/* ── FILTER TABS INTERAKTIF ── */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          {FILTER_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/25 scale-105'
                    : 'bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-rose-50/60 border border-stone-200/80 hover:border-rose-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── GRID KARTU CABAI DENGAN INDIKATOR SCOVILLE & HOVER EFFECT ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChiliList.map((c, idx) => (
            <div
              key={`${activeCategory}-${c.name}`}
              onClick={() => setSelectedChiliModal(c)}
              onMouseEnter={() => setIsHoveredChili(c.name)}
              onMouseLeave={() => setIsHoveredChili(null)}
              style={{ animationDelay: `${idx * 65}ms` }}
              className="animate-stagger-spring p-5 rounded-3xl border border-rose-100/90 bg-white/95 backdrop-blur-xs hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(244,63,94,0.14)] hover:border-rose-300 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
              title="Klik untuk membuka detail spesifikasi botani & kuliner!"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base group-hover:text-rose-600 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-rose-500">
                        {c.badge}
                      </p>
                      <p className="text-[10px] text-stone-400 italic">
                        {c.scientificName}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.tagColor} flex-shrink-0`}>
                    {c.tag}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mt-3.5 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              {/* ── INDIKATOR TINGKAT KEPEDASAN SCOVILLE (SHU) & FLAME BAR DENGAN MAGMA SHIMMER ── */}
              <div className="mt-4 pt-3.5 border-t border-rose-100/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-stone-500 flex items-center gap-1 text-[11px]">
                    <span>Tingkat Kepedasan:</span>
                    <strong className="text-stone-800">Level {c.heat}/5</strong>
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all duration-300 ${
                    isHoveredChili === c.name && c.heat >= 4
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-105'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {c.scovilleRange}
                  </span>
                </div>
                
                {/* Visual Progress Bar Berapi dengan Animasi Magma Shimmer & Flame Glow */}
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${c.colorTheme} transition-all duration-500 shadow-xs relative overflow-hidden ${
                      isHoveredChili === c.name ? (c.heat >= 4 ? 'animate-flame-flicker' : 'brightness-110 shadow-sm') : ''
                    }`}
                    style={{ width: `${c.scovillePercent}%` }}
                  >
                    {/* Aliran Kilau Panas Magma Mengalir */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-2/5 h-full animate-magma-shimmer" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone-400">
                    {c.category === 'super_pedas' ? '🔥 Ekstrem' : c.category === 'pedas_sedang' ? '🌶️ Standar' : c.category === 'pedas_ringan' ? '🥗 Lembut' : '🫑 Manis'}
                  </span>
                  <span className="text-[10px] text-rose-500 font-bold group-hover:underline flex items-center gap-0.5">
                    Lihat Ensiklopedia ↗
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── MODAL POP-UP DETAIL ENSIKLOPEDIA BOTANI & KULINER CABAI ── */}
      {selectedChiliModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedChiliModal(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-rose-200 shadow-[0_20px_50px_rgba(244,63,94,0.2)] p-6 sm:p-7 overflow-hidden text-stone-800 animate-bubble-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Top Glow */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-200/50 blur-2xl" />

            {/* Tombol Close X */}
            <button
              type="button"
              onClick={() => setSelectedChiliModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 flex items-center justify-center transition-colors"
              aria-label="Tutup modal"
            >
              ✕
            </button>

            {/* Header Modal */}
            <div className="flex items-center gap-3.5 pr-8">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
                {selectedChiliModal.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display">
                  {selectedChiliModal.name}
                </h3>
                <p className="text-xs text-rose-600 font-semibold italic">
                  {selectedChiliModal.scientificName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedChiliModal.tagColor}`}>
                    {selectedChiliModal.tag}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {selectedChiliModal.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Meteran Scoville di Modal dengan Magma Shimmer & Flame Glow */}
            <div className="mt-5 p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100/90 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Skala Kepedasan Scoville (SHU):</span>
                <span className="font-mono font-bold text-rose-700">{selectedChiliModal.scovilleRange}</span>
              </div>
              <div className="h-2.5 w-full bg-white rounded-full overflow-hidden p-0.5 border border-rose-200/60">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${selectedChiliModal.colorTheme} shadow-xs relative overflow-hidden ${
                    selectedChiliModal.heat >= 4 ? 'animate-flame-flicker' : ''
                  }`}
                  style={{ width: `${selectedChiliModal.scovillePercent}%` }}
                >
                  {/* Gelombang Kilau Panas Magma Mengalir di Modal */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-2/5 h-full animate-magma-shimmer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Ciri Fisik Botani */}
            <div className="mt-4 space-y-3 text-xs leading-relaxed">
              <div>
                <p className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>🔬</span>
                  <span>Ciri Fisik &amp; Karakteristik Botani:</span>
                </p>
                <p className="text-stone-600 mt-1 pl-5">
                  {selectedChiliModal.characteristics}
                </p>
              </div>

              {/* Rekomendasi Kuliner Khas Nusantara */}
              <div>
                <p className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>🍲</span>
                  <span>Olahan Kuliner Nusantara:</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5 pl-5">
                  {selectedChiliModal.culinaryUses.map((dish) => (
                    <span key={dish} className="bg-white text-rose-700 border border-rose-200 px-2.5 py-0.8 rounded-lg font-medium shadow-2xs">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Khasiat Kesehatan & Nutrisi */}
              <div>
                <p className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>Kandungan Nutrisi &amp; Khasiat:</span>
                </p>
                <p className="text-stone-600 mt-1 pl-5">
                  {selectedChiliModal.healthBenefits}
                </p>
              </div>
            </div>

            {/* Footer Modal: Tombol Aksi Cepat ke Klasifikasi */}
            <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedChiliModal(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold text-xs transition-colors"
              >
                Tutup
              </button>

              <Link
                href="/dashboard/klasifikasi"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs shadow-md hover:shadow-lg shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Uji Foto Cabai Ini Sekarang</span>
                <span>📸</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── ALUR 4 LANGKAH PENGGUNAAN SISTEM ── */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">Alur Penggunaan Praktis</h2>
            <span className="text-lg">🐰✨</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Langkah mudah untuk mendeteksi varietas cabai dalam hitungan detik</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="p-5 rounded-3xl border border-rose-100/80 bg-white/90 backdrop-blur-xs hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(244,63,94,0.1)] hover:border-rose-300 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${s.color} text-white font-black text-xs flex items-center justify-center shadow-xs font-mono`}>
                  {s.num}
                </span>
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{s.icon}</span>
              </div>
              <h3 className="font-bold text-stone-900 mt-4 text-sm group-hover:text-rose-600 transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CARD AJAKAN CEPAT (CALL TO ACTION) DENGAN FLOATING MINI-PREVIEW HASIL ── */}
      <section className="p-6 sm:p-8 lg:p-9 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white shadow-[0_16px_40px_rgba(244,63,94,0.28)] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -top-10 w-48 h-48 rounded-full bg-pink-400/20 blur-xl" />

        {/* Sisi Kiri: Teks Ajakan & Tombol Utama */}
        <div className="space-y-4 text-center lg:text-left relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Siap Uji Citra Cabaimu?</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Punya Foto Cabai yang Ingin Dianalisis Sekarang?
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-lg">
              Unggah citra cabai berkualitas baik dan biarkan model MobileNetV2 mengidentifikasi jenis varietasnya dalam hitungan 0.3 detik dengan akurasi 95.1%.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link
              href="/dashboard/klasifikasi"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-rose-700 hover:text-rose-800 font-bold text-sm shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group"
            >
              <span>Unggah Cabai Sekarang</span>
              <span className="text-base group-hover:rotate-12 transition-transform duration-200">📸</span>
            </Link>

            <span className="text-[11px] text-rose-100 font-medium flex items-center gap-1.5 opacity-90">
              <span>⚡ Pemrosesan instan</span>
              <span>·</span>
              <span>🔒 100% Aman</span>
            </span>
          </div>
        </div>

        {/* Sisi Kanan: 📱 Floating Mini-Preview Hasil Klasifikasi (Floating Mockup Card) */}
        <div className="relative z-10 flex-shrink-0 animate-float-levitate">
          {/* Satellite Floating Badge Top-Right */}
          <div className="absolute -top-3.5 -right-3 z-20 bg-amber-400 text-stone-900 font-black text-[10px] px-3 py-1 rounded-full shadow-lg border border-amber-200 flex items-center gap-1 -rotate-3 hover:rotate-0 transition-transform">
            <span>✨</span>
            <span>Akurat 98.4%</span>
          </div>

          {/* Satellite Floating Badge Bottom-Left */}
          <div className="absolute -bottom-3 -left-3 z-20 bg-white/95 backdrop-blur-xs text-rose-700 font-bold text-[10px] px-2.5 py-0.8 rounded-full shadow-md border border-rose-200 flex items-center gap-1 rotate-2">
            <span>⚡</span>
            <span>0.28s Inference</span>
          </div>

          {/* Main Glassmorphic Mockup Card */}
          <Link
            href="/dashboard/klasifikasi"
            className="block w-64 sm:w-72 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.22)] border border-white/80 text-stone-800 hover:scale-[1.03] transition-all duration-300 group cursor-pointer"
            title="Klik untuk langsung coba klasifikasi!"
          >
            {/* Header Mockup */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-stone-700 tracking-wide uppercase">AI Live Detection</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                MobileNetV2
              </span>
            </div>

            {/* Simulasi Kamera Citra Cabai & Laser Scanning */}
            <div className="relative w-full h-32 rounded-2xl bg-gradient-to-br from-rose-100/90 via-pink-50 to-orange-100/80 border border-rose-200/70 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-rose-300 transition-colors">
              {/* Corner AI Brackets (Targeting Bounding Box) */}
              <div className="pointer-events-none absolute inset-2.5">
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-rose-500 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-rose-500 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-rose-500 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-rose-500 rounded-br-sm" />
              </div>

              {/* Laser Scanning Beam */}
              <div className="pointer-events-none absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-laser-scan" />

              {/* Sample Chili Icon Focus */}
              <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.35)]">
                🌶️
              </div>

              {/* Label Nama File Simulasi */}
              <div className="absolute bottom-1.5 right-2 bg-stone-900/60 backdrop-blur-xs text-white text-[8px] font-mono px-1.5 py-0.5 rounded-sm">
                sample_rawit.jpg
              </div>
            </div>

            {/* Hasil Prediksi Mini */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1 group-hover:text-rose-600 transition-colors">
                    <span>Cabai Rawit Merah</span>
                    <span className="text-xs">🔥</span>
                  </h4>
                  <p className="text-[10px] text-stone-400 italic">Capsicum frutescens</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>🟢</span>
                  <span>98.4%</span>
                </span>
              </div>

              {/* Mini Heat Meter Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[9px] text-stone-500 mb-1">
                  <span>Pedas Ekstrem</span>
                  <span className="font-mono font-bold text-rose-600">50.000+ SHU</span>
                </div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-red-600 w-full" />
                </div>
              </div>
            </div>

            {/* Tap hint */}
            <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-rose-600 font-bold">
              <span>Coba Deteksi Milikmu</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
