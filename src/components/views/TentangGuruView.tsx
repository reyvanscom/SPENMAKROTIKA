import React, { useState, useEffect } from 'react';
import { APP_ASSETS } from '../../constants/assets';
import { useTheme } from '../../context/ThemeContext';
import {
  User,
  ArrowLeft,
  School,
  Sparkles,
  Camera,
  BookOpen,
  Award,
  Heart,
  Briefcase,
  GraduationCap,
  FileText,
  Printer,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  RefreshCw,
  Maximize2,
  X,
  Code,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface TentangGuruViewProps {
  onBackToHome: () => void;
}

export const TentangGuruView: React.FC<TentangGuruViewProps> = ({ onBackToHome }) => {
  const { playClick, playSuccess } = useTheme();

  // Load saved teacher photo from localStorage or fallback to realistic photo
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('spenmakro_teacher_avatar');
      return saved || APP_ASSETS.teacherPhotoReal;
    } catch {
      return APP_ASSETS.teacherPhotoReal;
    }
  });

  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'biodata' | 'kompetensi' | 'pesan'>('biodata');

  // Save changes to localStorage
  const updateAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl);
    try {
      localStorage.setItem('spenmakro_teacher_avatar', newUrl);
    } catch {}
    playSuccess();
  };

  const handleApplyPhotoUrl = () => {
    if (customPhotoInput.trim()) {
      updateAvatar(customPhotoInput.trim());
      setIsChangingPhoto(false);
      setCustomPhotoInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateAvatar(reader.result as string);
          setIsChangingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    updateAvatar(APP_ASSETS.teacherPhotoReal);
    setIsChangingPhoto(false);
  };

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation & Action Bar (Hidden when printing) */}
      <div className="print:hidden flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick();
            onBackToHome();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Utama</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-sky-500" />
            <span>Cetak Biodata</span>
          </button>
        </div>
      </div>

      {/* Main Teacher Biodata Card */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Decorative Top Accent Banner */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold border border-white/20">
            <img
              src={APP_ASSETS.logo}
              alt="Logo Resmi SMPN 5 Kroya"
              className="w-4 h-4 object-contain"
            />
            <span>SMP Negeri 5 Kroya</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 -mt-16 sm:-mt-20 relative space-y-8">
          {/* Header Row: Photo + Core Identity */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8">
            {/* Teacher Photo Frame */}
            <div className="relative group shrink-0">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800">
                <img
                  src={avatarUrl}
                  alt={`Foto Biodata Guru - ${APP_ASSETS.teacherName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />

                {/* Enlarge Trigger */}
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  title="Lihat Foto Layar Penuh"
                >
                  <Maximize2 className="w-6 h-6 drop-shadow-md" />
                </button>
              </div>

              {/* Photo Change Action Button */}
              <button
                onClick={() => {
                  playClick();
                  setIsChangingPhoto(!isChangingPhoto);
                }}
                className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-95"
                title="Ganti atau Unggah Foto Guru"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Core Titles */}
            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Biodata Pendidik & Pengembang MPI</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {APP_ASSETS.teacherName}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
                {APP_ASSETS.teacherRole}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  NIP: {APP_ASSETS.teacherNIP}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  NUPTK: {APP_ASSETS.teacherNUPTK}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
                  Kurikulum Merdeka Informatika
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Photo Selection Drawer */}
          {isChangingPhoto && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-sky-500" />
                  <span>Pilih atau Unggah Foto Biodata Guru</span>
                </h4>
                <button
                  onClick={() => setIsChangingPhoto(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preset Quick Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => updateAvatar(APP_ASSETS.teacherPhotoReal)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    avatarUrl === APP_ASSETS.teacherPhotoReal
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={APP_ASSETS.teacherPhotoReal}
                    alt="Preset Realistis Lab"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Foto Resmi Lab
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Batik formal di lab komputer
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => updateAvatar(APP_ASSETS.teacherAvatarIllustrated)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    avatarUrl === APP_ASSETS.teacherAvatarIllustrated
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={APP_ASSETS.teacherAvatarIllustrated}
                    alt="Preset Ilustrasi Digital"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Avatar Ilustrasi
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Ilustrasi digital ramah
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleResetPhoto}
                  className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
                  <span>Kembalikan ke Default</span>
                </button>
              </div>

              {/* Upload or URL custom input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-sky-500" />
                    <span>Unggah File Foto Sendiri (JPG/PNG):</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-sky-500" />
                    <span>Atau Masukkan Tautan (URL) Foto:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPhotoInput}
                      onChange={(e) => setCustomPhotoInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 text-xs border rounded-xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      onClick={handleApplyPhotoUrl}
                      className="px-3 py-1.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-500"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation for Biodata */}
          <div className="print:hidden flex border-b border-slate-200 dark:border-slate-800 gap-2">
            <button
              onClick={() => {
                playClick();
                setActiveTab('biodata');
              }}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'biodata'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil & Riwayat</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveTab('kompetensi');
              }}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'kompetensi'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Kompetensi & Portofolio</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveTab('pesan');
              }}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'pesan'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Visi & Pesan Motivasi</span>
            </button>
          </div>

          {/* TAB 1: BIODATA & RIWAYAT */}
          {(activeTab === 'biodata' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'biodata' ? 'hidden print:block' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Biodata List */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-500" />
                    <span>Identitas Pendidik</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Nama Lengkap</span>
                      <span className="font-bold text-slate-900 dark:text-white">{APP_ASSETS.teacherName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">NIP</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{APP_ASSETS.teacherNIP}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">NUPTK</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{APP_ASSETS.teacherNUPTK}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Jabatan Fungsional</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">Guru Ahli Pertama - Informatika</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Instansi / Unit Kerja</span>
                      <span className="font-bold text-slate-900 dark:text-white">{APP_ASSETS.schoolName}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Alamat Sekolah</span>
                      <span className="text-right text-slate-700 dark:text-slate-300 max-w-[200px]">{APP_ASSETS.schoolAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Pendidikan & Karir */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    <span>Pendidikan & Pengalaman</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-600">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Sarjana Komputer (S.Kom.)</h4>
                        <p className="text-slate-500">Program Studi Teknik Informatika / Ilmu Komputer</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center shrink-0 text-sky-600">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Sertifikasi Pendidik Profesi Guru (PPG)</h4>
                        <p className="text-slate-500">Bidang Keahlian Informatika Kurikulum Merdeka</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-600">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Pengalaman Mengajar & Edukator</h4>
                        <p className="text-slate-500">Membimbing peserta didik SMP kelas 7, 8, dan 9 dalam penguasaan literasi digital dan komputasi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPETENSI & PORTOFOLIO */}
          {(activeTab === 'kompetensi' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'kompetensi' ? 'hidden print:block' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 flex items-center justify-center">
                    <Code className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Berpikir Komputasional & Coding</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Mengajarkan algoritma, dekomposisi masalah, pemrograman visual Scratch/Blockly, dan dasar logika pemrograman.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sistem Komputer & Jaringan</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Eksplorasi hardware, sistem operasi, topologi jaringan LAN/WLAN, dan cara kerja internet.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Keamanan & Etika Digital</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Perlindungan data pribadi, pencegahan cyberbullying, deteksi hoaks, dan rekam jejak digital yang bijak.
                  </p>
                </div>
              </div>

              {/* Inovasi MPI */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Karya Inovasi Pembelajaran: SPENMAKRO SMART INFORMATIKA
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Aplikasi Media Pembelajaran Interaktif ini dirancang dan dikembangkan secara mandiri oleh Bapak Muhammad Rif'ani, S.Kom. untuk memfasilitasi pembelajaran Informatika yang berdiferensiasi di SMP Negeri 5 Kroya. Mengintegrasikan simulasi interaktif, asesmen diagnostik otomatis, mini game edukatif, dan penerbitan sertifikat digital instan.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: VISI & PESAN MOTIVASI */}
          {(activeTab === 'pesan' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'pesan' ? 'hidden print:block' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quote 1 */}
                <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Kata-Kata Bijak Teknologi</span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    "{APP_ASSETS.teacherQuote1}"
                  </blockquote>
                  <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    — {APP_ASSETS.teacherName}
                  </div>
                </div>

                {/* Quote 2 */}
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    <Heart className="w-4 h-4 text-amber-600" />
                    <span>Pesan Motivasi Pelajar</span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    "{APP_ASSETS.teacherQuote2}"
                  </blockquote>
                  <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    — Guru Informatika SMPN 5 Kroya
                  </div>
                </div>
              </div>

              {/* Dedikasi Guru */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800/60 dark:to-slate-800/40 border border-sky-100 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-500" />
                  <span>Komitmen Pendidikan Masa Depan</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "Menjadi guru bukan sekadar mentransfer pengetahuan teknis, melainkan menyalakan lentera keingintahuan, melatih daya nalar kritis peserta didik, dan menanamkan akhlak mulia agar generasi SMP Negeri 5 Kroya mampu menjadi kreator teknologi beretika, bukan sekadar konsumen pasif di era kecerdasan buatan."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={avatarUrl}
                alt={APP_ASSETS.teacherName}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="p-4 text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {APP_ASSETS.teacherName}
              </h3>
              <p className="text-xs text-slate-500">
                {APP_ASSETS.teacherRole} · {APP_ASSETS.schoolName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
