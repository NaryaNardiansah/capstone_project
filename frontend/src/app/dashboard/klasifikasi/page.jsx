'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CameraCapture from '../../../components/klasifikasi/CameraCapture';

/* ─── Karakter Maskot Kelinci SVG Interaktif ───────────────── */
function InteractiveRabbitSVG({ size = 56, color = '#f43f5e', earColor = '#fb7185', className = '' }) {
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

      {/* Mata Kelinci Berbinar */}
      <circle cx="50" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="70" cy="49" r="4.5" fill="#4c0519" />
      <circle cx="52" cy="47" r="1.8" fill="white" />
      <circle cx="72" cy="47" r="1.8" fill="white" />

      {/* Pipi Merona Manis */}
      <ellipse cx="44" cy="58" rx="6" ry="4" fill="#fda4af" opacity={0.7} />
      <ellipse cx="76" cy="58" rx="6" ry="4" fill="#fda4af" opacity={0.7} />
      <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill="#e11d48" />

      {/* Senyum Ramah */}
      <path d="M57 65 Q60 68 63 65" stroke="#4c0519" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Ekor & Kaki */}
      <circle cx="91" cy="84" r="10" fill="#ffe4e6" />
      <ellipse cx="42" cy="96" rx="9" ry="7" fill={color} transform="rotate(-20 42 96)" />
      <ellipse cx="78" cy="96" rx="9" ry="7" fill={color} transform="rotate(20 78 96)" />
    </svg>
  );
}

/* ─── Data Lengkap Taksonomi & Botani 7 Varietas Cabai ──────── */
const CABAI_DETAILS = {
  'Cabai Rawit Merah': {
    scientific: 'Capsicum frutescens / chinense',
    alias: 'Cabai Setan, Cabai Domba, Cabai Jablay, Red Bird Eye',
    icon: '🔥',
    bg: 'from-red-500/10 via-rose-50/40 to-white',
    border: 'border-red-200',
    colorTheme: 'from-orange-500 via-rose-500 to-red-600',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    level: 5,
    shu: '50.000 - 100.000+ SHU',
    shuPercent: 98,
    pedasLabel: 'Sangat Pedas Ekstrem',
    desc: 'Cabai rawit berukuran kecil dan gempal dengan warna oranye terang hingga merah menyala saat matang. Memiliki kadar capsaicin tertinggi di antara cabai lokal, menghasilkan rasa pedas menyengat yang langsung membakar lidah.',
    fisik: [
      'Bentuk gempal bulat lonjong dengan ujung meruncing khas',
      'Panjang buah rata-rata 2,5 - 4,5 cm dengan diameter 0,8 - 1,4 cm',
      'Warna oranye terang hingga merah darah menyala mengilap saat matang',
      'Dinding buah berair dengan rongga biji padat dan rapat',
    ],
    aromaRasa: 'Pedas tajam menusuk seketika, aroma rempah hangat yang kuat, dan sensasi panas yang awet.',
    kuliner: [
      'Sambal Bawang',
      'Sambal Korek',
      'Ayam Geprek Level Ekstrem',
      'Oseng Mercon Jogja',
      'Seblak Pedas',
    ],
    tipsPasar: [
      'Pilih buah yang keras dan padat kencang saat ditekan lembut',
      'Tangkai buah masih berwarna hijau cerah dan melekat kokoh',
      'Hindari cabai yang kulitnya mulai mengerut atau ujungnya menghitam',
    ],
  },
  'Cabai Rawit Hijau': {
    scientific: 'Capsicum frutescens L.',
    alias: 'Cabai Celeng, Rawit Lalap, Cabai Jemprit, Green Bird Eye',
    icon: '🥗',
    bg: 'from-emerald-500/10 via-teal-50/40 to-white',
    border: 'border-emerald-200',
    colorTheme: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    level: 3,
    shu: '25.000 - 50.000 SHU',
    shuPercent: 62,
    pedasLabel: 'Pedas Segar & Renyah',
    desc: 'Cabai rawit berukuran kecil dan ramping yang dipetik ketika masih berwarna hijau pekat. Sangat digemari sebagai lalapan pendamping camilan gorengan karena rasa pedasnya renyah dan tidak terlalu menyiksa di lambung.',
    fisik: [
      'Bentuk ramping silindris memanjang dengan ujung meruncing halus',
      'Panjang rata-rata 2 - 4 cm dengan diameter 0,5 - 0,8 cm',
      'Warna hijau tua pekat saat muda dan mengilap segar',
      'Kulit buah halus kencang dengan tekstur renyah saat digigit mentah',
    ],
    aromaRasa: 'Pedas renyah dengan aroma herbal segar dedaunan yang menggugah selera.',
    kuliner: [
      'Lalapan Tahu Tempe Gorengan',
      'Sambal Hijau Rawit',
      'Mie Ayam & Bakso Kuah',
      'Acar Mentah Pelengkap Sate',
    ],
    tipsPasar: [
      'Pilih yang berwarna hijau gelap pekat dan mengilap segar',
      'Batang buah masih elastis dan tidak patah mengering',
      'Pastikan tidak ada bercak cokelat bekas gigitan hama ulat',
    ],
  },
  'Cabai Merah Keriting': {
    scientific: 'Capsicum annuum var. acuminatum',
    alias: 'Cabai Keriting Merah, Lombok Abang Keriting',
    icon: '🌶️',
    bg: 'from-rose-500/10 via-pink-50/40 to-white',
    border: 'border-rose-200',
    colorTheme: 'from-pink-500 via-rose-500 to-red-600',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    level: 3,
    shu: '15.000 - 35.000 SHU',
    shuPercent: 54,
    pedasLabel: 'Pedas Sedang Harum & Berwarna',
    desc: 'Cabai merah berukuran panjang dan ramping dengan permukaan khas berkerut-kerut atau bergelombang. Memberikan pigmen merah alami yang cerah menggugah selera sekaligus aroma tumis yang gurih harum.',
    fisik: [
      'Bentuk panjang ramping dengan lekukan bergelombang (keriting)',
      'Panjang buah mencapai 10 - 16 cm dengan diameter ramping 0,7 - 1 cm',
      'Warna merah menyala berkilau saat dipanen optimal',
      'Kadar air lebih rendah dibanding cabai merah besar, cocok disimpan lebih lama',
    ],
    aromaRasa: 'Tingkat pedas seimbang dan nyaman di lambung, beraroma harum bumbu alami saat dipanaskan.',
    kuliner: [
      'Balado Dendeng & Telur',
      'Rendang Daging Sapi Minang',
      'Gulai Padang',
      'Sambal Terasi Matang',
      'Nasi Goreng Jawa',
    ],
    tipsPasar: [
      'Pilih buah yang lentur kencang dan tidak rapuh saat dibengkokkan sedikit',
      'Warna merah tua mengilap menandakan kematangan pohon yang sempurna',
      'Hindari cabai yang berkerut kusam layu atau pangkal tangkainya menghitam',
    ],
  },
  'Cabai Merah Besar': {
    scientific: 'Capsicum annuum L. var. grossum',
    alias: 'Cabai Teropong Merah, Lombok Gede, Red Chili Pepper',
    icon: '🔴',
    bg: 'from-red-500/10 via-amber-50/40 to-white',
    border: 'border-red-200',
    colorTheme: 'from-red-400 via-rose-500 to-red-700',
    badgeColor: 'bg-red-50 text-red-800 border-red-200',
    level: 2,
    shu: '5.000 - 15.000 SHU',
    shuPercent: 32,
    pedasLabel: 'Pedas Ringan & Berdaging Tebal',
    desc: 'Cabai berukuran besar, tebal, dan berbentuk lurus meruncing. Daging buahnya tebal dengan kadar air tinggi, memberikan warna merah pekat yang mewah pada kuah dan masakan tanpa rasa pedas yang menyengat.',
    fisik: [
      'Bentuk silindris lurus memanjang dan kokoh meruncing di ujungnya',
      'Panjang buah berkisar 10 - 15 cm dengan diameter tebal 1,5 - 2 cm',
      'Permukaan kulit buah mulus licin dan mengilap seperti lilin',
      'Daging buah tebal dengan rongga biji yang lapang',
    ],
    aromaRasa: 'Rasa pedas lembut dengan sedikit sentuhan manis alami buah dan aroma segar.',
    kuliner: [
      'Tumisan Sayur Lodeh & Capcay',
      'Pasta Cabai Pewarna Merah Kari',
      'Garnis Hiasan Tumpeng Nusantara',
      'Sambal Manis Tomat',
    ],
    tipsPasar: [
      'Pilih buah yang berbobot berat, padat, dan tidak berongga lembek',
      'Kulit mulus tanpa guratan luka atau memar kecokelatan',
      'Ujung buah lancip utuh dan tangkai pangkal masih segar menempel',
    ],
  },
  'Cabai Hijau Besar': {
    scientific: 'Capsicum annuum L. (fase hijau)',
    alias: 'Cabai Teropong Hijau, Lombok Ijo Besar',
    icon: '🥦',
    bg: 'from-green-500/10 via-emerald-50/40 to-white',
    border: 'border-green-200',
    colorTheme: 'from-green-500 to-emerald-600',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    level: 2,
    shu: '5.000 - 15.000 SHU',
    shuPercent: 30,
    pedasLabel: 'Pedas Ringan & Renyah Segar',
    desc: 'Versi hijau dari cabai besar yang dipanen sebelum matang sempurna. Sangat populer untuk tumisan rumahan karena teksturnya renyah, beraroma langu rempah segar yang khas, dan nyaman di tenggorokan.',
    fisik: [
      'Bentuk silindris panjang lurus dengan ujung meruncing tumpul',
      'Panjang buah rata-rata 10 - 14 cm dengan diameter kokoh 1,5 - 2 cm',
      'Warna hijau tua mengilap dengan kulit buah licin tebal',
      'Kandungan air tinggi yang memberi kerenyahan saat dimasak cepat',
    ],
    aromaRasa: 'Aroma langu dedaunan segar yang harum saat ditumis bersama bawang dan minyak panas.',
    kuliner: [
      'Oseng Tempe Cabai Hijau',
      'Tauco Udang Medan',
      'Cumi Asin Cabai Hijau',
      'Sayur Asem Khas Jawa',
    ],
    tipsPasar: [
      'Pilih yang berwarna hijau rata tanpa semburat merah atau kuning penuaan',
      'Kulit kencang saat ditekan dan tidak lembek berair',
      'Hindari buah yang kulitnya keriput atau mengeluarkan cairan berlendir',
    ],
  },
  'Cabai Hijau Keriting': {
    scientific: 'Capsicum annuum var. acuminatum (fase hijau)',
    alias: 'Cabai Keriting Hijau, Lombok Ijo Keriting',
    icon: '🌿',
    bg: 'from-teal-500/10 via-emerald-50/40 to-white',
    border: 'border-teal-200',
    colorTheme: 'from-teal-500 to-green-600',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    level: 3,
    shu: '15.000 - 30.000 SHU',
    shuPercent: 48,
    pedasLabel: 'Pedas Sedang & Harum Aromatik',
    desc: 'Cabai hijau berbentuk ramping panjang dengan lekukan gelombang yang khas. Merupakan bumbu utama rahasia kelezatan Sambal Lado Mudo khas Minang, memberikan cita rasa pedas gurih yang segar.',
    fisik: [
      'Bentuk ramping panjang berkerut-kerut atau bergelombang sepanjang buah',
      'Panjang buah rata-rata 9 - 14 cm dengan diameter ramping 0,7 - 1 cm',
      'Warna hijau segar merata dari pangkal hingga ujung buah',
      'Daging buah agak tipis namun sangat padat kandungan minyak esensial',
    ],
    aromaRasa: 'Pedas menggigit bersih dengan aroma khas cabai hijau yang tajam saat diuleg mentah.',
    kuliner: [
      'Sambal Lado Mudo Minang',
      'Dendeng Batokok Lado Ijo',
      'Ayam Goreng Sambal Hijau',
      'Gulai Cincang Ijo',
    ],
    tipsPasar: [
      'Pilih yang bertekstur liat kenyal dan tidak kering mengeras',
      'Warna hijau tua pekat menunjukkan kesegaran petik pohon terbaik',
      'Hindari cabai yang mulai menguning atau bercak hitam akibat kelembapan berlebih',
    ],
  },
  'Paprika': {
    scientific: 'Capsicum annuum Group',
    alias: 'Bell Pepper, Paprika Merah / Hijau / Kuning / Oranye',
    icon: '🫑',
    bg: 'from-amber-500/10 via-yellow-50/40 to-white',
    border: 'border-amber-200',
    colorTheme: 'from-yellow-400 via-amber-500 to-orange-500',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    level: 1,
    shu: '0 - 500 SHU',
    shuPercent: 12,
    pedasLabel: 'Manis Renyah & Sangat Lembut',
    desc: 'Varietas cabai berbentuk lonceng atau kotak dengan daging buah yang sangat tebal, renyah, dan manis berair. Paprika hampir tidak mengandung capsaicin, sehingga sangat ramah bagi penikmat kuliner yang tidak tahan pedas.',
    fisik: [
      'Bentuk kotak bulat lonceng dengan 3 sampai 4 cuping lekukan bawah',
      'Ukuran besar dengan panjang 7 - 12 cm dan diameter 6 - 9 cm',
      'Tersedia dalam warna merah cerah, hijau segar, kuning emas, atau jingga',
      'Daging buah sangat tebal (4 - 6 mm), berair banyak dan sangat renyah',
    ],
    aromaRasa: 'Rasa manis segar seperti buah apel dengan aroma manis herbal yang lembut tanpa sengatan pedas.',
    kuliner: [
      'Sapi Lada Hitam Tumis Paprika',
      'Topping Piza & Kebab Turki',
      'Salad Sayur Segar Mediterania',
      'Paprika Panggang Isi Keju',
    ],
    tipsPasar: [
      'Pilih buah yang berat padat dengan kulit luar licin mengilap kencang',
      'Hindari paprika yang memiliki lekukan berkerut atau bintik lunak berair',
      'Batang tangkai atas masih berwarna hijau segar dan kuat menempel',
    ],
  },
  'Bukan Cabai': {
    scientific: 'Non-Capsicum Object',
    alias: 'Objek Tidak Teridentifikasi sebagai Cabai',
    icon: '❓',
    bg: 'from-stone-500/10 via-stone-50/40 to-white',
    border: 'border-stone-300',
    colorTheme: 'from-stone-400 to-stone-600',
    badgeColor: 'bg-stone-100 text-stone-700 border-stone-300',
    level: 0,
    shu: '0 SHU',
    shuPercent: 0,
    pedasLabel: 'Tidak Mengandung Capsaicin',
    desc: 'Citra yang diuji tidak menunjukkan pola visual, kontur morfologi buah, maupun pigmentasi warna dari varietas buah cabai yang dikenali sistem.',
    fisik: [
      'Tidak terdeteksi bentuk lonjong, bulat, atau silindris runcing khas cabai',
      'Tidak terdeteksi adanya tangkai buah (pedicel) atau kelopak khas cabai',
      'Warna atau tekstur permukaan tidak sesuai dengan karakteristik varietas cabai',
      'Kemungkinan diakibatkan kamera tertutup, gelap, atau objek benda lain',
    ],
    aromaRasa: 'Tidak ada kandungan senyawa capsaicinoid dan tidak memiliki tingkat kepedasan.',
    kuliner: [
      'Bukan bahan kuliner cabai nusantara',
      'Gunakan buah cabai asli untuk pengenalan varietas',
    ],
    tipsPasar: [
      'Arahkan kamera tepat ke buah cabai dengan jarak sekitar 15 - 25 cm',
      'Pastikan cahaya lapak pasar cukup terang dan tidak terhalang bayangan tangan',
      'Posisikan 1 - 3 buah cabai di dalam kotak panduan tengah lalu jepret ulang',
    ],
  },
};

const getCabaiDetail = (label) => CABAI_DETAILS[label] || CABAI_DETAILS['Bukan Cabai'];

const STEPS = [
  { id: 'upload', num: '01', label: 'Foto / Unggah' },
  { id: 'analyzing', num: '02', label: 'Analisis AI' },
  { id: 'result', num: '03', label: 'Hasil Lengkap' },
];

const PHOTO_TIPS = [
  { icon: '☀️', text: 'Pencahayaan terang alami tanpa bayangan kuat' },
  { icon: '🎯', text: 'Posisikan 1–3 buah cabai tepat di tengah fokus' },
  { icon: '📐', text: 'Jarak bidik kamera ideal sekitar 15–25 cm' },
  { icon: '🔄', text: 'Gunakan kamera belakang untuk ketajaman optik maksimal' },
];

export default function KlasifikasiPage() {
  const [username, setUsername] = useState('Pengguna');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputMode, setInputMode] = useState('camera'); // 'camera' | 'upload'
  const [capturedFromCamera, setCapturedFromCamera] = useState(false);
  const [activeTabDetail, setActiveTabDetail] = useState('fisik'); // 'fisik' | 'rasa' | 'kuliner' | 'pasar'

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Pengguna';
    setUsername(user);
  }, []);

  const step = loading ? 'analyzing' : result ? 'result' : 'upload';

  const handleFile = (f) => {
    if (!f || !['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(f.type)) return;
    setFile(f);
    setResult(null);
    setError('');
    setCapturedFromCamera(false);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(f);
  };

  const handleCameraCapture = (capturedFile, previewUrl) => {
    setFile(capturedFile);
    setPreview(previewUrl);
    setCapturedFromCamera(true);
    setResult(null);
    setError('');
  };

  const handleRetake = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    setInputMode('camera');
    setCapturedFromCamera(false);
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
    setCapturedFromCamera(false);
  };

  const handlePredict = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError('');

    const fd = new FormData();
    fd.append('file', file);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
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

  const sDetail = result ? getCabaiDetail(result.predicted_class) : null;
  const confDisplay = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="space-y-8 relative pb-20">
      {/* ── Ambient Background Glows ── */}
      <div className="pointer-events-none absolute -top-16 -right-12 w-96 h-96 rounded-full bg-rose-200/35 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 -left-16 w-80 h-80 rounded-full bg-pink-100/40 blur-3xl -z-10" />

      {/* ── HEADER HALAMAN KLASIFIKASI ── */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Model AI: MobileNetV2 · 95.1% Akurasi Validasi</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight flex items-center gap-2">
              <span>Klasifikasi Varietas Cabai</span>
              <span className="text-2xl">🌶️</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Bidik langsung melalui kamera ponsel atau unggah foto cabai untuk identifikasi visual dan estimasi skala kepedasan Scoville secara real-time.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-rose-100 shadow-2xs">
            <InteractiveRabbitSVG size={36} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-rose-600 uppercase">Asisten Cerdas</p>
              <p className="text-xs font-semibold text-stone-800">Kelinci Lab Siap Memandu</p>
            </div>
          </div>
        </div>

        {/* Banner Sapaan Hangat */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/60 to-white border border-rose-100/80 flex items-center gap-3 shadow-2xs">
          <span className="text-xl">🐰✨</span>
          <p className="text-xs text-stone-700 leading-relaxed">
            Halo <strong className="text-rose-600">{username}</strong>! Posisikan cabai di tengah lensa agar model dapat mengenali tekstur kerut, warna, dan tangkai buah dengan presisi tinggi.
          </p>
        </div>
      </header>

      {/* ── GRID UTAMA: MEDIA UJI (KIRI) & HASIL (KANAN) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ── SISI KIRI (COL 7): UPLOAD & KAMERA ── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xs border border-rose-100/90 shadow-[0_12px_36px_rgba(244,63,94,0.08)] space-y-6 relative overflow-hidden">
            {/* Header Card Media Uji */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  <span>Media Uji Citra</span>
                  <span className="text-base">📸</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {preview
                    ? 'Citra siap diuji dengan model'
                    : inputMode === 'camera'
                    ? 'Bidik cabai langsung dengan kamera ponsel'
                    : 'Pilih berkas citra dari penyimpanan laptop/HP'}
                </p>
              </div>

              {file && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors cursor-pointer"
                >
                  Hapus Foto
                </button>
              )}
            </div>

            {/* Selector Mode Input: Tab Kamera Langsung vs Unggah Berkas */}
            {!preview && (
              <div className="flex rounded-2xl p-1 bg-stone-100/80 border border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setInputMode('camera')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inputMode === 'camera'
                      ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25 scale-[1.01]'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Foto Kamera Langsung</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inputMode === 'upload'
                      ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25 scale-[1.01]'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Unggah Berkas</span>
                </button>
              </div>
            )}

            {/* Area Media: Tampilkan Preview Foto ATAU Viewfinder Kamera ATAU Drop Zone Unggah */}
            {preview ? (
              <div className="space-y-4 animate-bubble-pop">
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-rose-200/80 aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center shadow-lg">
                  <img
                    src={preview}
                    alt="Pratinjau Cabai Siap Analisis"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-white/10 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{capturedFromCamera ? 'Foto Kamera Langsung' : 'Berkas Gambar Galeri'}</span>
                  </div>
                </div>

                {/* Tombol Opsi Tindakan Cepat */}
                <div className="flex gap-2.5">
                  {capturedFromCamera ? (
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Jepret Ulang Foto</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-input-id')?.click()}
                      className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Ganti Berkas</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearFile}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer active:scale-95"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : inputMode === 'camera' ? (
              /* Viewfinder Kamera Langsung */
              <div className="rounded-2xl overflow-hidden border border-rose-100 shadow-md">
                <CameraCapture
                  onCapture={handleCameraCapture}
                  onError={(msg) => setError(msg)}
                />
              </div>
            ) : (
              /* Drop Zone Berkas */
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input-id')?.click()}
                className={`relative rounded-3xl border-2 border-dashed flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] transition-all cursor-pointer
                  ${isDragOver 
                    ? 'border-rose-500 bg-rose-50/80 scale-[1.01]' 
                    : 'border-rose-200/80 hover:border-rose-400 bg-rose-50/20 hover:bg-rose-50/50'
                  }
                `}
              >
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-rose-100/80 text-rose-600 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-stone-900">
                      {isDragOver ? 'Lepaskan gambar di sini...' : 'Klik atau seret gambar cabai ke sini'}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">Dukungan format: JPG, JPEG, PNG, WEBP (Maksimal 10 MB)</p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[11px] font-semibold text-rose-600 border border-rose-200 shadow-2xs">
                    <span>📁 Pilih dari Komputer / Galeri HP</span>
                  </div>
                </div>
                <input
                  id="file-input-id"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            )}

            {/* Info Berkas Terpilih */}
            {file && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 animate-bubble-pop">
                <div className="w-11 h-11 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 text-xl shadow-2xs">
                  🌶️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">{file.name}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · {capturedFromCamera ? 'Foto Kamera Langsung' : 'Galeri Berkas'} · <span className="text-emerald-600 font-bold">Siap Dianalisis 🟢</span>
                  </p>
                </div>
              </div>
            )}

            {/* Tips Foto */}
            {!file && (
              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-rose-50/40 via-stone-50/50 to-white border border-rose-100 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Tips Foto Deteksi Akurat di Pasar:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                  {PHOTO_TIPS.map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-rose-100/60 shadow-2xs">
                      <span className="text-sm shrink-0">{tip.icon}</span>
                      <span className="leading-tight">{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Tombol Utama: Analisis Citra Sekarang */}
            <button
              type="button"
              onClick={handlePredict}
              disabled={!file || loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer
                ${!file || loading 
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/60 shadow-none' 
                  : 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 text-white hover:shadow-xl hover:shadow-rose-500/25 hover:scale-[1.01] active:scale-[0.98]'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Menganalisis Vektor Fitur MobileNetV2...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>{file ? 'Analisis Citra Cabai Sekarang' : 'Siapkan Foto Cabai Terlebih Dahulu'}</span>
                  {file && <span>⚡</span>}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── SISI KANAN (COL 5): STEPPER & HASIL PREDIKSI ── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Stepper Progres Klasifikasi */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white/95 backdrop-blur-xs border border-rose-100/90 shadow-[0_12px_36px_rgba(244,63,94,0.06)]">
            <div className="flex items-center justify-between relative px-4">
              {/* Garis Penghubung Stepper */}
              <div className="absolute left-10 right-10 top-5 h-0.5 bg-stone-200 -z-0" />
              <div 
                className="absolute left-10 top-5 h-0.5 bg-gradient-to-r from-rose-500 to-red-600 -z-0 transition-all duration-500" 
                style={{ 
                  width: step === 'upload' ? '0%' : step === 'analyzing' ? '50%' : '100%',
                  right: step === 'result' ? '10px' : 'auto'
                }} 
              />

              {STEPS.map((s) => {
                const state = getStepState(s.id);
                const isActive = state === 'active';
                const isCompleted = state === 'completed';
                return (
                  <div key={s.id} className="flex flex-col items-center gap-1.5 z-10 relative">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 shadow-2xs font-mono
                      ${isActive 
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/30 scale-110' 
                        : isCompleted 
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 font-bold' 
                        : 'bg-white border border-stone-200 text-stone-400'}`}
                    >
                      {isCompleted && s.id !== step ? '✓' : s.num}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isActive ? 'text-rose-600' : 'text-stone-400'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Hasil & Status Dinamis */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xs border border-rose-100/90 shadow-[0_12px_36px_rgba(244,63,94,0.08)] min-h-[380px] flex flex-col justify-center relative overflow-hidden">
            
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-rose-100/50 blur-2xl" />

            {/* STATE 1: MENUNGGU ANALISIS */}
            {step === 'upload' && (
              <div className="text-center py-6 space-y-4 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-center mx-auto shadow-sm">
                  <InteractiveRabbitSVG size={52} />
                </div>
                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    Laboratorium AI Siap Memindai! 🔍
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Unggah atau jepret foto cabai di sisi kiri, lalu klik tombol analisis untuk mengetahui jenis varietas dan kepedasannya.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-rose-100/70 max-w-xs mx-auto">
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
                    <p className="text-xs font-black text-rose-600">~0.3s</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Inference Cepat</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
                    <p className="text-xs font-black text-rose-600">95.1%</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Akurasi Uji</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/60">
                    <p className="text-xs font-black text-rose-600">SHU</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Skala Panas</p>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 2: SEDANG MEMPROSES ANALISIS */}
            {step === 'analyzing' && (
              <div className="text-center py-10 space-y-5 relative z-10">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-200/60 border-t-rose-600 animate-spin" />
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-3xl shadow-sm animate-pulse">
                    🌶️
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    Model Sedang Berjalan...
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold animate-pulse">
                    Mengekstrak Vektor Fitur Citra MobileNetV2
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Menghitung distribusi probabilitas 7 varietas cabai nusantara
                  </p>
                </div>
              </div>
            )}

            {/* STATE 3: HASIL LENGKAP ANALISIS */}
            {step === 'result' && result && sDetail && (
              <div className="space-y-5 relative z-10 animate-bubble-pop">
                {/* Header Hasil */}
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🎯</span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base font-display">Hasil Pengenalan Citra</h3>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${sDetail.badgeColor} shadow-2xs`}>
                    {result.predicted_class === 'Bukan Cabai' ? 'Objek Non-Cabai' : 'Identifikasi Terverifikasi'}
                  </span>
                </div>

                {/* Kartu Utama Prediksi Kategori & Morfologi */}
                <div className={`rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${sDetail.bg} border ${sDetail.border} shadow-sm space-y-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200/80 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                        {sDetail.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                          Varietas Terdeteksi
                        </p>
                        <h4 className="text-xl sm:text-2xl font-black text-stone-900 font-display mt-0.5">
                          {result.predicted_class}
                        </h4>
                        <p className="text-xs italic text-stone-500">
                          {sDetail.scientific}
                        </p>
                      </div>
                    </div>

                    {sDetail.level > 0 && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-rose-700 border border-rose-200 shadow-2xs flex-shrink-0">
                        Level {sDetail.level}/5
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {sDetail.desc}
                  </p>

                  {/* ── BAR TINGKAT KEPEDASAN SCOVILLE DENGAN MAGMA SHIMMER & FLAME GLOW ── */}
                  {sDetail.level > 0 && (
                    <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100/90 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-700 flex items-center gap-1 text-[11px]">
                          <span>Skala Panas:</span>
                          <strong className="text-rose-600">{sDetail.pedasLabel}</strong>
                        </span>
                        <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-[10px]">
                          {sDetail.shu}
                        </span>
                      </div>

                      {/* Visual Progress Bar Berapi */}
                      <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${sDetail.colorTheme} shadow-xs relative overflow-hidden ${
                            sDetail.level >= 4 ? 'animate-flame-flicker' : ''
                          }`}
                          style={{ width: `${sDetail.shuPercent}%` }}
                        >
                          {/* Aliran Kilau Panas Magma Mengalir */}
                          <div className="absolute inset-0 w-full h-full pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-2/5 h-full animate-magma-shimmer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* TAB NAVIGASI RINCIAN BOTANI & KULINER */}
                {result.predicted_class !== 'Bukan Cabai' && (
                  <div className="space-y-3">
                    <div className="flex rounded-xl p-1 bg-stone-100/80 border border-stone-200/60 text-xs">
                      {[
                        { id: 'fisik', label: '🔬 Morfologi' },
                        { id: 'rasa', label: '🌶️ Sensasi' },
                        { id: 'kuliner', label: '🍲 Kuliner' },
                        { id: 'pasar', label: '🛒 Tips Pasar' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setActiveTabDetail(t.id)}
                          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            activeTabDetail === t.id
                              ? 'bg-white text-rose-600 shadow-2xs'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Isi Tab Aktif */}
                    <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs text-xs">
                      {activeTabDetail === 'fisik' && (
                        <div className="space-y-1.5">
                          <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider mb-2">Ciri-Ciri Morfologi Fisik:</p>
                          <ul className="space-y-1 text-stone-600 leading-relaxed">
                            {sDetail.fisik.map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-rose-500 font-bold shrink-0">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeTabDetail === 'rasa' && (
                        <div className="space-y-1.5">
                          <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider mb-1">Profil Rasa & Aroma:</p>
                          <p className="text-stone-600 leading-relaxed">
                            {sDetail.aromaRasa}
                          </p>
                        </div>
                      )}

                      {activeTabDetail === 'kuliner' && (
                        <div className="space-y-2">
                          <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider mb-1.5">Rekomendasi Menu Olahan Nusantara:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {sDetail.kuliner.map((k, i) => (
                              <span key={i} className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTabDetail === 'pasar' && (
                        <div className="space-y-1.5">
                          <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider mb-2">Tips Memilih Cabai Segar di Pasar:</p>
                          <ul className="space-y-1 text-stone-600 leading-relaxed">
                            {sDetail.tipsPasar.map((t, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Jika Objek Bukan Cabai */}
                {result.predicted_class === 'Bukan Cabai' && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <span>⚠️</span>
                      <span>Saran Deteksi Lapak Pasar:</span>
                    </p>
                    <ul className="space-y-1 leading-relaxed pl-5 list-disc text-amber-800/90">
                      {sDetail.tipsPasar.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyakinan Model & Probabilitas */}
                <div className="space-y-2 pt-2 border-t border-rose-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider text-stone-500 text-[11px]">
                      Tingkat Keyakinan Model
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{confDisplay}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-700" 
                      style={{ width: `${confDisplay}%` }} 
                    />
                  </div>
                </div>

                {/* Status Penyimpanan Database Otomatis */}
                {result.database_saved && (
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-center justify-between text-emerald-800 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold">Tersimpan Aman ke Riwayat Akun</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      WebP 100%
                    </span>
                  </div>
                )}

                {/* Tombol Opsi Analisis Ulang / Lihat Riwayat */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>📸</span>
                    <span>Jepret Foto Baru</span>
                  </button>

                  <Link
                    href="/dashboard/riwayat"
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 transition-colors text-center cursor-pointer active:scale-95"
                  >
                    Lihat di Riwayat ↗
                  </Link>

                  <button
                    type="button"
                    onClick={clearFile}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer active:scale-95"
                  >
                    Reset
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
